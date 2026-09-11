import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HttpContextModule } from "../../infra/http-context/http-context.module.ts";
import { AuthController } from "./auth.controller.ts";
import { AuthService } from "./auth.service.ts";
import { Account } from "./entities/account.entity.ts";
import { OAuthProvider } from "./entities/oauth-provider.entity.ts";
import { AuthGuard } from "./guards/auth.guard.ts";

@Module({
  imports: [
    MikroOrmModule.forFeature([Account, OAuthProvider]),
    HttpContextModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
