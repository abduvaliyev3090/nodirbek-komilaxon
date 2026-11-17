import { NextResponse } from "next/server";
import { weddingConfig } from "../../../../wedding.config";
import { cleanText, neutraliseFormula, validateRsvp } from "@/lib/rsvp";

/**
 * POST /api/rsvp
 *
 * Privacy design:
 *  - There is NO GET handler and nothing here ever returns stored answers.
 *  - Answers are forwarded server-side to Telegram and/or a webhook (secrets live in env vars).
 *  - Nothing is logged in production.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const JSON_HEADERS = { "Cache-Control": "no-store" };
const MAX_BODY_BYTES = 2048;

// Best-effort rate limit (per server instance). For hard limits add Vercel WAF / Upstash.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

function reply(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: JSON_HEADERS });
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients (curl) — still protected by validation + rate limit
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}`);
  return true;
}

async function sendWebhook(payload: Record<string, unknown>): Promise<boolean> {
  const url = process.env.RSVP_WEBHOOK_URL;
  if (!url) return false;
  const secret = process.env.RSVP_WEBHOOK_SECRET;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  return true;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return reply({ error: "forbidden" }, 403);

  const length = Number(req.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) return reply({ error: "too_large" }, 413);

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) return reply({ error: "rate_limited" }, 429);

  let body: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ error: "too_large" }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "invalid" }, 400);
  }

  // Honeypot: real people never see or fill this field. Pretend success so bots learn nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") return reply({ ok: true });

  const result = validateRsvp(body, weddingConfig.rsvp.maxGuests);
  if (!result.ok) return reply({ error: "invalid", fields: result.errors }, 422);

  const { name, attending, guests } = result.value;
  const lang = typeof body.lang === "string" && ["uz", "ru", "en"].includes(body.lang) ? body.lang : "uz";
  const submittedAt = new Date().toISOString();
  const safeName = neutraliseFormula(cleanText(name));

  const couple = `${weddingConfig.couple.first} & ${weddingConfig.couple.second}`;
  const text = [
    `RSVP · ${couple}`,
    `Name: ${safeName}`,
    `Attending: ${attending === "yes" ? "YES" : "NO"}`,
    ...(attending === "yes" ? [`Guests: ${guests}`] : []),
    `Language: ${lang}`,
    `Received: ${submittedAt}`,
  ].join("\n");

  const hasDestination = Boolean(
    (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) || process.env.RSVP_WEBHOOK_URL,
  );

  if (!hasDestination) {
    if (process.env.NODE_ENV !== "production") {
      // Local development only: show the answer in the terminal so the form can be tested.
      console.info("[rsvp:dev — no destination configured]\n" + text);
      return reply({ ok: true, dev: true });
    }
    return reply({ error: "unavailable" }, 503);
  }

  try {
    const outcomes = await Promise.allSettled([
      sendTelegram(text),
      sendWebhook({ name: safeName, attending, guests, lang, submittedAt }),
    ]);
    const delivered = outcomes.some((o) => o.status === "fulfilled" && o.value === true);
    if (!delivered) return reply({ error: "unavailable" }, 502);
    return reply({ ok: true });
  } catch {
    return reply({ error: "unavailable" }, 502);
  }
}
