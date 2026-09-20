import type { ArgumentsHost } from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";

const statusKeys: Record<number, string> = {
  400: "common.badRequest",
  401: "common.unauthorized",
  403: "common.forbidden",
  404: "common.notFound",
  422: "common.validationFailed",
  429: "common.tooManyRequests",
  500: "common.internalServerError",
  502: "common.badGateway",
  503: "common.serviceUnavailable",
};

export function translateError(
  i18n: I18nService,
  message: string,
  status?: number,
  host?: ArgumentsHost,
): string {
  const lang = I18nContext.current(host)?.lang;
  const key = message.includes(".")
    ? message.split("|", 1)[0]
    : statusKeys[status ?? 0];
  return key ? String(i18n.t(key, { lang })) : message;
}
