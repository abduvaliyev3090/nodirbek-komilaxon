"use client";

import { useLang } from "@/lib/language";
import type { MusicState } from "@/lib/useMusic";

/** Equaliser-style button. Renders nothing if the music file is missing or blocked. */
export function MusicToggle({ state, onToggle }: { state: MusicState; onToggle: () => void }) {
  const { t } = useLang();
  if (state === "unavailable") return null;
  const playing = state === "playing";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? t.nav.musicOff : t.nav.musicOn}
      title={playing ? t.nav.musicOff : t.nav.musicOn}
      className="focus-ring flex h-11 w-11 items-center justify-center text-gold-soft"
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        {[0, 0.25, 0.5, 0.15].map((delay, i) => (
          <span
            key={i}
            className={`block w-[2px] origin-bottom bg-current ${playing ? "animate-eq" : "scale-y-[0.35]"}`}
            style={{ height: "100%", animationDelay: `${delay}s` }}
          />
        ))}
      </span>
    </button>
  );
}
