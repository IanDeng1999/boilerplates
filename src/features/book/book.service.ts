import { EntityManager, EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { pick } from "es-toolkit";
import { Book } from "../../services/db/entities/book.entity.ts";
import { CreateBookDto } from "./dto/create-book.dto.ts";
import { UpdateBookDto } from "./dto/update-book.dto.ts";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: EntityRepository<Book>,
    private readonly em: EntityManager,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    this.em.persist(book);
    await this.em.flush();
    return book;
  }

  async findAll() {
    return this.bookRepository
      .findAll()
      .then((books) => books.map((b) => this.serialization(b)));
  }

  async findOne(id: string) {
    return this.bookRepository
      .findOne({ id })
      .then((b) => (b ? this.serialization(b) : b));
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ id });
    if (!book) {
      return null;
    }
    this.bookRepository.assign(book, updateBookDto);
    this.em.persist(book);
    await this.em.flush();
    return this.serialization(book);
  }

  async remove(id: string) {
    const book = await this.bookRepository.findOne({ id });
    if (!book) {
      return false;
    }
    this.em.remove(book);
    await this.em.flush();
    return true;
  }

  serialization(model: Book) {
    return pick(model, ["id", "title", "description"]);
  }
}
