import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { REDIS_CLIENT } from "../../core/redis/redis.module.ts";
import { SESSION_TTL_SECONDS, sessionKey } from "./auth.const.ts";
import { Auth, AuthProvider } from "./entities/auth.entity.ts";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: EntityRepository<Auth>,
    private readonly em: EntityManager,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  findByProviderSubject(provider: AuthProvider, subject: string) {
    return this.authRepository.findOne({ provider, subject });
  }

  async registerPhone(userId: string, phone: string) {
    const auth = this.authRepository.create({
      userId,
      provider: AuthProvider.PHONE,
      subject: phone,
      verifiedAt: new Date(),
    });
    this.em.persist(auth);
    await this.em.flush();
    return auth;
  }

  async logout(sessionId: string) {
    await this.redisClient.del(sessionKey(sessionId));
  }

  async createSession(userId: string) {
    const sessionId = uuidv4();
    await this.redisClient.hset(
      sessionKey(sessionId),
      "data",
      JSON.stringify({ id: userId }),
    );
    await this.redisClient.expire(sessionKey(sessionId), SESSION_TTL_SECONDS);
    return sessionId;
  }
}
