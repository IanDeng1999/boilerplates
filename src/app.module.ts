import { Module } from "@nestjs/common";
import { BookModule } from "./features/book/book.module.js";
import { ServicesModule } from "./services/services.module.js";

@Module({
  imports: [ServicesModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
