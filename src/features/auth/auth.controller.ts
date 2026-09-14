import type { CookieSerializeOptions } from "@fastify/cookie";
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "../user/user.service.ts";
import { OAuthRedirectDto } from "./dto/oauth-redirect.dto.ts";
import { AuthProvider } from "./entities/auth.entity.ts";
import { OauthService } from "./oauth.service.ts";

@ApiTags("认证")
@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly loginPagePath = "/login.html";

  constructor(
    private readonly oauthService: OauthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @Get("login/:provider")
  @ApiOperation({ summary: "获取 OAuth 授权地址" })
  @ApiParam(providerParameter())
  async getOAuthUrl(
    @Param("provider") provider: AuthProvider,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const { url, state } = this.oauthService.getRedirectUrl(provider);
    reply.setCookie(
      "oauth-state",
      state,
      this.cookieOptions({
        sameSite: "lax",
        maxAge: 10 * 60,
      }),
    );
    return { url, state } satisfies OAuthRedirectDto;
  }

  @Get("callback/:provider")
  @ApiOperation({ summary: "OAuth 回调" })
  @ApiParam(providerParameter())
  @ApiQuery({ name: "code", required: true })
  @ApiQuery({ name: "state", required: true })
  @ApiResponse({ status: 302, description: "重定向回登录页" })
  async handleCallback(
    @Param("provider") provider: AuthProvider,
    @Query("code") code: string,
    @Query("state") state: string,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    if (!state || state !== request.cookies?.["oauth-state"]) {
      return this.redirectToLogin(reply, "state 校验失败，请重新登录");
    }
    reply.clearCookie("oauth-state", { path: "/" });

    try {
      const authentication = await this.oauthService.authenticate(
        provider,
        code,
      );
      const { sessionId } =
        await this.userService.loginWithOAuth(authentication);
      reply.setCookie(
        "session",
        sessionId,
        this.cookieOptions({
          maxAge: 7 * 24 * 60 * 60,
        }),
      );
      return reply.redirect(this.loginPagePath, HttpStatus.FOUND);
    } catch (error) {
      if (error instanceof HttpException) {
        return this.redirectToLogin(reply, error.message);
      }
      this.logger.error(error, "OAuth callback failed");
      return this.redirectToLogin(reply, "登录失败，请稍后重试");
    }
  }

  private redirectToLogin(reply: FastifyReply, message: string) {
    const query = new URLSearchParams({ loginError: message });
    return reply.redirect(`${this.loginPagePath}?${query}`, HttpStatus.FOUND);
  }

  private cookieOptions(options: CookieSerializeOptions = {}) {
    const defaultOptions: CookieSerializeOptions = {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
    };
    return { ...defaultOptions, ...options };
  }
}

function providerParameter() {
  return {
    name: "provider",
    description: "OAuth 提供商",
    schema: { type: "string", enum: ["google", "github"] },
  };
}
