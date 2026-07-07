// src/lib/i18n.jsx
// Hindi/English toggle — real feature for the actual customer base.
// Wrap the app in <I18nProvider>. t({ en, hi }) returns the right string.

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const I18nContext = createContext(null);
const STORAGE_KEY = "fakhri:lang";

export function I18nProvider({ children, defaultLang = "en" }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return defaultLang;
    return localStorage.getItem(STORAGE_KEY) || defaultLang;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "hi" ? "hi" : "en";
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: (obj) => {
        if (obj == null) return "";
        if (typeof obj === "string") return obj;
        return obj[lang] ?? obj.en ?? "";
      },
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
