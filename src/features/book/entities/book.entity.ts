import { OptionalProps, t } from "@mikro-orm/core";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ tableName: "book" })
export class Book {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey({
    type: "uuid",
    comment: "主键（雪花ID）",
    defaultRaw: "gen_random_uuid()",
  })
  @ApiProperty({
    description: "主键（雪花ID）",
    example: "1234567890123456789",
  })
  id: string;

  @Property({
    type: t.text,
    name: "title",
    length: 10,
    nullable: false,
    comment: "用户昵称",
  })
  title!: string;

  @Property({
    type: t.text,
    name: "description",
    length: 10,
    nullable: false,
    comment: "用户昵称",
  })
  description!: string;

  @Property({
    type: "timestamp",
    comment: "创建时间",
    defaultRaw: "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ description: "创建时间", example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;

  @Property({
    type: "timestamp",
    comment: "更新时间",
    defaultRaw: "CURRENT_TIMESTAMP",
  })
  @ApiProperty({ description: "更新时间", example: "2024-01-01T00:00:00.000Z" })
  updatedAt: Date;
}
