import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Book } from "../../services/db/entities/book.entity.js";
import { BookService } from "./book.service.js";
import { CreateBookDto } from "./dto/create-book.dto.js";
import { UpdateBookDto } from "./dto/update-book.dto.js";

@ApiTags("book")
@Controller("api/book")
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: "创建书籍" })
  @ApiResponse({ status: 201, description: "创建成功", type: Book })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: "获取所有书籍" })
  @ApiResponse({ status: 200, description: "获取成功", type: [Book] })
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "获取单个书籍" })
  @ApiResponse({ status: 200, description: "获取成功", type: Book })
  async findOne(@Param("id") id: string): Promise<Book> {
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new Error("书籍不存在");
    }
    return book;
  }

  @Put(":id")
  @ApiOperation({ summary: "更新书籍" })
  @ApiResponse({ status: 200, description: "更新成功", type: Book })
  async update(
    @Param("id") id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    const book = await this.bookService.update(id, updateBookDto);
    if (!book) {
      throw new Error("书籍不存在");
    }
    return book;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "删除书籍" })
  @ApiResponse({ status: 204, description: "删除成功" })
  async remove(@Param("id") id: string): Promise<void> {
    const result = await this.bookService.remove(id);
    if (!result) {
      throw new Error("书籍不存在");
    }
  }
}
