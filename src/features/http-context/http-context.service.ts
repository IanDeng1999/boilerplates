import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../../infra/redis/redis.module.ts";
import type { CookieKey, CookieOptions } from "./http-context.types.ts";

const SESSION_DATA_FIELD = "data";

@Injectable({ scope: Scope.REQUEST })
export class HttpContextService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(REQUEST) private readonly request: FastifyRequest,
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  get reply() {
    return this.request.replyRef;
  }

  setCookie(key: CookieKey, value: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
    };

    const finalOptions = { ...defaultOptions, ...options };

    this.reply.setCookie(key, value, finalOptions);
  }

  getCookie(name: string) {
    return this.request.cookies?.[name];
  }

  getClientIp() {
    return this.request.ip ?? this.request.socket.remoteAddress;
  }

  async getUserIdFromSession() {
    const sessionId = this.getCookie("session");
    if (!sessionId) {
      return undefined;
    }

    const sessionData = await this.redisClient.hget(
      `session:${sessionId}`,
      SESSION_DATA_FIELD,
    );
    if (!sessionData) {
      return undefined;
    }

    try {
      const session = JSON.parse(sessionData) as { id?: unknown };
      return typeof session.id === "string" ? session.id : undefined;
    } catch {
      return undefined;
    }
  }

  clearCookie(
    key: CookieKey,
    options: CookieOptions = {
      path: "/",
    },
  ) {
    this.reply.clearCookie(key, options);
  }

  getHeader(name: string) {
    const header = this.request.headers[name];
    return Array.isArray(header) ? header[0] : header;
  }

  setHeader(name: string, value: string) {
    this.reply.header(name, value);
  }
}
