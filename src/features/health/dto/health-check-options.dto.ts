import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Max } from "class-validator";

export class HealthCheckOptionsDto {
  @ApiPropertyOptional({
    description: "Node 堆内存上限，单位为字节",
    default: 512 * 1024 * 1024,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  memoryLimitBytes = 512 * 1024 * 1024;

  @ApiPropertyOptional({
    description: "PostgreSQL 探测超时时间，单位为毫秒",
    default: 3_000,
    maximum: 60_000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(60_000)
  databaseTimeoutMs = 3_000;

  @ApiPropertyOptional({
    description: "Redis 和 OSS 探测超时时间，单位为毫秒",
    default: 1_000,
    maximum: 60_000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(60_000)
  dependencyTimeoutMs = 1_000;
}
