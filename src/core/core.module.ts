import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppCacheModule } from "./cache/cache.module.ts";
import { AppConfigModule } from "./config/config.module.ts";
import { CryptoService } from "./crypto/crypto.service.ts";
import { DbModule } from "./database/database.module.ts";
import { AppLoggerModule } from "./logger/logger.module.ts";
import { OssModule } from "./oss/oss.module.ts";
import { RedisModule } from "./redis/redis.module.ts";
import { AppThrottlerModule } from "./throttler/throttler.module.ts";

@Global()
@Module({
  imports: [
    AppConfigModule,
    DbModule,
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.getOrThrow("REDIS_URL"),
      }),
      inject: [ConfigService],
    }),
    OssModule,
    AppCacheModule,
    AppLoggerModule,
    AppThrottlerModule,
  ],
  providers: [CryptoService],
  exports: [CryptoService, OssModule],
})
export class CoreModule {}
