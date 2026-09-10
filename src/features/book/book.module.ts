import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Book } from "../../services/db/entities/book.entity.js";
import { BookController } from "./book.controller.js";
import { BookService } from "./book.service.js";

@Module({
  imports: [MikroOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
