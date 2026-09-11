import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ForbiddenException, Inject, Injectable, Scope } from "@nestjs/common";
import type { Cache } from "cache-manager";
import {
  PointKill,
  PointKillTargetType,
} from "../../infra/database/entities/point-kill.entity.ts";
import { HttpContextService } from "../../infra/http-context/http-context.service.ts";

const CACHE_TTL = 60_000;

@Injectable({ scope: Scope.REQUEST })
export class PointKillService {
  constructor(
    @InjectRepository(PointKill)
    private readonly pointKillRepository: EntityRepository<PointKill>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly httpContextService: HttpContextService,
  ) {}

  async assertRequestAllowed() {
    const ip = this.httpContextService.getClientIp();
    if (ip && (await this.isBlocked(PointKillTargetType.Ip, ip))) {
      throw new ForbiddenException("当前 IP 已被禁止访问");
    }

    const userId = await this.httpContextService.getUserIdFromSession();
    if (userId && (await this.isBlocked(PointKillTargetType.UserId, userId))) {
      throw new ForbiddenException("当前用户已被禁止访问");
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
    await this.cacheManager.set(cacheKey, blocked, CACHE_TTL);
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
