import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class RequestPhoneCodeDto {
  @ApiProperty({ example: "+8613800138000" })
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: "手机号必须为 E.164 格式，例如 +8613800138000",
  })
  phone!: string;
}
