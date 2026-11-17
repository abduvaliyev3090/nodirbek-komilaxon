import type { CSSProperties } from "react";
import { weddingConfig } from "../../wedding.config";

/** "#c9a96a" → "201 169 106" (the channel format Tailwind's alpha modifiers need). */
export function hexToChannels(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return "0 0 0";
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function themeVars(): CSSProperties {
  const { colors, grain } = weddingConfig.theme;
  return {
    "--c-ink": hexToChannels(colors.ink),
    "--c-ivory": hexToChannels(colors.ivory),
    "--c-gold": hexToChannels(colors.gold),
    "--c-gold-soft": hexToChannels(colors.goldSoft),
    "--c-mist": hexToChannels(colors.mist),
    "--grain": String(grain),
  } as CSSProperties;
}
