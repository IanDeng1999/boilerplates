import { Module } from "@nestjs/common";
import { PointKillModule } from "../point-kill/point-kill.module.ts";
import { DefaultFilter } from "./filters/default/default.filter.ts";
import { HttpFilter } from "./filters/http/http.filter.ts";
import { ValidationFilter } from "./filters/validation/validation.filter.ts";
import { PointKillGuard } from "./guards/point-kill.guard.ts";
import { ThrottlerGuard } from "./guards/throttler.guard.ts";
import { FormatterInterceptor } from "./interceptors/formatter/formatter.interceptor.ts";

@Module({
  imports: [PointKillModule],
  providers: [
    DefaultFilter,
    HttpFilter,
    ValidationFilter,
    PointKillGuard,
    ThrottlerGuard,
    FormatterInterceptor,
  ],
  exports: [
    PointKillModule,
    DefaultFilter,
    HttpFilter,
    ValidationFilter,
    PointKillGuard,
    ThrottlerGuard,
    FormatterInterceptor,
  ],
})
export class HttpAspectsModule {}
