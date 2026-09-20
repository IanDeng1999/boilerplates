import common_en from "./locales/en/common.json";
import home_en from "./locales/en/home.json";
import login_en from "./locales/en/login.json";
import notFound_en from "./locales/en/notFound.json";
import user_en from "./locales/en/user.json";
import common_zh from "./locales/zh/common.json";
import home_zh from "./locales/zh/home.json";
import login_zh from "./locales/zh/login.json";
import notFound_zh from "./locales/zh/notFound.json";
import user_zh from "./locales/zh/user.json";

export const resources = {
  zh: {
    translation: {
      common: common_zh,
      home: home_zh,
      login: login_zh,
      user: user_zh,
      notFound: notFound_zh,
    },
  },
  en: {
    translation: {
      common: common_en,
      home: home_en,
      login: login_en,
      user: user_en,
      notFound: notFound_en,
    },
  },
} as const;
