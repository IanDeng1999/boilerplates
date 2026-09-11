import { ApiProperty } from "@nestjs/swagger";

class HealthCheckDetailDto {
  @ApiProperty({ enum: ["up", "down"], example: "up" })
  status: "up" | "down";

  @ApiProperty({ example: 12, required: false })
  responseTime?: number;

  @ApiProperty({ example: "timeout of 1000ms exceeded", required: false })
  message?: string;
}

export class HealthResponseDto {
  @ApiProperty({ enum: ["ok", "error"], example: "ok" })
  status: "ok" | "error";

  @ApiProperty({ type: HealthCheckDetailDto, isArray: false })
  info: Record<string, HealthCheckDetailDto>;

  @ApiProperty({ type: HealthCheckDetailDto, isArray: false })
  error: Record<string, HealthCheckDetailDto>;

  @ApiProperty({ type: HealthCheckDetailDto, isArray: false })
  details: Record<string, HealthCheckDetailDto>;
}
