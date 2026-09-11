import { ApiProperty } from "@nestjs/swagger";

export class AccountResponseDto {
  @ApiProperty({
    description: "账户唯一标识",
    format: "uuid",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  id: string;

  @ApiProperty({
    description: "用户名",
    example: "example-user",
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: "邮箱",
    example: "user@example.com",
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: "头像地址",
    example: "https://example.com/avatar.png",
    required: false,
  })
  avatar?: string;

  @ApiProperty({ description: "创建时间", example: "2026-09-11T12:00:00.000Z" })
  createdAt: Date;
}
