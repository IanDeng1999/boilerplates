import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { BookController } from "./book.controller.ts";
import { BookService } from "./book.service.ts";
import { Book } from "./entities/book.entity.ts";

@Module({
  imports: [MikroOrmModule.forFeature([Book])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
