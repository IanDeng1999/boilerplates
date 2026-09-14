import { OptionalProps, t } from "@mikro-orm/core";
import {
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/decorators/legacy";
import { Auth } from "./auth.entity.ts";

@Entity({ tableName: "oauth" })
export class Oauth {
  [OptionalProps]?: "createdAt" | "updatedAt" | "accessToken" | "refreshToken";

  @PrimaryKey({
    type: "uuid",
    comment: "主键",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @OneToOne(() => Auth, {
    name: "auth_id",
    owner: true,
    createForeignKeyConstraint: false,
    comment: "OAuth 对应认证（逻辑外键）",
  })
  auth!: Auth;

  @Property({ type: t.text, name: "access_token", nullable: true })
  accessToken?: string;

  @Property({ type: t.text, name: "refresh_token", nullable: true })
  refreshToken?: string;

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
