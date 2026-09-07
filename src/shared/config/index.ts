import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { isPromise } from "node:util/types";
import { lilconfigSync } from "lilconfig";
import z from "zod";
import { type ConfigSchemaType, configSchema } from "./schema";

type ConfigType = Awaited<ReturnType<(typeof ConfigManager)["getConfig"]>>;
const APP_NAME = "unnamed";

export class ConfigManager {
  private static _config: ConfigType;

  static get config(): Readonly<ConfigType> {
    return ConfigManager._config;
  }

  static get<K extends keyof ConfigType>(key: K): ConfigType[K] {
    return ConfigManager._config[key];
  }

  static async refreshConfig() {
    const res = ConfigManager.getConfig();
    if (!isPromise(res)) {
      ConfigManager._config = res;
    } else {
      ConfigManager._config = await res;
    }
  }

  private static getConfig() {
    let extraConfig: Partial<ConfigSchemaType> = {};

    // 唯一本地配置文件位置，方便管理: `.${APP_NAME}rc.json`
    const rcFilePath = join(homedir(), `.${APP_NAME}rc.json`);

    if (existsSync(rcFilePath)) {
      const result = lilconfigSync(APP_NAME).load(rcFilePath);
      if (result?.config) {
        extraConfig = result.config;
      }
      return ConfigManager.verifyConfig(extraConfig);
    } else {
      const configUrl = process.env.CONFIG_URL;
      if (!configUrl) {
        throw new Error(
          "CONFIG_URL environment variable is required but was not provided.",
        );
      }
      return fetch(configUrl).then((r) =>
        ConfigManager.verifyConfig(r.json() as Partial<ConfigSchemaType>),
      );
    }
  }

  private static verifyConfig(extraConfig: Partial<ConfigSchemaType>) {
    const { success, error, data } = configSchema.safeParse({
      ...process.env,
      ...extraConfig,
    });

    if (!success) {
      console.error(
        "Config Reflesh Failed:",
        JSON.stringify(z.treeifyError(error)),
      );
      process.exit(1);
    }

    return {
      ...data,
      APP_DATA_PATH: join(homedir(), "app_data", APP_NAME),
      IS_PROD: data.NODE_ENV === "production",
    };
  }
}
