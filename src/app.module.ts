import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module.js";
import { FeaturesModule } from "./features/features.module.js";
import { InfraModule } from "./infra/core.module.ts";

@Module({
  imports: [CommonModule, InfraModule, FeaturesModule],
})
export class AppModule {}
