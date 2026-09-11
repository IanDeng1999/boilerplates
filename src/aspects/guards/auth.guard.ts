import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Redis } from "ioredis";
import { HttpContextService } from "../../services/http-context/http-context.service.ts";
import { REDIS_CLIENT } from "../../services/redis/redis.module.ts";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly httpContextService: HttpContextService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const sessionId = this.httpContextService.getCookie("session");

    if (!sessionId) {
      throw new UnauthorizedException("请先登录");
    }

    // 从Redis获取session数据
    const key = `session:${sessionId}`;
    const sessionData = await this.redisClient.hget(key, "data");

    if (!sessionData) {
      this.httpContextService.clearCookie("session");
      throw new UnauthorizedException("会话已过期，请重新登录");
    }

    try {
      const session = JSON.parse(sessionData);
      if (!session.id) {
        throw new UnauthorizedException("会话数据无效");
      }

      // 将用户信息附加到请求对象上，供后续使用
      request.account = {
        id: session.id,
        session: sessionId,
      };

      return true;
    } catch {
      throw new UnauthorizedException("会话数据格式错误");
    }
  }
}
