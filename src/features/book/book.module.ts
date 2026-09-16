import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { HttpAspectsModule } from "../http-aspects/http-aspects.module.ts";
import { BookController } from "./book.controller.ts";
import { BookService } from "./book.service.ts";
import { Book } from "./entities/book.entity.ts";

@Module({
  imports: [MikroOrmModule.forFeature([Book]), HttpAspectsModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
