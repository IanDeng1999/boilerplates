import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PointKill } from "./entities/point-kill.entity.ts";
import { PointKillService } from "./point-kill.service.ts";

@Module({
  imports: [MikroOrmModule.forFeature([PointKill])],
  providers: [PointKillService],
  exports: [PointKillService],
})
export class PointKillModule {}
