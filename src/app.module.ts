import { Module } from "@nestjs/common";
import { CoreModule } from "./core/core.module.ts";
import { FeaturesModule } from "./features/features.module.ts";

@Module({
  imports: [CoreModule, FeaturesModule],
})
export class AppModule {}
