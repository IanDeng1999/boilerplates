import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Inject, Injectable } from "@nestjs/common";
import type { Redis } from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { REDIS_CLIENT } from "../../infra/redis/redis.module.ts";
import { Auth, AuthProvider } from "./entities/auth.entity.ts";

@Injectable()
export class AuthService {
  private readonly sessionTtl = 7 * 24 * 60 * 60;

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

  createSession(userId: string) {
    return this.persistSession(userId);
  }

  async logout(sessionId: string) {
    await this.redisClient.del(`session:${sessionId}`);
  }

  private async persistSession(userId: string) {
    const sessionId = uuidv4();
    await this.redisClient.hset(
      `session:${sessionId}`,
      "data",
      JSON.stringify({ id: userId }),
    );
    await this.redisClient.expire(`session:${sessionId}`, this.sessionTtl);
    return sessionId;
  }
}
