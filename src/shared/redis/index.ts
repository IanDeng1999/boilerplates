import Redis from "ioredis";
import { ConfigManager } from "@/shared/config";

export const redis = new Redis(ConfigManager.get("REDIS_URL"), {
  maxRetriesPerRequest: null,
});

redis.on("error", (error) => {
  console.error("Redis connection error:", error.message);
});

export async function closeRedis() {
  if (redis.status !== "end") {
    await redis.quit();
  }
}
