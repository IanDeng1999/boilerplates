import { join } from "node:path";
import { Module } from "@nestjs/common";
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from "nestjs-i18n";
import { CoreModule } from "./core/core.module.ts";
import { FeaturesModule } from "./features/features.module.ts";

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: "zh",
      loader: I18nJsonLoader,
      loaderOptions: { path: join(import.meta.dirname, "i18n"), watch: true },
      resolvers: [AcceptLanguageResolver],
    }),
    CoreModule,
    FeaturesModule,
  ],
})
export class AppModule {}
