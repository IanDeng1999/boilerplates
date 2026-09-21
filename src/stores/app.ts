import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { type AppLocale, i18n } from "../i18n";

export type AppTheme = "light" | "dark";

function getInitialTheme(): AppTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const useAppStore = defineStore(
  "app",
  () => {
    const theme = ref<AppTheme>(getInitialTheme());
    const locale = ref<AppLocale>("zh-CN");
    const isDark = computed(() => theme.value === "dark");

    function applyTheme() {
      document.documentElement.classList.toggle("van-theme-dark", isDark.value);
      document.documentElement.dataset.theme = theme.value;
      document.documentElement.style.colorScheme = theme.value;
    }

    function setTheme(nextTheme: AppTheme) {
      theme.value = nextTheme;
      applyTheme();
    }

    function toggleTheme() {
      setTheme(isDark.value ? "light" : "dark");
    }

    function setLocale(nextLocale: AppLocale) {
      locale.value = nextLocale;
      i18n.global.locale.value = nextLocale;
      document.documentElement.lang = nextLocale;
    }

    function toggleLocale() {
      setLocale(locale.value === "zh-CN" ? "en-US" : "zh-CN");
    }

    function initialize() {
      applyTheme();
      setLocale(locale.value);
    }

    return {
      theme,
      locale,
      isDark,
      initialize,
      setTheme,
      toggleTheme,
      setLocale,
      toggleLocale,
    };
  },
  {
    persist: {
      key: "app-preferences",
      pick: ["theme", "locale"],
    },
  },
);
