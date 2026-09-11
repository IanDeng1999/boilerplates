import { OptionalProps, t } from "@mikro-orm/core";
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/decorators/legacy";
import { Account } from "./account.entity.ts";

export enum OAuthProviderType {
  GOOGLE = "google",
  GITHUB = "github",
}

@Entity({ tableName: "oauth_provider" })
export class OAuthProvider {
  [OptionalProps]?: "createdAt" | "updatedAt" | "accessToken" | "refreshToken";

  @PrimaryKey({
    type: "uuid",
    comment: "主键",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @Property({
    type: t.text,
    name: "provider",
    comment: "OAuth提供商类型",
  })
  provider!: OAuthProviderType;

  @Property({
    type: t.text,
    name: "provider_id",
    comment: "提供商用户ID",
  })
  providerId!: string;

  @ManyToOne(() => Account, {
    name: "account_id",
    comment: "关联账户",
    createForeignKeyConstraint: false,
  })
  account!: Account;

  @Property({
    type: t.text,
    name: "access_token",
    nullable: true,
    comment: "访问令牌",
  })
  accessToken?: string;

  @Property({
    type: t.text,
    name: "refresh_token",
    nullable: true,
    comment: "刷新令牌",
  })
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
