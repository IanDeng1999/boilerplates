import { sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "@/shared/db";

export async function healthRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/api/health",
    schema: {
      response: {
        200: z.object({
          status: z.string(),
          timestamp: z.string(),
          database: z.string(),
        }),
      },
    },
    handler: async () => {
      let database = "disconnected";
      try {
        await db.execute(sql`SELECT 1`);
        database = "connected";
      } catch {
        // database unreachable
      }

      return {
        status: database === "connected" ? "ok" : "degraded",
        timestamp: new Date().toISOString(),
        database,
      };
    },
  });
}
