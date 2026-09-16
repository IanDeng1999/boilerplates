import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpAspectsModule } from "../http-aspects/http-aspects.module.ts";
import { HealthController } from "./health.controller.ts";

@Module({
  imports: [TerminusModule, HttpAspectsModule],
  controllers: [HealthController],
})
export class HealthModule {}
