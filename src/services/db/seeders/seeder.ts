import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/core";
import { BookSeeder } from "./account.seeder.js";

export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		await this.call(em, [BookSeeder]);
	}
}
