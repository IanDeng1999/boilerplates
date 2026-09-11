import { OptionalProps, t } from "@mikro-orm/core";
import {
  Entity,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/decorators/legacy";

export enum PointKillTargetType {
  UserId = "user_id",
  Ip = "ip",
}

@Entity({ tableName: "point_kill" })
@Unique({
  name: "point_kill_target_type_target_value_unique",
  properties: ["targetType", "targetValue"],
})
@Index({
  name: "point_kill_enabled_target_idx",
  properties: ["enabled", "targetType", "targetValue"],
})
export class PointKill {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey({
    type: "uuid",
    comment: "UUID主键",
    defaultRaw: "gen_random_uuid()",
  })
  id: string;

  @Property({
    type: t.string,
    name: "target_type",
    length: 16,
    nullable: false,
    comment: "点杀目标类型：user_id 或 ip",
  })
  targetType!: PointKillTargetType;

  @Property({
    type: t.string,
    name: "target_value",
    length: 255,
    nullable: false,
    comment: "点杀目标值",
  })
  targetValue!: string;

  @Property({
    type: t.boolean,
    name: "enabled",
    default: true,
    nullable: false,
    comment: "是否启用",
  })
  enabled!: boolean;

  @Property({
    type: t.text,
    name: "reason",
    nullable: true,
    comment: "封禁原因",
  })
  reason?: string;

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
