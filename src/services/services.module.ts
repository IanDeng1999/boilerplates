import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { LoggerModule, Params } from "nestjs-pino";
import pino from "pino";
import { CronjobService } from "./cronjob/cronjob.service.js";
import { DbModule } from "./db/db.module.js";
import { RedisModule } from "./redis/redis.module.js";

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
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        host: configService.get("REDIS_HOST", "127.0.0.1"),
        port: configService.get("REDIS_PORT", 6379),
        password: configService.get("REDIS_PASSWORD"),
        db: configService.get("REDIS_DB", 0),
        keyPrefix: configService.get("REDIS_KEY_PREFIX"),
        enableOfflineQueue: configService.get(
          "REDIS_ENABLE_OFFLINE_QUEUE",
          true,
        ),
        maxRetriesPerRequest: configService.get("REDIS_MAX_RETRIES", 3),
      }),
      inject: [ConfigService],
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
      inject: [ConfigService],
      imports: [],
      useFactory: (config: ConfigService) => ({
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
      }),
    }),
  ],
  providers: [CronjobService],
})
export class ServicesModule {}
