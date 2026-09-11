import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Book } from "../entities/book.entity.ts";

export class BookSeeder extends Seeder {
  async run(em: EntityManager) {
    // 检查是否已存在用户，避免重复插入
    const record = await em.findOne(Book, { title: "钢铁是怎样炼成的" });
    if (record) {
      console.log("Test user already exists, skipping...");
      return;
    }

    em.create(Book, {
      title: "钢铁是怎样炼成的",
      description: "保尔柯察金",
    });

    console.log(`User seeder completed, inserted ${1} banners`);
  }
}
