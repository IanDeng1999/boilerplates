import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { z } from "zod";

const positiveInteger = z.coerce.number().int().positive();

const configSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_HOST: z.string().trim().min(1).default("0.0.0.0"),
  APP_PORT: positiveInteger.default(6363),
  SECRET: z.string().trim().min(1),
  DATABASE_URL: z.url(),
  REDIS_URL: z.url(),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  THROTTLE_TTL: positiveInteger.default(60_000),
  THROTTLE_LIMIT: positiveInteger.default(60),
  SHORT_THROTTLE_TTL: positiveInteger.default(20_000),
  SHORT_THROTTLE_LIMIT: positiveInteger.default(10),
  OSS_ENDPOINT: z.url(),
  OSS_REGION: z.string().trim().min(1),
  OSS_ACCESS_KEY_ID: z.string().trim().min(1),
  OSS_SECRET_ACCESS_KEY: z.string().trim().min(1),
  OSS_BUCKET: z.string().trim().min(1),
  ECIES_PRIVATE_KEY: z.string().trim().min(1),
  ECIES_PUBLIC_KEY: z.string().trim().min(1),
  // OAuth
  GOOGLE_CLIENT_ID: z.string().trim().min(1),
  GOOGLE_CLIENT_SECRET: z.string().trim().min(1),
  GOOGLE_REDIRECT_URI: z.string().trim().min(1),
  GITHUB_CLIENT_ID: z.string().trim().min(1),
  GITHUB_CLIENT_SECRET: z.string().trim().min(1),
  GITHUB_REDIRECT_URI: z.string().trim().min(1),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      validationSchema: configSchema,
    }),
  ],
})
export class AppConfigModule {}
