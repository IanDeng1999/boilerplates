import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { translateError } from "#src/core/i18n/i18n-error.ts";

@Catch(HttpException)
export class HttpFilter<T extends HttpException> implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: T, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<FastifyRequest>();
    const res = host.switchToHttp().getResponse<FastifyReply>();
    const status = exception.getStatus();

    res.status(status);
    res.send({
      code: exception.errorCode ?? `${status * 100}`,
      msg: translateError(this.i18n, exception.message, status, host),
      data:
        exception.cause === "health_check" ? exception.getResponse() : void 0,
      logId: req.id,
    });
  }
}
