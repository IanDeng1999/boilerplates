import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	outDir: "autoxjs/core",
	splitting: false,
	sourcemap: true,
	clean: true,
	format: ["cjs"],
	dts: false,
});
