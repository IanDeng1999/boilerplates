import { applyDecorators, UseFilters, UseGuards } from "@nestjs/common";
import { WsExceptionFilter } from "../filters/ws-exception.filter.ts";
import { WsAuthGuard } from "../guards/ws-auth.guard.ts";

export function UseSocketAspects() {
  return applyDecorators(UseGuards(WsAuthGuard), UseFilters(WsExceptionFilter));
}
