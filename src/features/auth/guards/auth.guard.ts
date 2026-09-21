import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../../core/redis/redis.module.ts";
import { sessionKey } from "../auth.const.ts";

export function getBearerToken(authorization: unknown) {
  if (typeof authorization !== "string") return undefined;
  return authorization.match(/^Bearer\s+(\S+)$/i)?.[1];
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const sessionId = getBearerToken(request.headers.authorization);

    if (!sessionId) {
      throw new UnauthorizedException("auth.loginRequired");
    }

    const sessionData = await this.redisClient.hget(
      sessionKey(sessionId),
      "data",
    );

    if (!sessionData) {
      throw new UnauthorizedException("auth.sessionExpired");
    }

    let session: { id?: unknown };
    try {
      session = JSON.parse(sessionData);
    } catch {
      throw new UnauthorizedException("auth.sessionInvalidFormat");
    }
    if (typeof session.id !== "string" || !session.id) {
      throw new UnauthorizedException("auth.sessionInvalid");
    }

    request.user = { id: session.id, session: sessionId };
    return true;
  }
}
