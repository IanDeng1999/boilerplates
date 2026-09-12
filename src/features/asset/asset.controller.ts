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
import { AssetStatusResponseDto } from "./dto/asset-status-response.dto.ts";
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
      "入参为文件列表，返回与入参同序的预签名上传地址数组（PUT），客户端直传 OSS。上传时需携带响应中的 headers，且请求体大小必须等于 size，否则会被 OSS 拒绝。同一批内 sha256 + size 相同的文件共用同一 key，只需上传一次。",
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
      "由 OSS 事件通知（S3 兼容格式）触发的 webhook。按事件中的对象 key 反查资产，再以 HeadObject 为准将资产由 pending 流转为 ready（内容大小或校验和不符则标为 failed）。幂等：已 ready 的资产直接返回，不重复回源；对象尚未出现时保持 pending。非本 bucket、非 ObjectCreated 或未登记的 key 会被忽略，返回空数组。",
  })
  @ApiSuccessResponse({
    status: 200,
    description: "处理完成，返回被更新资产的最新状态；无关对象返回空数组",
    type: AssetStatusResponseDto,
    isArray: true,
  })
  @ApiValidationErrorResponse()
  async handleUploadCallback(@Body() dto: OssUploadCallbackDto) {
    return this.assetService.handleUploadCallback(dto);
  }
}
