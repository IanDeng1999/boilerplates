import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../user/dto/user-response.dto.ts";

export class PhoneLoginResponseDto {
  @ApiProperty({ description: "访问令牌", format: "uuid" })
  accessToken: string;

  @ApiProperty({ description: "令牌类型", example: "Bearer" })
  tokenType: string;

  @ApiProperty({ description: "令牌有效期，单位为秒", example: 604800 })
  expiresIn: number;

  @ApiProperty({ description: "当前用户", type: UserResponseDto })
  user: UserResponseDto;
}
