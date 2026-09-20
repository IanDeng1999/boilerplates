import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service.ts";
import { LogoutResponseDto } from "../auth/dto/logout-response.dto.ts";
import { PhoneLoginDto } from "../auth/dto/phone-login.dto.ts";
import { RequestPhoneCodeDto } from "../auth/dto/request-phone-code.dto.ts";
import { AuthGuard } from "../auth/guards/auth.guard.ts";
import { PhoneVerificationService } from "../auth/phone-verification.service.ts";
import { UseCommonHttpAspects } from "../http-aspects/decorators/http-aspects.decorator.ts";
import { UserService } from "./user.service.ts";

@ApiTags("用户")
@Controller("api/user")
@UseCommonHttpAspects()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly phoneVerificationService: PhoneVerificationService,
    private readonly configService: ConfigService,
  ) {}

  @Post("phone/code")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "发送手机号登录验证码" })
  async requestPhoneCode(@Body() dto: RequestPhoneCodeDto) {
    await this.phoneVerificationService.requestLoginCode(dto.phone);
  }

  @Post("phone/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "手机号验证码登录或注册" })
  async loginWithPhone(
    @Body() dto: PhoneLoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    await this.phoneVerificationService.verifyLoginCode(dto.phone, dto.code);
    const { sessionId, user } = await this.userService.loginWithPhone(
      dto.phone,
    );
    reply.setCookie("session", sessionId, {
      httpOnly: true,
      secure: this.configService.get("NODE_ENV") === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return user;
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "获取当前用户信息" })
  async getCurrentUser(@Req() request: FastifyRequest) {
    const userId = request.user?.id;
    if (!userId) {
      throw new HttpException("auth.loginRequired", HttpStatus.UNAUTHORIZED);
    }
    const user = await this.userService.findById(userId);
    return user ? this.userService.serialization(user) : null;
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "退出登录" })
  async logout(@Req() request: FastifyRequest): Promise<LogoutResponseDto> {
    const sessionId = request.user?.session;
    if (!sessionId) {
      throw new HttpException("auth.loginRequired", HttpStatus.UNAUTHORIZED);
    }
    await this.authService.logout(sessionId);
    return { success: true };
  }
}
