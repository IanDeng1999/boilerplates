import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { OssModule } from "../../infra/oss/oss.module.ts";
import { HealthController } from "./health.controller.ts";

@Module({
  imports: [TerminusModule, OssModule],
  controllers: [HealthController],
})
export class HealthModule {}
