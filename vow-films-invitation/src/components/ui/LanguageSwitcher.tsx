"use client";

import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const { enabled, labels } = weddingConfig.languages;

  return (
    <div role="group" aria-label={t.nav.language} className={`flex items-center ${className}`}>
      {enabled.map((code, i) => (
        <span key={code} className="flex items-center">
          {i > 0 ? <span aria-hidden="true" className="h-3 w-px bg-ivory/20" /> : null}
          <button
            type="button"
            lang={code}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            aria-label={labels[code].native}
            title={labels[code].native}
            className={`focus-ring min-h-11 min-w-11 px-2 font-sans text-[0.7rem] tracking-wide2 transition-colors ${
              lang === code ? "text-gold-soft" : "text-ivory/55 hover:text-ivory"
            }`}
          >
            {labels[code].short}
          </button>
        </span>
      ))}
    </div>
  );
}
