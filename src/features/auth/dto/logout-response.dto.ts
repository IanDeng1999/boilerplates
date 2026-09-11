import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDto {
  @ApiProperty({ description: "是否已成功退出登录", example: true })
  success: boolean;
}
