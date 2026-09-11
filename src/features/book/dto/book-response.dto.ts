import { ApiProperty } from "@nestjs/swagger";

export class BookResponseDto {
  @ApiProperty({
    description: "书籍唯一标识",
    format: "uuid",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  id: string;

  @ApiProperty({ description: "书名", example: "百年孤独", maxLength: 10 })
  title: string;

  @ApiProperty({
    description: "书籍描述",
    example: "魔幻现实主义经典",
    maxLength: 10,
  })
  description: string;
}

export class DeleteBookResponseDto {
  @ApiProperty({ description: "是否已成功删除", example: true })
  deleted: boolean;
}
