import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.test.ts"],
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm"],
  dts: false,
});
