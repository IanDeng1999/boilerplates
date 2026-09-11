import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ThrottlerModule as NestThrottlerModule } from "@nestjs/throttler";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../redis/redis.module.ts";

@Module({
  imports: [
    NestThrottlerModule.forRootAsync({
      imports: [],
      inject: [ConfigService, REDIS_CLIENT],
      useFactory: (config: ConfigService, redis: Redis) => ({
        storage: new ThrottlerStorageRedisService(redis),
        throttlers: [
          {
            name: "default",
            ttl: config.get("THROTTLE_TTL", 60_000),
            limit: config.get("THROTTLE_LIMIT", 60),
          },
          {
            name: "short",
            ttl: config.get("SHORT_THROTTLE_TTL", 20_000),
            limit: config.get("SHORT_THROTTLE_LIMIT", 10),
          },
        ],
      }),
    }),
  ],
})
export class AppThrottlerModule {}
