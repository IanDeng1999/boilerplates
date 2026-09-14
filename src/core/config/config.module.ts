import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { configSchema } from "./config.const.ts";

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
