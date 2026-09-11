import {
  CACHE_MANAGER,
  Cache,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from "@nestjs/cache-manager";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Book } from "../../infra/database/entities/book.entity.ts";
import { BookService } from "./book.service.ts";
import { CreateBookDto } from "./dto/create-book.dto.ts";
import { UpdateBookDto } from "./dto/update-book.dto.ts";

@ApiTags("book")
@Controller("api/book")
@UseInterceptors(CacheInterceptor)
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  @ApiOperation({ summary: "创建书籍" })
  @ApiResponse({ status: 201, description: "创建成功", type: Book })
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    await this.invalidateBookList();
    return book;
  }

  @Get()
  @CacheKey("book:all")
  @CacheTTL(60_000)
  @ApiOperation({ summary: "获取所有书籍" })
  @ApiResponse({ status: 200, description: "获取成功", type: [Book] })
  async findAll() {
    console.log("获取");
    return this.bookService.findAll();
  }

  @Get(":id")
  @CacheKey(
    (context) => `book:${context.switchToHttp().getRequest().params.id}`,
  )
  @CacheTTL(60_000)
  @ApiOperation({ summary: "获取单个书籍" })
  @ApiResponse({ status: 200, description: "获取成功", type: Book })
  async findOne(@Param("id") id: string) {
    console.log("获取");
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException("书籍不存在", {
        errorCode: "40400",
      });
    }
    return book;
  }

  @Put(":id")
  @ApiOperation({ summary: "更新书籍" })
  @ApiResponse({ status: 200, description: "更新成功", type: Book })
  async update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.bookService.update(id, updateBookDto);
    if (!book) {
      throw new NotFoundException("书籍不存在", {
        errorCode: "40400",
      });
    }
    await this.invalidateBook(id);
    return book;
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "删除书籍" })
  @ApiResponse({ status: 204, description: "删除成功" })
  async remove(@Param("id") id: string) {
    const result = await this.bookService.remove(id);
    if (!result) {
      throw new NotFoundException("书籍不存在", {
        errorCode: "40400",
      });
    }
    await this.invalidateBook(id);
    return result;
  }

  private async invalidateBookList() {
    await this.cacheManager.del("book:all");
  }

  private async invalidateBook(id: string) {
    await Promise.all([
      this.invalidateBookList(),
      this.cacheManager.del(`book:${id}`),
    ]);
  }
}
