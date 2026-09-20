import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { I18nService } from "nestjs-i18n";
import { translateError } from "#src/core/i18n/i18n-error.ts";

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {
    super();
  }

  override catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception.getError();
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : "common.invalidRequest";
    const localizedMessage = translateError(this.i18n, message, 401, host);
    this.logger.warn(`WS auth failed: ${localizedMessage}`);
    client.emit("error", { code: 401, message: localizedMessage });
    client.disconnect();
  }
}
