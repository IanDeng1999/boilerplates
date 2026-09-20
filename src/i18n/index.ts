import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  defaultLanguage,
  languageStorageKey,
  supportedLanguages,
} from "./const";
import { resources } from "./resources";

const storedLanguage = window.localStorage.getItem(languageStorageKey);
const initialLanguage = supportedLanguages.includes(
  storedLanguage as (typeof supportedLanguages)[number],
)
  ? (storedLanguage ?? defaultLanguage)
  : defaultLanguage;

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (language) => {
  window.localStorage.setItem(languageStorageKey, language);
});

export default i18n;
