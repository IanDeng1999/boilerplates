const { mkdirSync } = require("node:fs");
const { homedir } = require("node:os");
const { join } = require("node:path");
const pino = require("pino");
const pretty = require("pino-pretty");

const prettyStream = pretty({
  colorize: true,
  translateTime: "yyyy-mm-dd HH:MM:ss.l",
  ignore: "pid,hostname",
});

const isProd = process.env.NODE_ENV === "production";
const streamArray = [prettyStream];

if (isProd) {
  const logDir = join(homedir(), ".data/unnamed/logs");
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

const logger = pino(
  {
    level: isProd ? "info" : "debug",
    customLevels: {
      log: 35,
    },
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
      err(error) {
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

module.exports.logger = logger;
module.exports.log = {
  custom: logger,
  inspect: false,
  level: "warn",
};
