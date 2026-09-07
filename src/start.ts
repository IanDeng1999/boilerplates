import { ConfigManager } from "./shared/config";

ConfigManager.refreshConfig().then(async () => {
  const { bootstrap } = await import("./app");
  bootstrap();
});
