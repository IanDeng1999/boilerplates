import { readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "../..");
const srcDir = resolve(rootDir, "src");
const outputPath = resolve(srcDir, "ui-commands.json");

const entries = await readdir(srcDir, { withFileTypes: true });
const commands = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".task.ts"))
  .map((entry) => entry.name.replace(/\.task\.ts$/, ""))
  .sort();

await writeFile(outputPath, `${JSON.stringify(commands, null, 2)}\n`);
