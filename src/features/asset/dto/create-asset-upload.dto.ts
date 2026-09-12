import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from "class-validator";
import {
  ALLOWED_EXTENSION_PATTERN,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPE_PATTERN,
  MAX_UPLOAD_BATCH_SIZE,
  MAX_UPLOAD_SIZE,
} from "../types/asset.type.ts";

export class CreateAssetUploadDto {
  @ApiProperty({
    description: `原始文件名（含扩展名），仅支持 ${ALLOWED_EXTENSIONS.join("/")}`,
    example: "cover.png",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(ALLOWED_EXTENSION_PATTERN, {
    message: "不支持的扩展名：$value",
  })
  name: string;

  @ApiProperty({
    description: "MIME 类型，仅支持 image/* 与 video/*",
    example: "image/png",
  })
  @IsString()
  @Matches(ALLOWED_MIME_TYPE_PATTERN, {
    message: "mimeType 仅支持 image/* 或 video/*，且格式须为 type/subtype",
  })
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

export class CreateAssetUploadsDto {
  @ApiProperty({
    description: `待上传文件列表，最多 ${MAX_UPLOAD_BATCH_SIZE} 个；返回结果顺序与之一致`,
    type: [CreateAssetUploadDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_UPLOAD_BATCH_SIZE)
  @ValidateNested({ each: true })
  @Type(() => CreateAssetUploadDto)
  items: CreateAssetUploadDto[];
}
