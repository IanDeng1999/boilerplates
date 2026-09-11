import { OptionalProps, t } from "@mikro-orm/core";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "book" })
export class Book {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey({
    type: "uuid",
    comment: "UUID主键",
    defaultRaw: "gen_random_uuid()",
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
  createdAt: Date;

  @Property({
    type: "timestamp",
    comment: "更新时间",
    defaultRaw: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
