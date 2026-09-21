import { z } from "zod";

const booleanStringSchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

export const CONFIG_SCHEMA = z.object({
  io: z.object({
    http: z.object({
      baseURL: z.url(),
      timeout: z.coerce.number().int().positive().default(10_000),
    }),
    socket: z.object({
      url: z.url(),
      autoConnect: booleanStringSchema.default(false),
      reconnection: booleanStringSchema.default(true),
    }),
  }),
});
