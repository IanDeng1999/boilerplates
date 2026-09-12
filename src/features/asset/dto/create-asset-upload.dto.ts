import { ApiProperty } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";
import { MAX_UPLOAD_SIZE } from "../types/asset.type.ts";

export class CreateAssetUploadDto {
  @ApiProperty({ description: "原始文件名（含扩展名）", example: "cover.png" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: "MIME 类型", example: "image/png" })
  @IsString()
  @Matches(/^[\w.+-]+\/[\w.+-]+$/, { message: "mimeType 格式不正确" })
  mimeType: string;

  @ApiProperty({
    description: "文件大小（字节），上传时请求体必须与之一致",
    example: 204800,
    maximum: MAX_UPLOAD_SIZE,
  })
  @IsInt()
  @Min(1)
  @Max(MAX_UPLOAD_SIZE)
  size: number;

  @ApiProperty({
    description: "文件内容 SHA-256（hex）",
    example: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  })
  @IsString()
  @Matches(/^[0-9a-f]{64}$/i, { message: "sha256 必须是 64 位十六进制字符串" })
  sha256: string;
}
