import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PointKill } from "../../infra/database/entities/point-kill.entity.ts";
import { HttpContextModule } from "../../infra/http-context/http-context.module.ts";
import { PointKillService } from "./point-kill.service.ts";

@Module({
  imports: [MikroOrmModule.forFeature([PointKill]), HttpContextModule],
  providers: [PointKillService],
  exports: [PointKillService],
})
export class PointKillModule {}
