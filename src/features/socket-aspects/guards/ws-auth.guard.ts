import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
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
      throw new Error("请先登录");
    }

    const sessionData = await this.redisClient.hget(
      sessionKey(sessionId),
      "data",
    );

    if (!sessionData) {
      throw new Error("会话已过期，请重新登录");
    }

    let session: { id?: unknown };
    try {
      session = JSON.parse(sessionData);
    } catch {
      throw new Error("会话数据格式错误");
    }

    if (typeof session.id !== "string" || !session.id) {
      throw new Error("会话数据无效");
    }

    client.data.user = {
      id: session.id,
      session: sessionId,
    } satisfies AuthedUser;
  }
}
