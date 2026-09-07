import { describe, expect, it } from "vitest";
import { z } from "zod";
import { HTTPError } from "../shared/errors";
import { createApp } from "../shared/fastify";

describe("errorMiddleware", () => {
  it("should handle HTTPError", async () => {
    const app = createApp({ logger: false });

    app.get("/http-error", () => {
      throw new HTTPError("Not found", 404, "NOT_FOUND");
    });

    await app.ready();
    const response = await app.inject({
      method: "GET",
      url: "/http-error",
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      error: "HTTPError",
      code: "NOT_FOUND",
      message: "Not found",
    });

    await app.close();
  });

  it("should handle Zod validation error", async () => {
    const app = createApp({ logger: false });

    app.post(
      "/",
      {
        schema: {
          body: z.object({
            name: z.string().min(4),
          }),
        },
      },
      async (req, rep) => {
        return rep.status(200).send(req.body);
      },
    );

    await app.ready();
    const response = await app.inject({
      method: "POST",
      url: "/",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "hi" }),
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().error).toBe("ValidationError");
    expect(response.json().code).toBe("VALIDATION_ERROR");
    expect(response.json().details).toBeDefined();

    await app.close();
  });

  it("should handle runtime error", async () => {
    const app = createApp({ logger: false });

    app.get("/runtime-error", () => {
      throw new Error("Something went wrong");
    });

    await app.ready();
    const response = await app.inject({
      method: "GET",
      url: "/runtime-error",
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toEqual({
      statusCode: 500,
      error: "InternalServerError",
      code: "INTERNAL_ERROR",
      message: "Internal server error",
    });

    await app.close();
  });
});
