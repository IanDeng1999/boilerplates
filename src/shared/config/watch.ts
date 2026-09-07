import { logger } from "../logger";
import { ConfigManager } from ".";

let timer: NodeJS.Timeout | null = null;
export function configWatch() {
  if (timer) {
    return;
  }
  timer = setInterval(
    async () => {
      try {
        await ConfigManager.refreshConfig();
        logger.info("Config refresh success");
      } catch (err) {
        logger.warn(err, "Failed to refresh config:");
      }
    },
    5 * 60 * 1000,
  );
}

export function configUnWatch() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
