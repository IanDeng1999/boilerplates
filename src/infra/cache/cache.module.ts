import { createKeyv } from "@keyv/redis";
import { CacheModule as NestCacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(config.getOrThrow("REDIS_URL"), {
            namespace: "cache",
          }),
        ],
        ttl: 60_000,
      }),
    }),
  ],
})
export class AppCacheModule {}
