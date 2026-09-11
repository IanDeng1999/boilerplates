import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerModule, Params } from "nestjs-pino";
import pino from "pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProd = config.get("NODE_ENV") === "production";
        const logDirectory = isProd
          ? join(homedir(), ".data", "unnamed", "logs")
          : "./logs";
        // 确保目录存在
        mkdirSync(logDirectory, { recursive: true });

        const fileTarget = {
          target: "pino-roll",
          options: {
            file: join(logDirectory, "app.log"),
            frequency: "daily",
            size: "10m",
            dateFormat: "yyyy-MM-dd",
            symlink: true,
            compress: true,
          },
          level: config.get("LOG_LEVEL", "debug"),
        };
        const stream = isProd
          ? pino.transport({ targets: [fileTarget] })
          : pino.transport({
              // Transport options differ by target, so share a broad option type.
              // Pino forwards these options unchanged to each transport.
              targets: [
                {
                  target: "pino-pretty",
                  options: { colorize: true },
                  level: config.get("LOG_LEVEL", "debug"),
                },
                fileTarget,
              ] as pino.TransportMultiOptions["targets"],
            });

        return {
          pinoHttp: [
            {
              customReceivedObject(req) {
                return { msg: "request in", path: req.url, method: req.method };
              },
              customSuccessObject(req, res, val) {
                return {
                  path: req.url,
                  method: req.method,
                  status: res.statusCode,
                  cost: val.responseTime,
                };
              },
              base: {
                pid: process.pid,
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
  ],
})
export class AppLoggerModule {}
