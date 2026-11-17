/**
 * Sanity checks you can run any time:  npm run check
 *  - every Localized value in wedding.config.ts has uz / ru / en text
 *  - the three translation dictionaries have identical keys
 *  - the wedding date parses
 *  - every gallery / hero image exists on disk
 *  - RSVP validation behaves
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { weddingConfig, type Lang } from "../wedding.config";
import { translations } from "../src/i18n/translations";
import { formatLongDate, formatTime, formatWeekday } from "../src/lib/dates";
import { validateRsvp, neutraliseFormula } from "../src/lib/rsvp";

const LANGS: Lang[] = ["uz", "ru", "en"];
const root = join(__dirname, "..");
const problems: string[] = [];
let passed = 0;

const ok = (cond: boolean, message: string) => {
  if (cond) passed++;
  else problems.push(message);
};

// 1 ── localized values -------------------------------------------------------
function walk(value: unknown, path: string) {
  if (!value || typeof value !== "object") return;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  const looksLocalized =
    LANGS.every((l) => keys.includes(l)) && keys.length === LANGS.length && LANGS.every((l) => typeof obj[l] === "string");
  if (looksLocalized) {
    for (const l of LANGS) ok(typeof obj[l] === "string" && (obj[l] as string).trim() !== "", `config ${path}.${l} is empty`);
    return;
  }
  for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k);
}
walk(weddingConfig, "");

// 2 ── dictionary parity ------------------------------------------------------
function flatKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj === "string") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => flatKeys(v, prefix ? `${prefix}.${k}` : k));
}
const base = flatKeys(translations.uz).sort();
for (const l of LANGS) {
  const keys = flatKeys(translations[l]).sort();
  ok(JSON.stringify(keys) === JSON.stringify(base), `dictionary "${l}" has different keys than "uz"`);
  const flat = (o: unknown, p = ""): [string, string][] =>
    typeof o === "string" ? [[p, o]] : Object.entries(o as Record<string, unknown>).flatMap(([k, v]) => flat(v, p ? `${p}.${k}` : k));
  for (const [k, v] of flat(translations[l])) ok(v.trim() !== "", `translation ${l}.${k} is empty`);
}
// {tokens} must match across languages
const tokens = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");
const flatStr = (o: unknown, p = ""): Record<string, string> =>
  typeof o === "string" ? { [p]: o } : Object.assign({}, ...Object.entries(o as Record<string, unknown>).map(([k, v]) => flatStr(v, p ? `${p}.${k}` : k)));
const fu = flatStr(translations.uz);
for (const l of ["ru", "en"] as const) {
  const fo = flatStr(translations[l]);
  for (const k of Object.keys(fu)) ok(tokens(fu[k]) === tokens(fo[k]), `placeholder tokens differ in ${l}.${k}`);
}

// 3 ── date -------------------------------------------------------------------
const { dateTime, timeZone } = weddingConfig.event;
ok(!Number.isNaN(Date.parse(dateTime)), `event.dateTime "${dateTime}" is not a valid ISO date`);
for (const l of LANGS) ok(formatLongDate(dateTime, timeZone, l) !== null, `cannot format date in ${l}`);

// 4 ── assets -----------------------------------------------------------------
const assets = [weddingConfig.hero.image, ...weddingConfig.gallery.images.map((i) => i.src)];
for (const a of assets) if (a.startsWith("/")) ok(existsSync(join(root, "public", a)), `missing file public${a}`);
ok(weddingConfig.gallery.images.length >= 6, "gallery needs at least 6 images (the film uses the first six)");

// 5 ── RSVP validation --------------------------------------------------------
const max = weddingConfig.rsvp.maxGuests;
ok(validateRsvp({ name: "Ali Valiyev", attending: "yes", guests: 2 }, max).ok, "valid RSVP rejected");
ok(validateRsvp({ name: "Ali Valiyev", attending: "no", guests: 99 }, max).ok, "decline should ignore guest count");
ok(!validateRsvp({ name: "", attending: "yes", guests: 1 }, max).ok, "empty name accepted");
ok(!validateRsvp({ name: "A", attending: "yes", guests: 1 }, max).ok, "1-char name accepted");
ok(!validateRsvp({ name: "x".repeat(81), attending: "yes", guests: 1 }, max).ok, "81-char name accepted");
ok(!validateRsvp({ name: "Ali Valiyev", attending: "maybe", guests: 1 }, max).ok, "bad attendance accepted");
ok(!validateRsvp({ name: "Ali Valiyev", attending: "yes", guests: 0 }, max).ok, "0 guests accepted");
ok(!validateRsvp({ name: "Ali Valiyev", attending: "yes", guests: max + 1 }, max).ok, "too many guests accepted");
ok(!validateRsvp({ name: "Ali Valiyev", attending: "yes", guests: 1.5 }, max).ok, "fractional guests accepted");
ok(neutraliseFormula("=HYPERLINK()") === "'=HYPERLINK()", "formula injection not neutralised");

// report -------------------------------------------------------------------------
console.log(`Date preview:  ${formatWeekday(dateTime, timeZone, "en")}, ${formatLongDate(dateTime, timeZone, "en")} ${formatTime(dateTime, timeZone)}`);
console.log(`              ${formatLongDate(dateTime, timeZone, "uz")} · ${formatLongDate(dateTime, timeZone, "ru")}`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):\n - ${problems.join("\n - ")}`);
  process.exit(1);
}
console.log(`\n✓ ${passed} checks passed`);
