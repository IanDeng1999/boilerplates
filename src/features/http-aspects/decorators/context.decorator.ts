import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

// 获取当前登录用户信息
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException("auth.loginRequired");
    }
    return user;
  },
);

// 获取用户IP
export const ClientIP = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<FastifyRequest>();

    const ip =
      req.cookies?.["client-id"] ??
      req.ip ??
      req.socket?.remoteAddress ??
      req.headers["x-forwarded-for"];
    if (!ip) {
      throw new Error("common.invalidRequest");
    }
    return ip.match(/\d+\.\d+\.\d+\.\d+/)?.[0];
  },
);
