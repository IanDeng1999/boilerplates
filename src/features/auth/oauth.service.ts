import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v4 as uuidv4 } from "uuid";
import { OAUTH_ENDPOINTS } from "./auth.const.ts";
import type {
  GitHubUserInfo,
  GoogleUserInfo,
  OAuthProfile,
  OAuthTokenResponse,
} from "./auth.types.ts";
import { Auth, AuthProvider } from "./entities/auth.entity.ts";
import { Oauth } from "./entities/oauth.entity.ts";

export type OAuthProvider = AuthProvider.GOOGLE | AuthProvider.GITHUB;
type OAuthUserInfo = GoogleUserInfo | GitHubUserInfo;

@Injectable()
export class OauthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: EntityRepository<Auth>,
    @InjectRepository(Oauth)
    private readonly oauthRepository: EntityRepository<Oauth>,
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {}

  getRedirectUrl(provider: AuthProvider) {
    this.assertProvider(provider);
    const config = this.config(provider);
    const state = uuidv4();
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scope,
      state,
      ...(provider === AuthProvider.GOOGLE
        ? { access_type: "offline", prompt: "consent" }
        : {}),
    });
    return { url: `${config.authorizationUrl}?${params.toString()}`, state };
  }

  async authenticate(provider: AuthProvider, code: string) {
    this.assertProvider(provider);
    const token = await this.exchangeCode(provider, code);
    const profile = await this.fetchProfile(provider, token.access_token);
    return {
      provider,
      subject: this.subject(provider, profile),
      profile: this.userProfile(provider, profile),
      verifiedEmail: this.hasVerifiedEmail(provider, profile),
      token,
    };
  }

  async findByProviderSubject(provider: AuthProvider, subject: string) {
    return this.authRepository.findOne({ provider, subject });
  }

  async findVerifiedEmail(email: string) {
    return this.authRepository.findOne({
      provider: AuthProvider.EMAIL,
      subject: email,
      verifiedAt: { $ne: null },
    });
  }

  async register(
    userId: string,
    provider: OAuthProvider,
    subject: string,
    email: string | undefined,
    token: OAuthTokenResponse,
  ) {
    const auth = this.authRepository.create({
      userId,
      provider,
      subject,
      verifiedAt: new Date(),
    });
    this.em.persist(auth);
    if (email) {
      this.em.persist(
        this.authRepository.create({
          userId,
          provider: AuthProvider.EMAIL,
          subject: email,
          verifiedAt: new Date(),
        }),
      );
    }
    await this.em.flush();
    await this.updateToken(auth, token);
    return auth;
  }

  private config(provider: OAuthProvider) {
    const endpoint = OAUTH_ENDPOINTS[provider];
    const prefix = provider.toUpperCase();
    return {
      ...endpoint,
      clientId: this.configService.getOrThrow<string>(`${prefix}_CLIENT_ID`),
      clientSecret: this.configService.getOrThrow<string>(
        `${prefix}_CLIENT_SECRET`,
      ),
      redirectUri: this.configService.getOrThrow<string>(
        `${prefix}_REDIRECT_URI`,
      ),
    };
  }

  async updateToken(auth: Auth, token: OAuthTokenResponse) {
    let oauth = await this.oauthRepository.findOne({ auth });
    if (!oauth) oauth = this.oauthRepository.create({ auth });
    oauth.accessToken = token.access_token;
    oauth.refreshToken = token.refresh_token;
    oauth.updatedAt = new Date();
    this.em.persist(oauth);
    await this.em.flush();
  }

  private async exchangeCode(provider: OAuthProvider, code: string) {
    const config = this.config(provider);
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(provider === AuthProvider.GITHUB
          ? { Accept: "application/json" }
          : {}),
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!response.ok) throw new BadGatewayException("获取访问令牌失败");
    return (await response.json()) as OAuthTokenResponse;
  }

  private async fetchProfile(provider: OAuthProvider, accessToken: string) {
    const response = await fetch(this.config(provider).userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new BadGatewayException("获取用户信息失败");
    return (await response.json()) as OAuthUserInfo;
  }

  private subject(provider: OAuthProvider, profile: OAuthUserInfo) {
    return provider === AuthProvider.GOOGLE
      ? (profile as GoogleUserInfo).id
      : String((profile as GitHubUserInfo).id);
  }

  private userProfile(
    provider: OAuthProvider,
    profile: OAuthUserInfo,
  ): OAuthProfile {
    if (provider === AuthProvider.GOOGLE) {
      const user = profile as GoogleUserInfo;
      return { username: user.name, avatar: user.picture, email: user.email };
    }
    const user = profile as GitHubUserInfo;
    return {
      username: user.login,
      avatar: user.avatar_url,
      email: user.email ?? undefined,
    };
  }

  private hasVerifiedEmail(provider: OAuthProvider, profile: OAuthUserInfo) {
    return (
      provider === AuthProvider.GOOGLE &&
      Boolean((profile as GoogleUserInfo).verified_email)
    );
  }

  private assertProvider(provider: string): asserts provider is OAuthProvider {
    if (!Object.hasOwn(OAUTH_ENDPOINTS, provider)) {
      throw new BadRequestException("不支持的 OAuth 提供商");
    }
  }
}
