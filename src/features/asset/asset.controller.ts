import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiValidationErrorResponse,
} from "#src/common/swagger/api-response.decorator.ts";
import { CurrentAccount } from "../aspects/decorators/context.decorator.ts";
import { AuthGuard } from "../auth/guards/auth.guard.ts";
import { AssetService } from "./asset.service.ts";
import { AssetUploadResponseDto } from "./dto/asset-upload-response.dto.ts";
import { CreateAssetUploadsDto } from "./dto/create-asset-upload.dto.ts";
import { OssUploadCallbackDto } from "./dto/oss-upload-callback.dto.ts";

@ApiTags("资产")
@Controller("api/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post("upload-urls")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "批量获取上传地址",
    description:
      "返回与入参同序的预签名 PUT 地址，客户端直传 OSS；需携带响应中的 headers，请求体大小须等于 size。同批内 sha256 相同的文件共用同一 key。",
  })
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功，顺序与入参一致",
    type: AssetUploadResponseDto,
    isArray: true,
  })
  @ApiErrorResponse({ status: 401, description: "未登录或会话已过期" })
  @ApiValidationErrorResponse()
  async createUploadUrls(
    @Body() dto: CreateAssetUploadsDto,
    @CurrentAccount() account: AuthedAccount,
  ) {
    return this.assetService.createUploadUrls(dto, account.id);
  }

  @Post("upload-callback")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "OSS 对象事件回调",
    description:
      "OSS 事件通知（S3 兼容）webhook。按对象 key（服务端会先 URL 解码）反查资产，把 pending 流转为 ready；幂等，重复投递不会重复流转。已 ready 的资产不参与流转，未登记的对象、非本 bucket 或非 ObjectCreated 事件直接忽略。",
  })
  @ApiSuccessResponse({
    status: 200,
    description: "处理完成",
    type: "boolean",
  })
  @ApiValidationErrorResponse()
  async handleUploadCallback(@Body() dto: OssUploadCallbackDto) {
    return this.assetService.handleUploadCallback(dto);
  }
}
