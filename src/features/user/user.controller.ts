import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiValidationErrorResponse,
} from "#src/core/swagger/api-response.decorator.ts";
import { SESSION_TTL_SECONDS } from "../auth/auth.const.ts";
import { AuthService } from "../auth/auth.service.ts";
import { LogoutResponseDto } from "../auth/dto/logout-response.dto.ts";
import { PhoneLoginDto } from "../auth/dto/phone-login.dto.ts";
import { PhoneLoginResponseDto } from "../auth/dto/phone-login-response.dto.ts";
import { RequestPhoneCodeDto } from "../auth/dto/request-phone-code.dto.ts";
import { AuthGuard } from "../auth/guards/auth.guard.ts";
import { PhoneVerificationService } from "../auth/phone-verification.service.ts";
import { UseCommonHttpAspects } from "../http-aspects/decorators/http-aspects.decorator.ts";
import { UserResponseDto } from "./dto/user-response.dto.ts";
import { UserService } from "./user.service.ts";

@ApiTags("用户")
@Controller("api/user")
@UseCommonHttpAspects()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly phoneVerificationService: PhoneVerificationService,
  ) {}

  @Post("phone/code")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "发送手机号登录验证码" })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: "验证码发送成功",
    type: "boolean",
  })
  @ApiValidationErrorResponse()
  async requestPhoneCode(@Body() dto: RequestPhoneCodeDto) {
    await this.phoneVerificationService.requestLoginCode(dto.phone);
    return true;
  }

  @Post("phone/login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "手机号验证码登录或注册" })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: "登录成功",
    type: PhoneLoginResponseDto,
  })
  @ApiValidationErrorResponse()
  async loginWithPhone(@Body() dto: PhoneLoginDto) {
    await this.phoneVerificationService.verifyLoginCode(dto.phone, dto.code);
    const { sessionId, user } = await this.userService.loginWithPhone(
      dto.phone,
    );
    return {
      accessToken: sessionId,
      tokenType: "Bearer",
      expiresIn: SESSION_TTL_SECONDS,
      user,
    };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "获取当前用户信息" })
  @ApiSuccessResponse({
    status: HttpStatus.OK,
    description: "获取成功",
    type: UserResponseDto,
  })
  @ApiErrorResponse({ status: 401, description: "未登录或会话已过期" })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "退出登录" })
  @ApiSuccessResponse({
    status: HttpStatus.CREATED,
    description: "退出成功",
    type: LogoutResponseDto,
  })
  @ApiErrorResponse({ status: 401, description: "未登录或会话已过期" })
  async logout(@Req() request: FastifyRequest): Promise<LogoutResponseDto> {
    const sessionId = request.user?.session;
    if (!sessionId) {
      throw new HttpException("auth.loginRequired", HttpStatus.UNAUTHORIZED);
    }
    await this.authService.logout(sessionId);
    return { success: true };
  }
}
