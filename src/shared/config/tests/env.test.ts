import { describe, expect, it } from "vitest";
import { ConfigManager } from "../index";

describe("ConfigManager", () => {
  it("should have required properties", () => {
    expect(ConfigManager.config).toBeDefined();
    expect(ConfigManager.get("PORT")).toBeDefined();
    expect(ConfigManager.get("HOST")).toBeDefined();
    expect(ConfigManager.get("NODE_ENV")).toBeDefined();
    expect(ConfigManager.get("DATABASE_URL")).toBeDefined();
  });

  it("should have correct isProd flag", () => {
    const isProd = ConfigManager.get("NODE_ENV") === "production";
    expect(ConfigManager.get("IS_PROD")).toBe(isProd);
  });
});
