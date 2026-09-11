import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateBookDto {
  @ApiProperty({ description: "书名", example: "示例书名", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  title?: string;

  @ApiProperty({ description: "描述", example: "示例描述", required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  description?: string;
}
