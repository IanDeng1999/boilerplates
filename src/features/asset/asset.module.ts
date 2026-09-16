import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HttpAspectsModule } from "../http-aspects/http-aspects.module.ts";
import { User } from "../user/entities/user.entity.ts";
import { AssetController } from "./asset.controller.ts";
import { AssetService } from "./asset.service.ts";
import { Asset } from "./entities/asset.entity.ts";

@Module({
  imports: [MikroOrmModule.forFeature([Asset, User]), HttpAspectsModule],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
