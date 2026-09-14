import { Module } from "@nestjs/common";
import { OssService } from "./oss.service.ts";

@Module({
  providers: [OssService],
  exports: [OssService],
})
export class OssModule {}
