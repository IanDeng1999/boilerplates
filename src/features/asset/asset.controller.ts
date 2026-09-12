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
import { CreateAssetUploadDto } from "./dto/create-asset-upload.dto.ts";

@ApiTags("资产")
@Controller("api/asset")
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post("upload-url")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "获取上传地址",
    description:
      "返回预签名上传地址（PUT），由客户端直传 OSS。上传时需携带响应中的 headers，且请求体大小必须等于 size，否则会被 OSS 拒绝。",
  })
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功",
    type: AssetUploadResponseDto,
  })
  @ApiErrorResponse({ status: 401, description: "未登录或会话已过期" })
  @ApiValidationErrorResponse()
  async createUploadUrl(
    @Body() createAssetUploadDto: CreateAssetUploadDto,
    @CurrentAccount() account: AuthedAccount,
  ) {
    return this.assetService.createUploadUrl(createAssetUploadDto, account.id);
  }
}
