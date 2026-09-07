import { db } from "@/shared/db";
import { books } from "@/shared/db/schema";

export default async function seedBooks() {
  console.log("Seeding books table...");

  await db
    .insert(books)
    .values([
      {
        id: "1",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt and David Thomas",
        description: "A guide to pragmatic software development.",
      },
      {
        id: "2",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        description: "Reliable, scalable, and maintainable data systems.",
      },
    ])
    .onConflictDoNothing();

  console.log("Book seeding completed!");
}
