import { Module } from "@nestjs/common";
import { CronjobService } from "./cronjob.service.ts";

@Module({
  providers: [CronjobService],
})
export class CronjobModule {}
