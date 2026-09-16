import { Module } from "@nestjs/common";
import { WsExceptionFilter } from "./filters/ws-exception.filter.ts";
import { WsAuthGuard } from "./guards/ws-auth.guard.ts";

@Module({
  providers: [WsAuthGuard, WsExceptionFilter],
  exports: [WsAuthGuard, WsExceptionFilter],
})
export class SocketAspectsModule {}
