import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { AuthController } from "../auth/auth.controller.ts";
import { AuthModule } from "../auth/auth.module.ts";
import { HttpAspectsModule } from "../http-aspects/http-aspects.module.ts";
import { User } from "./entities/user.entity.ts";
import { UserController } from "./user.controller.ts";
import { UserService } from "./user.service.ts";

@Module({
  imports: [MikroOrmModule.forFeature([User]), AuthModule, HttpAspectsModule],
  controllers: [UserController, AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
