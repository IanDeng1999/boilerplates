import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  override catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception.getError();
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : "WebSocket request failed";
    this.logger.warn(`WS auth failed: ${message}`);
    client.emit("error", { code: 401, message });
    client.disconnect();
  }
}
