import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HttpContextModule } from "../http-context/http-context.module.ts";
import { AuthService } from "./auth.service.ts";
import { Auth } from "./entities/auth.entity.ts";
import { Oauth } from "./entities/oauth.entity.ts";
import { AuthGuard } from "./guards/auth.guard.ts";
import { OauthService } from "./oauth.service.ts";
import { PhoneVerificationService } from "./phone-verification.service.ts";

@Module({
  imports: [MikroOrmModule.forFeature([Auth, Oauth]), HttpContextModule],
  providers: [AuthService, AuthGuard, OauthService, PhoneVerificationService],
  exports: [AuthService, AuthGuard, OauthService, PhoneVerificationService],
})
export class AuthModule {}
