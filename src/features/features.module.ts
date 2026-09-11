import { Module } from "@nestjs/common";
import { AspectsModule } from "./aspects/aspects.module.ts";
import { BookModule } from "./book/book.module.ts";
import { CronjobModule } from "./cronjob/cronjob.module.ts";
import { PointKillModule } from "./point-kill/point-kill.module.ts";

@Module({
  imports: [AspectsModule, BookModule, PointKillModule, CronjobModule],
})
export class FeaturesModule {}
