import { Controller, Get } from '@nestjs/common';

@Controller('api/book')
export class BookController {
  @Get()
  getBooks() {
    return 'Hello'
  }
}
