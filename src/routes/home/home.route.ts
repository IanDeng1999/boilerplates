import type { FastifyInstance } from "fastify";

export async function homeRoute(app: FastifyInstance) {
  app.get("/", async (_req, res) => {
    return res.send("Hello world");
  });
}
