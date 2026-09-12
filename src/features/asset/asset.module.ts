import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { OssModule } from "../../infra/oss/oss.module.ts";
import { AspectsModule } from "../aspects/aspects.module.ts";
import { HttpContextModule } from "../http-context/http-context.module.ts";
import { AssetController } from "./asset.controller.ts";
import { AssetService } from "./asset.service.ts";
import { Asset } from "./entities/asset.entity.ts";

@Module({
  imports: [
    MikroOrmModule.forFeature([Asset]),
    OssModule,
    AspectsModule,
    HttpContextModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
