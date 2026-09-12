import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { REDIS_CLIENT } from "../../infra/redis/redis.module.ts";
import type {
  GitHubUserInfo,
  GoogleUserInfo,
  OAuthTokenResponse,
} from "./auth.types.ts";
import { Account } from "./entities/account.entity.ts";
import {
  OAuthProvider,
  OAuthProviderType,
} from "./entities/oauth-provider.entity.ts";

const OAUTH_ENDPOINTS = {
  google: {
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scope: "openid email profile",
  },
  github: {
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scope: "read:user user:email",
  },
} as const;

@Injectable()
export class AuthService {
  private readonly SESSION_TTL = 7 * 24 * 60 * 60; // 7 days in seconds

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: EntityRepository<Account>,
    @InjectRepository(OAuthProvider)
    private readonly oauthProviderRepository: EntityRepository<OAuthProvider>,
    private readonly em: EntityManager,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly configService: ConfigService,
  ) {}

  /** OAuth 配置走 ConfigService：模块作用域读 process.env 会早于 .env 加载 */
  private oauthConfig(provider: OAuthProviderType) {
    const prefix = provider.toUpperCase();
    return {
      ...OAUTH_ENDPOINTS[provider],
      clientId: this.configService.getOrThrow<string>(`${prefix}_CLIENT_ID`),
      clientSecret: this.configService.getOrThrow<string>(
        `${prefix}_CLIENT_SECRET`,
      ),
      redirectUri: this.configService.getOrThrow<string>(
        `${prefix}_REDIRECT_URI`,
      ),
    };
  }

  /**
   * 生成OAuth授权URL
   */
  getOAuthRedirectUrl(provider: OAuthProviderType): {
    url: string;
    state: string;
  } {
    const config = this.oauthConfig(provider);

    const state = uuidv4();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
      access_type: "offline",
      prompt: "consent",
    });

    // GitHub不支持prompt参数
    if (provider === "github") {
      params.delete("prompt");
      params.delete("access_type");
    }

    return {
      url: `${config.authorizationUrl}?${params.toString()}`,
      state,
    };
  }

  /**
   * 处理OAuth回调，创建或更新账户
   */
  async handleOAuthCallback(
    provider: OAuthProviderType,
    code: string,
  ): Promise<{ sessionId: string; account: Account }> {
    // 1. 用授权码换取访问令牌
    const tokenData = await this.exchangeCodeForToken(provider, code);

    // 2. 获取用户信息
    const userInfo = await this.getUserInfo(provider, tokenData.access_token);

    // 3. 查找或创建账户
    const account = await this.findOrCreateAccount(
      provider,
      userInfo,
      tokenData,
    );

    // 4. 创建会话
    const sessionId = await this.createSession(account);

    return { sessionId, account };
  }

  /**
   * 用授权码换取访问令牌
   */
  private async exchangeCodeForToken(
    provider: OAuthProviderType,
    code: string,
  ): Promise<OAuthTokenResponse> {
    const config = this.oauthConfig(provider);

    const body: Record<string, string> = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    };

    // GitHub需要额外的Accept头
    const headers: Record<string, string> = {};
    if (provider === "github") {
      headers.Accept = "application/json";
    }

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `OAuth token exchange failed: ${response.status}`,
        errorText,
      );
      throw new BadGatewayException("获取访问令牌失败");
    }

    const data = await response.json();

    // GitHub 返回的是 application/x-www-form-urlencoded 格式，且授权码无效时
    // 仍是 HTTP 200 + error 字段，需要单独判断
    if (provider === "github") {
      const params = new URLSearchParams(data);
      const error = params.get("error");
      if (error) {
        throw new BadGatewayException(
          `GitHub 授权失败：${params.get("error_description") ?? error}`,
        );
      }
      return {
        access_token: params.get("access_token") || "",
        token_type: params.get("token_type") || "",
        scope: params.get("scope") || "",
      };
    }

    return data as OAuthTokenResponse;
  }

  /**
   * 获取用户信息
   */
  private async getUserInfo(
    provider: OAuthProviderType,
    accessToken: string,
  ): Promise<GoogleUserInfo | GitHubUserInfo> {
    const config = this.oauthConfig(provider);

    const response = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new BadGatewayException("获取用户信息失败");
    }

    return response.json();
  }

  /**
   * 查找或创建账户
   */
  private async findOrCreateAccount(
    provider: OAuthProviderType,
    userInfo: GoogleUserInfo | GitHubUserInfo,
    tokenData: OAuthTokenResponse,
  ): Promise<Account> {
    const providerId = this.getProviderId(provider, userInfo);

    // 查找现有的OAuth关联
    const existingOAuth = await this.oauthProviderRepository.findOne(
      { provider, providerId },
      { populate: ["account"] },
    );

    if (existingOAuth) {
      // 更新访问令牌
      existingOAuth.accessToken = tokenData.access_token;
      existingOAuth.refreshToken = tokenData.refresh_token;
      existingOAuth.updatedAt = new Date();
      this.em.persist(existingOAuth);
      await this.em.flush();
      return existingOAuth.account;
    }

    // 提取用户信息
    const { username, email, avatar } = this.extractUserInfo(
      provider,
      userInfo,
    );

    // 查找或创建账户（通过邮箱匹配）
    let account = email
      ? await this.accountRepository.findOne({ email })
      : null;

    if (!account) {
      account = this.accountRepository.create({
        username,
        email,
        avatar,
      });
      this.em.persist(account);
    }

    // 创建OAuth关联
    const oauthProvider = this.oauthProviderRepository.create({
      provider,
      providerId,
      account,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
    });
    this.em.persist(oauthProvider);

    // 更新账户信息（如果需要）
    if (!account.username && username) {
      account.username = username;
    }
    if (!account.avatar && avatar) {
      account.avatar = avatar;
    }
    account.updatedAt = new Date();
    this.em.persist(account);

    await this.em.flush();
    return account;
  }

  /**
   * 获取提供商用户ID
   */
  private getProviderId(
    provider: OAuthProviderType,
    userInfo: GoogleUserInfo | GitHubUserInfo,
  ): string {
    if (provider === "google") {
      return (userInfo as GoogleUserInfo).id;
    }
    return String((userInfo as GitHubUserInfo).id);
  }

  /**
   * 提取用户信息
   */
  private extractUserInfo(
    provider: OAuthProviderType,
    userInfo: GoogleUserInfo | GitHubUserInfo,
  ) {
    if (provider === "google") {
      const googleUser = userInfo as GoogleUserInfo;
      return {
        username: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
      };
    }

    const githubUser = userInfo as GitHubUserInfo;
    return {
      username: githubUser.login,
      email: githubUser.email,
      avatar: githubUser.avatar_url,
    };
  }

  /**
   * 创建会话
   */
  private async createSession(account: Account): Promise<string> {
    const sessionId = uuidv4();
    const key = `session:${sessionId}`;
    const sessionData = JSON.stringify({
      id: account.id,
      username: account.username,
      email: account.email,
    });

    await this.redisClient.hset(key, "data", sessionData);
    await this.redisClient.expire(key, this.SESSION_TTL);

    return sessionId;
  }

  /**
   * 获取账户信息
   */
  async getAccountById(id: string): Promise<Account | null> {
    return this.accountRepository.findOne({ id });
  }

  /**
   * 登出，删除会话
   */
  async logout(sessionId: string): Promise<void> {
    await this.redisClient.del(`session:${sessionId}`);
  }

  /**
   * 序列化账户信息
   */
  serialization(account: Account) {
    return {
      id: account.id,
      username: account.username,
      email: account.email,
      avatar: account.avatar,
      createdAt: account.createdAt,
    };
  }
}
