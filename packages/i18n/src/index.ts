import i18n from "i18next";
import en from "./locales/en/common.json";
import si from "./locales/si/common.json";
import ta from "./locales/ta/common.json";

export const resources = {
  en: { common: en },
  si: { common: si },
  ta: { common: ta },
};

export function initI18n(language = "en") {
  if (!i18n.isInitialized) {
    void i18n.init({
      resources,
      lng: language,
      fallbackLng: "en",
      defaultNS: "common",
      interpolation: { escapeValue: false },
    });
  }
  return i18n;
}

export { i18n };
export default i18n;
