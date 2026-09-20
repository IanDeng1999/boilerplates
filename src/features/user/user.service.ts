import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service.ts";
import type { OAuthAuthentication } from "../auth/auth.types.ts";
import { AuthProvider } from "../auth/entities/auth.entity.ts";
import { OauthService } from "../auth/oauth.service.ts";
import { User } from "./entities/user.entity.ts";
import type { CreateUserInput } from "./user.types.ts";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
  ) {}

  findById(id: string) {
    return this.userRepository.findOne({ id });
  }

  create(input: CreateUserInput) {
    const user = this.userRepository.create(input);
    this.em.persist(user);
    return user;
  }

  updateMissingProfile(user: User, input: CreateUserInput) {
    if (!user.username && input.username) user.username = input.username;
    if (!user.avatar && input.avatar) user.avatar = input.avatar;
    user.updatedAt = new Date();
    this.em.persist(user);
  }

  async loginWithPhone(phone: string) {
    const auth = await this.authService.findByProviderSubject(
      AuthProvider.PHONE,
      phone,
    );

    if (auth) {
      const user = await this.findRequiredUser(auth.userId);
      return this.createLoginResult(user);
    }

    const user = this.create({});
    // 用户 ID 由数据库生成，注册手机号前需要先落库。
    await this.em.flush();
    await this.authService.registerPhone(user.id, phone);
    return this.createLoginResult(user);
  }

  async loginWithOAuth(authentication: OAuthAuthentication) {
    const providerAuth = await this.oauthService.findByProviderSubject(
      authentication.provider,
      authentication.subject,
    );
    const emailAuth = authentication.profile.email
      ? await this.oauthService.findVerifiedEmail(authentication.profile.email)
      : null;

    if (providerAuth) {
      const user = await this.findRequiredUser(providerAuth.userId);
      await this.oauthService.updateToken(providerAuth, authentication.token);
      return this.createLoginResult(user);
    }

    if (emailAuth) {
      const user = await this.findRequiredUser(emailAuth.userId);
      this.updateMissingProfile(user, authentication.profile);
      await this.oauthService.register(
        user.id,
        authentication.provider,
        authentication.subject,
        undefined,
        authentication.token,
      );
      return this.createLoginResult(user);
    }

    const user = this.create(authentication.profile);
    // OAuth 认证及令牌记录依赖数据库生成的用户 ID。
    await this.em.flush();
    await this.oauthService.register(
      user.id,
      authentication.provider,
      authentication.subject,
      authentication.verifiedEmail ? authentication.profile.email : undefined,
      authentication.token,
    );
    return this.createLoginResult(user);
  }

  private async findRequiredUser(id: string) {
    const user = await this.findById(id);
    if (!user) throw new Error("common.internalServerError");
    return user;
  }

  private async createLoginResult(user: User) {
    return {
      sessionId: await this.authService.createSession(user.id),
      user: this.serialization(user),
    };
  }

  serialization(user: User) {
    return {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
