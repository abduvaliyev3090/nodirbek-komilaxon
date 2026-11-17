/**
 * RSVP validation shared by the browser form and the API route,
 * so the server never trusts what the browser claims.
 */

export type Attendance = "yes" | "no";
export type RsvpErrorKey = "nameRequired" | "nameLength" | "attendanceRequired" | "guestsInvalid";
export type RsvpField = "name" | "attending" | "guests";

export interface RsvpValue {
  name: string;
  attending: Attendance;
  /** 0 when not attending, otherwise 1…maxGuests. */
  guests: number;
}

export type RsvpResult =
  | { ok: true; value: RsvpValue }
  | { ok: false; errors: Partial<Record<RsvpField, RsvpErrorKey>> };

export const NAME_MIN = 2;
export const NAME_MAX = 80;

/** Collapse whitespace, strip control characters. */
export function cleanText(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
}

export function validateRsvp(
  input: { name?: unknown; attending?: unknown; guests?: unknown },
  maxGuests: number,
): RsvpResult {
  const errors: Partial<Record<RsvpField, RsvpErrorKey>> = {};

  const name = typeof input.name === "string" ? cleanText(input.name) : "";
  if (!name) errors.name = "nameRequired";
  else if (name.length < NAME_MIN || name.length > NAME_MAX) errors.name = "nameLength";

  const attending = input.attending === "yes" || input.attending === "no" ? input.attending : null;
  if (!attending) errors.attending = "attendanceRequired";

  let guests = 0;
  if (attending === "yes") {
    const n = typeof input.guests === "number" ? input.guests : Number(input.guests);
    if (!Number.isInteger(n) || n < 1 || n > maxGuests) errors.guests = "guestsInvalid";
    else guests = n;
  }

  if (Object.keys(errors).length > 0 || !attending) return { ok: false, errors };
  return { ok: true, value: { name, attending, guests } };
}

/**
 * Spreadsheets treat a leading = + - @ as a formula. Neutralise that before a
 * guest-supplied string is forwarded anywhere (Telegram, Google Sheets webhook…).
 */
export function neutraliseFormula(text: string): string {
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}
