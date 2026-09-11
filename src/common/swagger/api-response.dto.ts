import { ApiProperty } from "@nestjs/swagger";

export class ApiSuccessResponseDto {
  @ApiProperty({ description: "业务状态码；0 表示成功", example: 0 })
  code: number;

  @ApiProperty({ description: "响应消息", example: "success" })
  msg: string;
}

export class ApiErrorResponseDto {
  @ApiProperty({ description: "业务错误码", example: "40400" })
  code: string | number;

  @ApiProperty({ description: "错误消息", example: "书籍不存在" })
  msg: string;

  @ApiProperty({
    description: "请求日志 ID",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  logId: string;
}

export class ApiValidationErrorResponseDto {
  @ApiProperty({ description: "业务错误码", example: 42200 })
  code: number;

  @ApiProperty({ description: "错误消息", example: "Unprocessable Entity" })
  msg: string;

  @ApiProperty({
    description: "字段校验错误详情",
    example: { title: "title must be shorter than or equal to 10 characters" },
  })
  detail: Record<string, string>;
}
