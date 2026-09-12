import { ApiProperty } from "@nestjs/swagger";
import { AssetStatus } from "../entities/asset.entity.ts";

export class AssetStatusResponseDto {
  @ApiProperty({
    description: "资产 ID",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  assetId: string;

  @ApiProperty({
    enum: AssetStatus,
    description: "资产状态：pending 待上传 / ready 已就绪",
    example: AssetStatus.Ready,
  })
  status: AssetStatus;
}
