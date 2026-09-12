import { ApiProperty } from "@nestjs/swagger";

export class AssetUploadResponseDto {
  @ApiProperty({
    description: "资产 ID（此时状态为 pending）",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  assetId: string;

  @ApiProperty({ description: "OSS bucket", example: "mige" })
  bucket: string;

  @ApiProperty({
    description: "对象键（OSS key）",
    example: "asset/image/202509/01932f8c-1a2b-7c3d-9e4f-5a6b7c8d9e0f.png",
  })
  key: string;

  @ApiProperty({ description: "预签名上传地址，使用 PUT 直传 OSS" })
  uploadUrl: string;

  @ApiProperty({
    description:
      "上传时必须携带的请求头；x-amz-checksum-sha256 参与签名校验，缺失或篡改会被 OSS 拒绝",
    type: Object,
    example: {
      "Content-Type": "image/png",
      "x-amz-checksum-sha256": "n4bQurw3Ct7GXlEjO1Y4lS0Fz9t2R8mH5kQ0jWc=",
    },
  })
  headers: Record<string, string>;

  @ApiProperty({ description: "上传地址有效期（秒）", example: 900 })
  expiresIn: number;

  @ApiProperty({
    description: "是否命中同内容资源（sha256 + size），命中时复用同一 key",
    example: false,
  })
  existed: boolean;
}
