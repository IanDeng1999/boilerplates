import { Module } from "@nestjs/common";
import { CommonModule } from "./common/common.module.ts";
import { FeaturesModule } from "./features/features.module.ts";
import { InfraModule } from "./infra/infra.module.ts";

@Module({
  imports: [CommonModule, InfraModule, FeaturesModule],
})
export class AppModule {}
