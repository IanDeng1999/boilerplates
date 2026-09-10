import { createKeyv } from "@keyv/redis";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import type { Redis } from "ioredis";
import { LoggerModule, Params } from "nestjs-pino";
import pino from "pino";
import { CronjobService } from "./cronjob/cronjob.service.js";
import { CryptoService } from "./crypto/crypto.service.js";
import { DbModule } from "./db/db.module.js";
import { PointKill } from "./db/entities/point-kill.entity.js";
import { HttpContextService } from "./http-context/http-context.service.js";
import { OssService } from "./oss/oss.service.js";
import { PointKillService } from "./point-kill/point-kill.service.js";
import { REDIS_CLIENT, RedisModule } from "./redis/redis.module.js";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        // load remote config
        async () => {
          const isProd = process.env.NODE_ENV === "prod";

          return {
            IS_PROD: isProd,
          };
        },
      ],
    }),
    DbModule,
    MikroOrmModule.forFeature([PointKill]),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        url: configService.getOrThrow("REDIS_URL"),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(config.getOrThrow("REDIS_URL"), { namespace: "cache" }),
        ],
        ttl: 60_000,
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        console.log(config.get("LOG_LEVEL"));

        const stream = pino.transport({
          targets: [
            {
              target: "pino-pretty",
              options: { colorize: true },
              level: config.get("LOG_LEVEL", "debug"),
            },
            {
              target: "pino-roll",
              options: {
                file: "./logs/app.log",
                frequency: "daily",
                size: "10m",
                mkdir: true,
                symlink: true,
                compress: true,
              },
              level: config.get("LOG_LEVEL", "debug"),
            },
          ],
        });

        return {
          pinoHttp: [
            {
              customReceivedObject(req) {
                return {
                  msg: "request in",
                  path: req.url,
                  method: req.method,
                };
              },
              customSuccessObject(req, res, val) {
                return {
                  path: req.url,
                  method: req.method,
                  status: res.statusCode,
                  cost: val.responseTime,
                };
              },
              customErrorObject(req, res, _error, val) {
                return {
                  path: req.url,
                  method: req.method,
                  status: res.statusCode,
                  cost: val.responseTime,
                };
              },
              quietReqLogger: true,
              quietResLogger: true,
              level: config.get("LOG_LEVEL", "debug"),
            },
            stream,
          ] satisfies Params["pinoHttp"],
        } satisfies Params;
      },
    }),

    ThrottlerModule.forRootAsync({
      inject: [ConfigService, REDIS_CLIENT],
      imports: [],
      useFactory: (config: ConfigService, redis: Redis) => {
        redis.set("niubi", "haha");
        return {
          storage: new ThrottlerStorageRedisService(redis),
          throttlers: [
            {
              name: "default",
              ttl: config.get("THROTTLE_TTL", 60000), // 60秒
              limit: config.get("THROTTLE_LIMIT", 60), // 100次请求
            },
            {
              name: "short",
              ttl: config.get("SHORT_THROTTLE_TTL", 20000),
              limit: config.get("SHORT_THROTTLE_LIMIT", 10),
            },
          ],
        };
      },
    }),
  ],
  providers: [
    CronjobService,
    CryptoService,
    OssService,
    PointKillService,
    HttpContextService,
  ],
  exports: [CryptoService, OssService, PointKillService, HttpContextService],
})
export class ServicesModule {}
