import z from "zod";

export const configSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(25050),
  HOST: z.string().default("0.0.0.0"),
  CLIENT_URLS: z.string().default("http://0.0.0.0:25050"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SNOWFLAKE_EPOCH: z.string().default("2026-01-01T00:00:00.000Z"),
  DATABASE_URL: z
    .string()
    .default("postgresql://user:password@host:port/database"),
  REDIS_URL: z.url().default("redis://127.0.0.1:6379"),
  RATE_LIMIT_MAX: z.number().int().positive().default(100),
  RATE_LIMIT_TTL: z.number().int().positive().default(60),
});

export type ConfigSchemaType = z.infer<typeof configSchema>;
