import { HttpStatus, Module, ValidationPipe } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { HttpContextModule } from "../../infra/http-context/http-context.module.ts";
import { PointKillModule } from "../point-kill/point-kill.module.ts";
import { DefaultFilter } from "./filters/default/default.filter.ts";
import { HttpFilter } from "./filters/http/http.filter.ts";
import { ValidationFilter } from "./filters/validation/validation.filter.ts";
import { PointKillGuard } from "./guards/point-kill.guard.ts";
import { ThrottlerGuard } from "./guards/throttler.guard.ts";
import { FormatterInterceptor } from "./interceptors/formatter/formatter.interceptor.ts";

@Module({
  imports: [HttpContextModule, PointKillModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatterInterceptor,
    },
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory(errors) {
            return errors[0];
          },
        });
      },
    },
    {
      provide: APP_FILTER,
      useClass: DefaultFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
    {
      provide: APP_GUARD,
      useClass: PointKillGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AspectsModule {}
