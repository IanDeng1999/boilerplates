import { defineConfig } from "drizzle-kit";
import { ConfigManager } from "./src/shared/config";

ConfigManager.refreshConfig();
const databaseUrl = ConfigManager.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("No `DATABASE_URL` was provided!!");
}

console.info(`Running migrate for: ${databaseUrl}`);

export default defineConfig({
  schema: "./src/shared/db/schema.ts",
  out: "./src/shared/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  migrations: {
    schema: "public",
  },
  verbose: true,
});
