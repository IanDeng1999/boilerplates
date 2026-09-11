import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import type { Redis } from "ioredis";
import { REDIS_CLIENT } from "../redis/redis.module.ts";

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

  setCookie(key: CookieKeys, value: string, options: CookieOptions = {}) {
    const defaultOptions: CookieOptions = {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "prod",
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
    key: CookieKeys,
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

type CookieKeys = "session" | "client-id";

export interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none" | boolean;
  maxAge?: number;
  path?: string;
  domain?: string;
  expires?: Date;
}
