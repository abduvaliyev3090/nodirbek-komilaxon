"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { weddingConfig, type Lang } from "../../wedding.config";
import { translations, type Dictionary } from "../i18n/translations";

const STORAGE_KEY = "vow-films:lang";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
  /** Pick the current language from a Localized value from wedding.config.ts. */
  l: <T>(value: Record<Lang, T>) => T;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (weddingConfig.languages.enabled as string[]).includes(value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Server and first client render always use the default language → no hydration mismatch.
  const [lang, setLangState] = useState<Lang>(weddingConfig.languages.default);

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked — ignore */
    }
    const picked = [fromQuery, stored].find(isLang);
    if (picked) setLangState(picked as Lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang].meta.title;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: translations[lang], l: (v) => v[lang] }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}
