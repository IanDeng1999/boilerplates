import { t } from "@mikro-orm/core";
import { Entity, Property } from "@mikro-orm/decorators/legacy";
import { EntityBase } from "./entity-base.ts";

@Entity({ tableName: "book" })
export class Book extends EntityBase {
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
}
