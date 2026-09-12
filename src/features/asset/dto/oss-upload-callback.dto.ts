import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

/**
 * S3 兼容存储（MinIO / RustFS 等）对象事件通知的请求体。
 * 结构参考 AWS S3 Event Notification，多余字段会被 ValidationPipe 忽略。
 */

export class OssEventBucketDto {
  @ApiProperty({ description: "Bucket 名称", example: "mige" })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OssEventObjectDto {
  @ApiProperty({
    description: "对象键（URL 编码，空格为 +）；服务端解码后与库中 key 匹配",
    example: "asset%2Ffile%2F202609%2Fxxx.csv",
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: "对象字节数", required: false, example: 1268 })
  @IsOptional()
  size?: number;

  @ApiProperty({ description: "对象 ETag", required: false })
  @IsOptional()
  @IsString()
  eTag?: string;
}

export class OssEventS3Dto {
  @ApiProperty({ type: OssEventBucketDto })
  @ValidateNested()
  @Type(() => OssEventBucketDto)
  bucket: OssEventBucketDto;

  @ApiProperty({ type: OssEventObjectDto })
  @ValidateNested()
  @Type(() => OssEventObjectDto)
  object: OssEventObjectDto;
}

export class OssEventRecordDto {
  @ApiProperty({ description: "事件名称", example: "s3:ObjectCreated:Put" })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ type: OssEventS3Dto })
  @ValidateNested()
  @Type(() => OssEventS3Dto)
  s3: OssEventS3Dto;
}

export class OssUploadCallbackDto {
  @ApiProperty({ type: [OssEventRecordDto], description: "对象事件记录" })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OssEventRecordDto)
  Records: OssEventRecordDto[];
}
