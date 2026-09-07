import path from "node:path";
import fastifyCors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import appRootPath from "app-root-path";
import Fastify, { type FastifyBaseLogger, type FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { errorMiddleware } from "../../middleware/error.middleware";
import { ConfigManager } from "../config";
import { configUnWatch, configWatch } from "../config/watch";
import { closeDb } from "../db";
import { genTwitterSnowflakeId } from "../id";
import { logger } from "../logger";
import emitter, { clearAllEvents } from "../mitt";
import { closeRedis } from "../redis";
import { createSocketServer } from "../socket";

export interface CreateAppOptions {
  logger?: boolean;
}

export function createApp(_options: CreateAppOptions = {}): FastifyInstance {
  const app = Fastify({
    genReqId() {
      return genTwitterSnowflakeId(true);
    },
    loggerInstance: logger as FastifyBaseLogger,
    disableRequestLogging: false,
    requestIdLogLabel: "reqId",
  });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  errorMiddleware(app);
  app.register(fastifyCors, {
    origin: ConfigManager.get("CLIENT_URLS").split(","),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  });

  app.register(rateLimit, {
    max: ConfigManager.get("RATE_LIMIT_MAX"),
    timeWindow: ConfigManager.get("RATE_LIMIT_TTL") * 1000,
  });
  app.register(fastifyStatic, {
    root: path.join(appRootPath.path, "public"),
    prefix: "/",
  });

  const io = createSocketServer(app);

  configWatch();

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
      app.log.info({ signal }, "Received signal, shutting down gracefully");
      await io.close((err) => {
        if (err) {
          console.log(err);
          app.log.error({ err }, "Failed to close IO");
        } else {
          app.log.info("IO closed successfully");
        }
      });
      await app.close();
      emitter.emit("app:shutdown");
      clearAllEvents();
      configUnWatch();
      await closeDb();
      await closeRedis();
      process.exit(0);
    });
  }

  return app;
}

export async function createTestApp(): Promise<FastifyInstance> {
  const app = createApp({ logger: false });
  await app.ready();
  return app;
}
