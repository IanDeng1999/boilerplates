import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ConfigManager } from "@/shared/config";
import * as schema from "./schema";

const client = postgres(ConfigManager.get("DATABASE_URL"));

export const db = drizzle(client, { schema });

export function closeDb() {
  return client.end();
}
