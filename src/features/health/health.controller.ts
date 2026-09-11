import { MikroORM } from "@mikro-orm/core";
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
  MemoryHealthIndicator,
} from "@nestjs/terminus";
import { SkipThrottle } from "@nestjs/throttler";
import type { Redis } from "ioredis";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "#src/common/swagger/api-response.decorator.js";
import { OssService } from "../../infra/oss/oss.service.ts";
import { REDIS_CLIENT } from "../../infra/redis/redis.module.ts";
import { SkipPointKill } from "../aspects/guards/point-kill.guard.ts";
import { HealthCheckOptionsDto } from "./dto/health-check-options.dto.ts";
import { HealthResponseDto } from "./dto/health-response.dto.ts";

@Controller("health")
@ApiTags("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicator: HealthIndicatorService,
    private readonly orm: MikroORM,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly oss: OssService,
    private readonly memory: MemoryHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(200)
  @HealthCheck({ swaggerDocumentation: false })
  @SkipThrottle()
  @SkipPointKill()
  @ApiOperation({ summary: "检查应用及外部依赖健康状态" })
  @ApiHeader({
    name: "auth",
    required: true,
    example: "94a16a88-bc52-4bf3-8b74-da4c5b037e82",
    description: "必须与服务端 SECRET 一致",
  })
  @ApiBody({
    type: HealthCheckOptionsDto,
    description: "健康检查阈值；省略字段时使用默认值。",
  })
  @ApiSuccessResponse({
    status: 200,
    description: "PostgreSQL、Redis、OSS 与内存均可用",
    type: HealthResponseDto,
  })
  @ApiErrorResponse({
    status: 401,
    description: "auth 请求头无效",
  })
  @ApiErrorResponse({
    status: 503,
    description: "至少一项依赖不可用或超时",
  })
  async check(
    @Headers("auth") auth: string | undefined,
    @Body()
    options: HealthCheckOptionsDto,
  ) {
    if (auth !== this.configService.getOrThrow("SECRET")) {
      throw new UnauthorizedException();
    }
    const settings = Object.assign(new HealthCheckOptionsDto(), options);

    const checks = {
      database: () =>
        this.indicator
          .check("database")
          .attempt(() => this.orm.em.getConnection().execute("select 1"))
          .withTimeout(settings.databaseTimeoutMs),
      redis: () =>
        this.indicator
          .check("redis")
          .attempt(async () => {
            await this.redis.ping();
          })
          .withTimeout(settings.dependencyTimeoutMs),
      oss: () =>
        this.indicator
          .check("oss")
          .attempt(({ signal }) => this.oss.checkConnectivity(signal))
          .withTimeout(settings.dependencyTimeoutMs),
      memory_heap: () =>
        this.memory.checkHeap("memory_heap", settings.memoryLimitBytes),
    };

    try {
      return await this.health.check(Object.values(checks));
    } catch (e) {
      if (e instanceof ServiceUnavailableException) {
        e.cause = "health_check";
      }
      throw e;
    }
  }
}
