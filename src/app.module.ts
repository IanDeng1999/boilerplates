import { Module } from '@nestjs/common';
import { ServicesModule } from './services/services.module.js';
import { BookModule } from './features/book/book.module.js';

@Module({
  imports: [ServicesModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
