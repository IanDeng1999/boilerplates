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
    const user = auth ? await this.findById(auth.userId) : this.create({});
    if (!user) throw new Error("认证关联的用户不存在");
    if (!auth) {
      await this.em.flush();
      await this.authService.registerPhone(user.id, phone);
    }
    await this.em.flush();
    return {
      sessionId: await this.authService.createSession(user.id),
      user: this.serialization(user),
    };
  }

  async loginWithOAuth(authentication: OAuthAuthentication) {
    const existingAuth = await this.oauthService.findByProviderSubject(
      authentication.provider,
      authentication.subject,
    );
    const emailAuth = authentication.profile.email
      ? await this.oauthService.findVerifiedEmail(authentication.profile.email)
      : null;
    const isNewUser = !existingAuth && !emailAuth;
    const user = existingAuth
      ? await this.findById(existingAuth.userId)
      : emailAuth
        ? await this.findById(emailAuth.userId)
        : this.create(authentication.profile);
    if (!user) throw new Error("认证关联的用户不存在");

    if (!existingAuth) {
      if (emailAuth) this.updateMissingProfile(user, authentication.profile);
      if (isNewUser) await this.em.flush();
      await this.oauthService.register(
        user.id,
        authentication.provider,
        authentication.subject,
        authentication.verifiedEmail && !emailAuth
          ? authentication.profile.email
          : undefined,
        authentication.token,
      );
    } else {
      await this.oauthService.updateToken(existingAuth, authentication.token);
    }

    await this.em.flush();
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
