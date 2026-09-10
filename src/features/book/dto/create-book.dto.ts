import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
  @ApiProperty({ description: "书名", example: "示例书名" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  title: string;

  @ApiProperty({ description: "描述", example: "示例描述" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  description: string;
}
