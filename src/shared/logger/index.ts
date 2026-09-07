import { mkdirSync } from "node:fs";
import { join } from "node:path";
import pino from "pino";
import pretty from "pino-pretty";
import { ConfigManager } from "@/shared/config";

const prettyStream = pretty({
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss.l",
  ignore: "pid,hostname",
});

const streamArray: pino.DestinationStream[] = [prettyStream];

if (!ConfigManager.get("IS_PROD")) {
  const logDir = join(ConfigManager.get("APP_DATA_PATH"), "logs");
  mkdirSync(logDir, { recursive: true });

  streamArray.push(
    pino.transport({
      target: "pino-roll",
      options: {
        file: join(logDir, "log"),
        frequency: "daily",
        size: "20m",
        limit: { count: 3 },
        mkdir: true,
      },
    }),
  );
}

export const logger = pino(
  {
    level: ConfigManager.get("IS_PROD") ? "info" : "debug",
    formatters: {
      level: (label) => ({ level: label }),
      bindings(_bindings) {
        return {
          // ...contexts
        };
      },
    },
    serializers: {
      res(reply) {
        return {
          statusCode: reply.statusCode,
        };
      },
      err(error: Error) {
        if (!(error instanceof Error)) {
          return {
            unknownError: error,
          };
        }
        return {
          type: error.constructor.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        };
      },
      req(request) {
        return {
          method: request.method,
          url: request.url,
          path: request.routeOptions.url,
        };
      },
    },
  },
  pino.multistream(streamArray),
);
