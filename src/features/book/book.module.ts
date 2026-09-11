import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Book } from "../../infra/database/entities/book.entity.ts";
import { BookController } from "./book.controller.ts";
import { BookService } from "./book.service.ts";

@Module({
  imports: [MikroOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
