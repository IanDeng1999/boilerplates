import stringify from "fast-safe-stringify";
import type { FastifyInstance } from "fastify";
import status from "statuses";
import { ConfigManager } from "@/shared/config";

interface FastifyLikeError extends Error {
  statusCode?: number;
  code?: string | number;
  validation?: unknown[];
}

export function errorMiddleware(app: FastifyInstance) {
  app.setErrorHandler((error: unknown, req, res) => {
    const isProd = ConfigManager.get("IS_PROD");
    if (!(error instanceof Error)) {
      error = new Error(stringify(error));
    }

    const err = error as FastifyLikeError;

    // JavaScript runtime error
    req.log.error(
      {
        err,
      },
      "Internal Server Error",
    );

    return res.status(err.statusCode ?? 500).send({
      c: err.statusCode,
      m: isProd ? status(err.statusCode ?? 500) : err.message,
      d: isProd ? void 0 : stringify(err),
    });
  });

  app.setNotFoundHandler((_request, reply) => {
    return reply.status(404).send({
      c: 40400,
      m: status(404),
    });
  });
}
