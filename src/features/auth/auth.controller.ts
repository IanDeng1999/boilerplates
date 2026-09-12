import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "#src/common/swagger/api-response.decorator.ts";
import { HttpContextService } from "../http-context/http-context.service.ts";
import { AuthService } from "./auth.service.ts";
import { AccountResponseDto } from "./dto/account-response.dto.ts";
import { LogoutResponseDto } from "./dto/logout-response.dto.ts";
import { OAuthRedirectDto } from "./dto/oauth-redirect.dto.ts";
import { OAuthProviderType } from "./entities/oauth-provider.entity.ts";
import { AuthGuard } from "./guards/auth.guard.ts";

@ApiTags("认证")
@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly loginPagePath = "/login.html";

  constructor(
    private readonly authService: AuthService,
    private readonly httpContext: HttpContextService,
  ) {}

  @Get("login/:provider")
  @ApiOperation({
    summary: "获取授权地址",
    description: "返回第三方授权地址，并下发 oauth-state cookie。",
  })
  @ApiParam(providerParameter())
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功",
    type: OAuthRedirectDto,
  })
  async getOAuthUrl(
    @Param("provider") provider: OAuthProviderType,
  ): Promise<{ url: string; state: string }> {
    const { url, state } = this.authService.getOAuthRedirectUrl(provider);

    // 回调是提供商发起的跨站点顶层跳转，same-site 只能用 lax，strict 带不回来
    this.httpContext.setCookie("oauth-state", state, {
      sameSite: "lax",
      maxAge: 10 * 60, // @fastify/cookie 的 maxAge 单位是秒
    });

    return { url, state };
  }

  @Get("callback/:provider")
  @ApiOperation({
    summary: "OAuth 回调",
    description:
      "校验 state 后换取令牌并写入 session cookie，最后重定向回登录页。",
  })
  @ApiParam(providerParameter())
  @ApiQuery({
    name: "code",
    description: "第三方返回的授权码",
    required: true,
    example:
      "4/0ATsMZqCL97cTAoGIp4nlMA0K5FGi7PpYTGXvvJ8SXQ0O_1HZ7Pkd2T5EF01pl_hHecnPxw",
  })
  @ApiQuery({
    name: "state",
    description: "需与 oauth-state cookie 一致",
    required: true,
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  @ApiResponse({
    status: 302,
    description: "重定向回登录页；失败时带 loginError 查询参数说明原因",
  })
  async handleCallback(
    @Param("provider") provider: OAuthProviderType,
    @Query("code") code: string,
    @Query("state") state: string,
    @Res() reply: FastifyReply,
  ) {
    if (!state || state !== this.httpContext.getCookie("oauth-state")) {
      return this.redirectToLogin(reply, "state 校验失败，请重新登录");
    }
    this.httpContext.clearCookie("oauth-state");

    try {
      const { sessionId } = await this.authService.handleOAuthCallback(
        provider,
        code,
      );
      this.httpContext.setCookie("session", sessionId, {
        maxAge: 7 * 24 * 60 * 60, // 7 天，与 Redis 里的会话 TTL 一致
      });
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

  @Get("account")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "获取当前账户信息" })
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功",
    type: AccountResponseDto,
  })
  @ApiErrorResponse({
    status: 401,
    description: "未登录或会话已过期",
  })
  async getAccount(@Req() request: FastifyRequest) {
    const accountId = request.account?.id;
    if (!accountId) {
      throw new HttpException("未登录", HttpStatus.UNAUTHORIZED);
    }

    const account = await this.authService.getAccountById(accountId);
    if (!account) {
      return null;
    }
    return this.authService.serialization(account);
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "退出登录", description: "删除当前会话。" })
  @ApiSuccessResponse({
    status: 200,
    description: "登出成功",
    type: LogoutResponseDto,
  })
  @ApiErrorResponse({
    status: 401,
    description: "未登录或会话已过期",
  })
  async logout(@Req() request: FastifyRequest) {
    const sessionId = request.account?.session;
    if (!sessionId) {
      throw new HttpException("未登录", HttpStatus.UNAUTHORIZED);
    }

    await this.authService.logout(sessionId);
    return { success: true };
  }
}

function providerParameter() {
  return {
    name: "provider",
    description: "OAuth 提供商",
    schema: { type: "string", enum: ["google", "github"] },
    example: "github",
  };
}
