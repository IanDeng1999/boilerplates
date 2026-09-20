import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";
import type { Redis } from "ioredis";
import type { Socket } from "socket.io";
import { REDIS_CLIENT } from "../../../core/redis/redis.module.ts";
import { sessionKey } from "../../auth/auth.const.ts";

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  async canActivate(context: ExecutionContext) {
    const client = context.switchToWs().getClient();
    await this.authenticate(client);
    return true;
  }

  async authenticate(client: Socket) {
    const { parseCookie } = this.httpAdapterHost.httpAdapter.getInstance();
    const sessionId = parseCookie(
      client.handshake.headers.cookie ?? "",
    ).session;

    if (!sessionId) {
      throw new WsException("auth.loginRequired");
    }

    const sessionData = await this.redisClient.hget(
      sessionKey(sessionId),
      "data",
    );

    if (!sessionData) {
      throw new WsException("auth.sessionExpired");
    }

    let session: { id?: unknown };
    try {
      session = JSON.parse(sessionData);
    } catch {
      throw new WsException("auth.sessionInvalidFormat");
    }

    if (typeof session.id !== "string" || !session.id) {
      throw new WsException("auth.sessionInvalid");
    }

    client.data.user = {
      id: session.id,
      session: sessionId,
    } satisfies AuthedUser;
  }
}
