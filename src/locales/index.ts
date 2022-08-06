import { createI18n } from "vue-i18n";
import zh from "./zh";
import en from "./en";

const messages = {
  zh,
  en,
};

const i18n = createI18n({
  // legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

export default i18n;
