import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { BookSeeder } from "./book.seeder.ts";

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager) {
    await this.call(em, [BookSeeder]);
  }
}
