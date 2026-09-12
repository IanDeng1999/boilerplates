import { OptionalProps, t } from "@mikro-orm/core";
import {
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/decorators/legacy";
import { Account } from "../../auth/entities/account.entity.ts";

export enum AssetKind {
  Image = "image",
  Video = "video",
  Audio = "audio",
  File = "file",
}

export enum AssetStatus {
  Pending = "pending",
  Ready = "ready",
  Failed = "failed",
}

@Entity({ tableName: "asset" })
@Unique({ name: "asset_key_unique", properties: ["key"] })
@Unique({ name: "asset_sha256_size_unique", properties: ["sha256", "size"] })
@Index({ name: "asset_uploader_idx", properties: ["uploader", "createdAt"] })
@Index({ name: "asset_kind_idx", properties: ["kind", "status"] })
export class Asset {
  [OptionalProps]?:
    | "createdAt"
    | "updatedAt"
    | "kind"
    | "size"
    | "meta"
    | "status";

  @PrimaryKey({
    type: "uuid",
    comment: "主键（雪花ID）",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @Property({
    type: t.text,
    nullable: false,
    comment: "OSS bucket",
  })
  bucket!: string;

  @Property({
    type: t.text,
    nullable: false,
    comment: "对象键（OSS key）",
  })
  key!: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "公共/CDN 地址；私有桶可空",
  })
  url?: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "原始文件名",
  })
  name?: string;

  @Property({
    type: t.text,
    nullable: true,
    comment: "扩展名",
  })
  ext?: string;

  @Property({
    type: t.text,
    name: "mime_type",
    nullable: false,
    comment: "MIME 类型",
  })
  mimeType!: string;

  @Property({
    type: t.text,
    length: 16,
    default: AssetKind.File,
    nullable: false,
    comment: "媒体类型：image 图片 / video 视频 / audio 音频 / file 其他",
  })
  kind: AssetKind = AssetKind.File;

  @Property({
    type: "bigint",
    default: 0,
    nullable: false,
    comment: "文件大小（字节）",
  })
  size = 0;

  @Property({
    type: t.text,
    nullable: true,
    comment: "内容哈希（去重/校验）",
  })
  sha256?: string;

  @Property({
    type: "integer",
    nullable: true,
    comment: "图片/视频宽度",
  })
  width?: number;

  @Property({
    type: "integer",
    nullable: true,
    comment: "图片/视频高度",
  })
  height?: number;

  @Property({
    type: "integer",
    nullable: true,
    comment: "音视频时长（秒）",
  })
  duration?: number;

  @Property({
    type: t.json,
    nullable: false,
    defaultRaw: "'{}'::jsonb",
    comment: "扩展元数据（EXIF/编码等）",
  })
  meta: Record<string, unknown> = {};

  @Property({
    type: t.text,
    length: 16,
    default: AssetStatus.Pending,
    nullable: false,
    comment: "状态：pending 待确认 / ready 已就绪 / failed 失败",
  })
  status: AssetStatus = AssetStatus.Pending;

  @ManyToOne(() => Account, {
    name: "uploader_id",
    nullable: true,
    createForeignKeyConstraint: false,
    comment: "上传者（逻辑外键），空表示系统资源",
  })
  uploader?: Account;

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
