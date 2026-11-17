import type { Lang } from "../../wedding.config";

/**
 * Deterministic date formatting (same output on server and client, in any
 * browser, regardless of ICU data). Also used by the Remotion film.
 */

export const MONTHS_GENITIVE: Record<Lang, string[]> = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

export const MONTHS_NOMINATIVE: Record<Lang, string[]> = {
  uz: MONTHS_GENITIVE.uz,
  ru: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
  en: MONTHS_GENITIVE.en,
};

/** Index 0 = Sunday. */
export const WEEKDAYS: Record<Lang, string[]> = {
  uz: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
  ru: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

export interface DateParts {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 0 = Sunday */
  weekday: number;
}

const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Date parts as seen in the wedding's own time zone. Returns null for an invalid date. */
export function getDateParts(iso: string, timeZone: string): DateParts | null {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return null;
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
      hourCycle: "h23",
    });
    const map: Record<string, string> = {};
    for (const part of formatter.formatToParts(new Date(ms))) map[part.type] = part.value;
    return {
      year: Number(map.year),
      month: Number(map.month),
      day: Number(map.day),
      hour: Number(map.hour) % 24,
      minute: Number(map.minute),
      weekday: WEEKDAY_INDEX[map.weekday] ?? 0,
    };
  } catch {
    return null;
  }
}

export function formatLongDate(iso: string, timeZone: string, lang: Lang): string | null {
  const p = getDateParts(iso, timeZone);
  if (!p) return null;
  const month = MONTHS_GENITIVE[lang][p.month - 1];
  if (lang === "uz") return `${p.year}-yil, ${p.day}-${month}`;
  if (lang === "ru") return `${p.day} ${month} ${p.year}`;
  return `${month} ${p.day}, ${p.year}`;
}

export function formatTime(iso: string, timeZone: string): string | null {
  const p = getDateParts(iso, timeZone);
  if (!p) return null;
  return `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
}

export function formatWeekday(iso: string, timeZone: string, lang: Lang): string | null {
  const p = getDateParts(iso, timeZone);
  return p ? WEEKDAYS[lang][p.weekday] : null;
}
