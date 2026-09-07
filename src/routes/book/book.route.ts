import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "@/shared/db";
import { books } from "@/shared/db/schema";
import { HTTPError } from "@/shared/errors";
import { genSnowflakeId } from "@/shared/id";

const bookInputSchema = z.object({
  title: z.string().trim().min(1).max(255),
  author: z.string().trim().min(1).max(255),
  description: z.string().trim().max(10_000).nullable().optional(),
});

const bookParamsSchema = z.object({
  id: z.string().min(1),
});

const bookResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  author: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function bookRoute(app: FastifyInstance) {
  const router = app.withTypeProvider<ZodTypeProvider>();

  router.route({
    method: "POST",
    url: "/api/books",
    schema: {
      body: bookInputSchema,
      response: { 201: bookResponseSchema },
    },
    handler: async (request, reply) => {
      const [book] = await db
        .insert(books)
        .values({ id: genSnowflakeId(true), ...request.body })
        .returning();

      return reply.status(201).send(book);
    },
  });

  router.route({
    method: "GET",
    url: "/api/books",
    schema: { response: { 200: z.array(bookResponseSchema) } },
    handler: async () => db.select().from(books).orderBy(books.createdAt),
  });

  router.route({
    method: "GET",
    url: "/api/books/:id",
    schema: {
      params: bookParamsSchema,
      response: { 200: bookResponseSchema },
    },
    handler: async (request) => {
      const [book] = await db
        .select()
        .from(books)
        .where(eq(books.id, request.params.id))
        .limit(1);
      if (!book) throw new HTTPError("Book not found", 404, "BOOK_NOT_FOUND");
      return book;
    },
  });

  router.route({
    method: "PUT",
    url: "/api/books/:id",
    schema: {
      params: bookParamsSchema,
      body: bookInputSchema
        .partial()
        .refine(
          (value) => Object.keys(value).length > 0,
          "At least one field is required",
        ),
      response: { 200: bookResponseSchema },
    },
    handler: async (request) => {
      const [book] = await db
        .update(books)
        .set({ ...request.body, updatedAt: new Date() })
        .where(eq(books.id, request.params.id))
        .returning();
      if (!book) throw new HTTPError("Book not found", 404, "BOOK_NOT_FOUND");
      return book;
    },
  });

  router.route({
    method: "DELETE",
    url: "/api/books/:id",
    schema: {
      params: bookParamsSchema,
      response: { 204: z.never() },
    },
    handler: async (request, reply) => {
      const [book] = await db
        .delete(books)
        .where(eq(books.id, request.params.id))
        .returning({ id: books.id });
      if (!book) throw new HTTPError("Book not found", 404, "BOOK_NOT_FOUND");
      return reply.status(204).send();
    },
  });
}
