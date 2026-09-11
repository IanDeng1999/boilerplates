import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { LoggerModule, Params } from "nestjs-pino";
import pino from "pino";

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
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
