import { OptionalProps, t } from "@mikro-orm/core";
import { Entity, PrimaryKey, Property } from "@mikro-orm/decorators/legacy";

@Entity({ tableName: "account" })
export class Account {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey({
    type: "uuid",
    comment: "主键",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "用户名",
  })
  username!: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "邮箱",
  })
  email!: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "头像URL",
  })
  avatar!: string;

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
