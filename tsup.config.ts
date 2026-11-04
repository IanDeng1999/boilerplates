import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/**/*.ts", "!src/ui.ts"],
    outDir: "autoxjs/core",
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ["cjs"],
    outExtension: () => ({ js: ".js" }),
    dts: false,
    external: ["autojs6:ui"],
  },
  {
    entry: ["src/ui.ts"],
    outDir: "autoxjs/ui",
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ["cjs"],
    outExtension: () => ({ js: ".js" }),
    dts: false,
  },
]);
