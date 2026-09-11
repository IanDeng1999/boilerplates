import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        async () => ({
          IS_PROD: process.env.NODE_ENV === "prod",
        }),
      ],
    }),
  ],
})
export class AppConfigModule {}
