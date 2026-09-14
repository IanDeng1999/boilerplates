import { OptionalProps, t } from "@mikro-orm/core";
import {
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/decorators/legacy";

export enum AuthProvider {
  PHONE = "phone",
  EMAIL = "email",
  GOOGLE = "google",
  GITHUB = "github",
}

@Entity({ tableName: "auth" })
@Unique({
  name: "auth_provider_subject_unique",
  properties: ["provider", "subject"],
})
export class Auth {
  [OptionalProps]?: "createdAt" | "updatedAt" | "verifiedAt";

  @PrimaryKey({
    type: "uuid",
    comment: "主键",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @Property({ type: t.uuid, name: "user_id", comment: "关联用户 ID" })
  userId!: string;

  @Property({ type: t.text, comment: "认证提供商" })
  provider!: AuthProvider;

  @Property({ type: t.text, comment: "提供商内唯一主体" })
  subject!: string;

  @Property({
    type: "timestamp",
    nullable: true,
    name: "verified_at",
    comment: "验证时间",
  })
  verifiedAt?: Date;

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
