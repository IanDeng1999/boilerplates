import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { generateSeedId } from "./seed-utils.js";
import { Book } from "../entities/book.entity.js";

export class BookSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		// 检查是否已存在用户，避免重复插入
		const record = await em.findOne(Book, { title: "钢铁是怎样炼成的",});
		if (record) {
			console.log("Test user already exists, skipping...");
			return;
		}

		em.create(Book, {
			id: generateSeedId(),
			title: "钢铁是怎样炼成的",
		});

		console.log(`User seeder completed, inserted ${1} banners`);
	}
}
