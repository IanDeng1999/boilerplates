import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { I18nService } from "nestjs-i18n";
import { translateError } from "#src/core/i18n/i18n-error.ts";

@Catch(ValidationError)
export class ValidationFilter<T extends ValidationError>
  implements ExceptionFilter
{
  constructor(private readonly i18n: I18nService) {}

  catch(exception: T, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<FastifyRequest>();
    const res = host.switchToHttp().getResponse<FastifyReply>();
    const detail = Object.fromEntries(
      Object.keys(exception.constraints ?? {}).map((constraint) => [
        constraint,
        translateError(this.i18n, "validation.invalidField", 422, host),
      ]),
    );

    res.status(422);
    res.send({
      code: 42200,
      msg: translateError(this.i18n, "common.validationFailed", 422, host),
      detail,
      logId: req.id,
    });
  }
}
