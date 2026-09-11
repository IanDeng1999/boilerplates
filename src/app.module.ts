import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { HttpStatus, Module, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { DefaultFilter } from "./aspects/filters/default/default.filter.ts";
import { HttpFilter } from "./aspects/filters/http/http.filter.ts";
import { ValidationFilter } from "./aspects/filters/validation/validation.filter.ts";
import { PointKillGuard } from "./aspects/guards/point-kill.guard.ts";
import { FormatterInterceptor } from "./aspects/interceptors/formatter/formatter.interceptor.ts";
import { BookModule } from "./features/book/book.module.ts";
import { ServicesModule } from "./services/services.module.ts";

@Module({
  imports: [
    ServicesModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          createKeyv(config.getOrThrow("REDIS_URL"), { namespace: "cache" }),
        ],
        ttl: 60_000,
      }),
    }),
    BookModule,
  ],
  providers: [
    // #region Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatterInterceptor,
    },
    // #endregion

    // #region Pipes
    {
      provide: APP_PIPE,
      useFactory() {
        return new ValidationPipe({
          // 使用422作为校验失败错误码
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory(errors) {
            return errors[0];
          },
        });
      },
    },
    // #endregion

    // #region Filters
    // 执行顺序从下到上
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
    // #endregion

    // #region Guards
    {
      provide: APP_GUARD,
      useClass: PointKillGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // #endregion
  ],
})
export class AppModule {}
