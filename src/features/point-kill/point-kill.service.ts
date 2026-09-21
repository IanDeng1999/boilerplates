import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ForbiddenException, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Cache } from "cache-manager";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../core/redis/redis.module.ts";
import { sessionKey } from "../auth/auth.const.ts";
import { getBearerToken } from "../auth/guards/auth.guard.ts";
import {
  PointKill,
  PointKillTargetType,
} from "./entities/point-kill.entity.ts";
import { POINT_KILL_CACHE_TTL } from "./point-kill.const.ts";

@Injectable({ scope: Scope.REQUEST })
export class PointKillService {
  constructor(
    @InjectRepository(PointKill)
    private readonly pointKillRepository: EntityRepository<PointKill>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(REQUEST) private readonly request: FastifyRequest,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  async assertRequestAllowed() {
    const ip = this.request.ip ?? this.request.socket.remoteAddress;
    if (ip && (await this.isBlocked(PointKillTargetType.Ip, ip))) {
      throw new ForbiddenException("access.ipBlocked");
    }

    const userId = await this.getUserIdFromSession();
    if (userId && (await this.isBlocked(PointKillTargetType.UserId, userId))) {
      throw new ForbiddenException("access.userBlocked");
    }
  }

  private async getUserIdFromSession() {
    const sessionId = getBearerToken(this.request.headers.authorization);
    if (!sessionId) return undefined;

    const sessionData = await this.redisClient.hget(
      sessionKey(sessionId),
      "data",
    );
    if (!sessionData) return undefined;

    try {
      const session = JSON.parse(sessionData) as { id?: unknown };
      return typeof session.id === "string" ? session.id : undefined;
    } catch {
      return undefined;
    }
  }

  async isBlocked(targetType: PointKillTargetType, targetValue: string) {
    const cacheKey = `point-kill:${targetType}:${encodeURIComponent(targetValue)}`;
    const cached = await this.cacheManager.get<boolean>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const blocked = !!(await this.pointKillRepository.findOne({
      targetType,
      targetValue,
      enabled: true,
    }));
    await this.cacheManager.set(cacheKey, blocked, POINT_KILL_CACHE_TTL);
    return blocked;
  }

  async block(
    targetType: PointKillTargetType,
    targetValue: string,
    reason?: string,
  ) {
    const rule = await this.pointKillRepository.upsert({
      targetType,
      targetValue,
      enabled: true,
      reason,
    });
    await this.invalidate(targetType, targetValue);
    return rule;
  }

  async unblock(targetType: PointKillTargetType, targetValue: string) {
    await this.pointKillRepository.nativeUpdate(
      { targetType, targetValue },
      { enabled: false },
    );
    return this.invalidate(targetType, targetValue);
  }

  async invalidate(targetType: PointKillTargetType, targetValue: string) {
    return this.cacheManager.del(
      `point-kill:${targetType}:${encodeURIComponent(targetValue)}`,
    );
  }
}
