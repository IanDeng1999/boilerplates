import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class RequestPhoneCodeDto {
  @ApiProperty({ example: "+8613800138000" })
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/)
  phone!: string;
}
