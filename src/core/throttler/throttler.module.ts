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
            ttl: config.getOrThrow("THROTTLE_TTL"),
            limit: config.getOrThrow("THROTTLE_LIMIT"),
          },
          {
            name: "short",
            ttl: config.getOrThrow("SHORT_THROTTLE_TTL"),
            limit: config.getOrThrow("SHORT_THROTTLE_LIMIT"),
          },
        ],
      }),
    }),
  ],
})
export class AppThrottlerModule {}
