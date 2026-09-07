import { ConfigManager } from "@/shared/config";

ConfigManager.refreshConfig();

async function main() {
  await (await import("./book.seed")).default();
}

main()
  .then(() => {
    console.log("All seeds completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
