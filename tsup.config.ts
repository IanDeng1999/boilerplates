import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/**/*.ts", "!src/ui-entry.ts"],
    outDir: "autoxjs/core",
    bundle: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ["cjs"],
    outExtension: () => ({ js: ".js" }),
    dts: false,
    external: ["autojs6:ui"],
  },
  {
    entry: ["src/ui-entry.ts"],
    outDir: "autoxjs/ui",
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ["cjs"],
    outExtension: () => ({ js: ".js" }),
    dts: false,
  },
]);
