import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";

@Catch(HttpException)
export class HttpFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<FastifyRequest>();
    const res = host.switchToHttp().getResponse<FastifyReply>();
    const status = exception.getStatus();

    res.status(status);
    res.send({
      code: exception.errorCode ?? `${status * 100}`,
      msg: exception.message,
      data:
        exception.cause === "health_check" ? exception.getResponse() : void 0,
      logId: req.id,
    });
  }
}
