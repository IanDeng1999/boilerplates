import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { Book } from "../../services/db/entities/book.entity.js";
import { CreateBookDto } from "./dto/create-book.dto.js";
import { UpdateBookDto } from "./dto/update-book.dto.js";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
    private readonly em: EntityManager,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const book = this.bookRepository.create(createBookDto);
    this.em.persist(book);
    await this.em.flush();
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }

  async findOne(id: string): Promise<Book | null> {
    return this.bookRepository.findOne({ id });
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book | null> {
    const book = await this.bookRepository.findOne({ id });
    if (!book) {
      return null;
    }
    this.bookRepository.assign(book, updateBookDto);
    this.em.persist(book);
    await this.em.flush();
    return book;
  }

  async remove(id: string): Promise<boolean> {
    const book = await this.bookRepository.findOne({ id });
    if (!book) {
      return false;
    }
    this.em.remove(book);
    await this.em.flush();
    return true;
  }
}
