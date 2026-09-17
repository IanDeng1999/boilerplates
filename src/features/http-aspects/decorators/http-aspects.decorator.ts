import {
  applyDecorators,
  HttpStatus,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { DefaultFilter } from "../filters/default/default.filter.ts";
import { HttpFilter } from "../filters/http/http.filter.ts";
import { ValidationFilter } from "../filters/validation/validation.filter.ts";
import { PointKillGuard } from "../guards/point-kill.guard.ts";
import { ThrottlerGuard } from "../guards/throttler.guard.ts";
import { FormatterInterceptor } from "../interceptors/formatter/formatter.interceptor.ts";

export function UseCommonHttpAspects() {
  return applyDecorators(
    UseInterceptors(FormatterInterceptor),
    UsePipes(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory(errors) {
          return errors[0];
        },
      }),
    ),
    UseFilters(DefaultFilter, HttpFilter, ValidationFilter),
    UseGuards(PointKillGuard, ThrottlerGuard),
  );
}
