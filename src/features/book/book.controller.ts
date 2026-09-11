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
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  ApiNotFoundErrorResponse,
  ApiSuccessResponse,
  ApiValidationErrorResponse,
} from "#src/common/swagger/api-response.decorator.ts";
import { BookService } from "./book.service.ts";
import {
  BookResponseDto,
  DeleteBookResponseDto,
} from "./dto/book-response.dto.ts";
import { CreateBookDto } from "./dto/create-book.dto.ts";
import { UpdateBookDto } from "./dto/update-book.dto.ts";

@ApiTags("书籍")
@Controller("api/book")
@UseInterceptors(CacheInterceptor)
export class BookController {
  constructor(
    private readonly bookService: BookService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  @ApiOperation({
    summary: "创建书籍",
    description: "创建后返回书籍公开信息。",
  })
  @ApiSuccessResponse({
    status: 201,
    description: "创建成功",
    type: BookResponseDto,
  })
  @ApiValidationErrorResponse()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.bookService.create(createBookDto);
    await this.invalidateBookList();
    return book;
  }

  @Get()
  @CacheKey("book:all")
  @CacheTTL(60_000)
  @ApiOperation({ summary: "获取书籍列表" })
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功",
    type: BookResponseDto,
    isArray: true,
  })
  async findAll() {
    console.log("获取");
    return this.bookService.findAll();
  }

  @Get(":id")
  @CacheKey(
    (context) => `book:${context.switchToHttp().getRequest().params.id}`,
  )
  @CacheTTL(60_000)
  @ApiOperation({ summary: "获取书籍详情" })
  @ApiParam(bookIdParameter())
  @ApiSuccessResponse({
    status: 200,
    description: "获取成功",
    type: BookResponseDto,
  })
  @ApiNotFoundErrorResponse("书籍不存在")
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
  @ApiOperation({ summary: "更新书籍", description: "仅传入需要修改的字段。" })
  @ApiParam(bookIdParameter())
  @ApiSuccessResponse({
    status: 200,
    description: "更新成功",
    type: BookResponseDto,
  })
  @ApiNotFoundErrorResponse("书籍不存在")
  @ApiValidationErrorResponse()
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
  @ApiOperation({
    summary: "删除书籍",
    description: "删除成功后返回删除状态。",
  })
  @ApiParam(bookIdParameter())
  @ApiSuccessResponse({
    status: 200,
    description: "删除成功",
    type: DeleteBookResponseDto,
  })
  @ApiNotFoundErrorResponse("书籍不存在")
  async remove(@Param("id") id: string) {
    const result = await this.bookService.remove(id);
    if (!result) {
      throw new NotFoundException("书籍不存在", {
        errorCode: "40400",
      });
    }
    await this.invalidateBook(id);
    return { deleted: result };
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

function bookIdParameter() {
  return {
    name: "id",
    description: "书籍唯一标识",
    schema: { type: "string", format: "uuid" },
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  };
}
