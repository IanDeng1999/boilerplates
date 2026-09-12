import { Readable } from "node:stream";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  SetMetadata,
} from "@nestjs/common";
import { map } from "rxjs";
import { SKIP_RESPONSE_FORMAT_KEY } from "./formatter.const.ts";

export { SKIP_RESPONSE_FORMAT_KEY } from "./formatter.const.ts";

export function SkipFormat() {
  return SetMetadata(SKIP_RESPONSE_FORMAT_KEY, true);
}

@Injectable()
export class FormatterInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FormatterInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler) {
    const handler = context.getHandler();
    const reply = context.switchToHttp().getResponse<FastifyReply>();
    const skipFormat = Reflect.getMetadata(SKIP_RESPONSE_FORMAT_KEY, handler);
    return next.handle().pipe(
      map((data) => {
        if (
          skipFormat ||
          reply.sent ||
          reply.raw.headersSent ||
          data instanceof Readable
        ) {
          this.logger.log("Skip Response Format");
          return data;
        }

        return {
          data,
          code: 0,
          msg: "success",
        };
      }),
    );
  }
}
