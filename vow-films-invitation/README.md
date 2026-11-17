# VOW FILMS · ETERNAL LOVE — Wedding Invitation

A cinematic, dark-luxury wedding invitation: an interactive website **and** a matching 40-second film,
both driven by **one** configuration file. First invitation: **Nodirbek & Komilaxon**.

*A story written in the stars.*

| Product | Stack | Where |
|---|---|---|
| Invitation website (uz / ru / en) | Next.js 15 · TypeScript · Tailwind CSS · Framer Motion | `/src`, `/wedding.config.ts` |
| 40-second invitation film (9:16 and 16:9) | Remotion 4 | `/film` |

> **Status of this delivery.** All source files are complete. The environment this was written in had no
> network access, so `npm install`, `next build` and the video render could **not** be run there.
> What *was* run and passes: the config/translation/RSVP checks (`npm run check`, 440 checks) and
> strict TypeScript on the shared modules. Run the three commands in **Quick start** once on your machine
> to confirm the build and fix anything environment-specific — see **Verification checklist** below.

---

## Quick start

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local     # then fill in RSVP delivery (see below)
npm run check                  # config, translations, assets, RSVP validation
npm run dev                    # http://localhost:3000
```

Production build:

```bash
npm run typecheck
npm run build && npm start
```

Switch language: buttons top-right, or `?lang=ru` / `?lang=en` / `?lang=uz` in the URL (default: Uzbek).

---

## The one file you edit: `wedding.config.ts`

Couple names, date & time zone, venue, address, Google Maps link, hero image/video, story, gallery,
closing message, film message, guest limit, music, language settings and theme colours all live here.
The website **and** the film read it.

Everything inside `[ square brackets ]` is an **obvious placeholder**, not real information.
Search the file for `REPLACE`:

| Item | Placeholder now | What to do |
|---|---|---|
| `event.dateTime` | `2027-06-20T17:00:00+05:00` | Real date/time (ISO with offset). Then set `isPlaceholder: false` |
| `event.venue.name` / `address` | `[ Venue name ]` … | Real venue in all 3 languages |
| `event.mapUrl` | `https://www.google.com/maps` | Paste the venue's Google Maps share link |
| `story` | Neutral text with no personal facts | Write the couple's real story |
| `gallery.images` | Generated abstract SVGs | Real photos, then `arePlaceholders: false` |
| `hero.image` / `hero.video` | Generated SVG / none | Real cinematic photo; optional looping muted video |
| `music.src` | `/audio/invitation-theme.mp3` (file not included) | Add a licensed track |

### Replacing placeholders with real photographs
1. Drop images into `public/images/` (e.g. `nodirbek-komilaxon-01.jpg`, ~2000 px on the long side, <400 KB each after compression).
2. In `gallery.images` set `src`, `width`, `height` and the 3 `alt` descriptions.
3. Set `gallery.arePlaceholders: false` (hides the small "placeholder photo" tag).
4. Keep **at least 6** images — the film uses the first six (the 7th, if present, is the names-scene backdrop).

The placeholder artwork was generated for this project by `scripts/generate-placeholders.mjs`
(`npm run placeholders`). It is original abstract SVG art — **no stock photography is used and nothing
is claimed to be licensed**. Any real photo or music you add must be licensed or owned by you.

---

## Website experience

1. **Opening screen** — full-screen cinematic intro with **ENTER INVITATION**, language picker and a loading state.
2. **Hero** — couple names, date, slow cinematic push (or looping video if configured).
3. **Our story** — lead line + three chapters with a parallax portrait.
4. **Gallery** — masonry grid, fullscreen viewer (keyboard ← → Esc, swipe, focus trap).
5. **Countdown** — live, from `event.dateTime`; handles "today" and an invalid date.
6. **Event details** — date, time, venue, address, **Get directions** (Google Maps), **Add to calendar** (.ics).
7. **RSVP** — name, attendance, number of guests; validated in browser *and* on the server.
8. **Closing** — personal message, signature, back-to-top, VOW FILMS sign-off.

**Music** starts only after the guest clicks ENTER INVITATION (or the equaliser button). "Continue without sound" is offered. If the audio file is missing the control hides itself.

**Accessibility & resilience:** skip link, semantic landmarks, labelled form with `aria-invalid`/`role="alert"`, focus
management and trap in the viewer, visible focus rings, `prefers-reduced-motion` (Framer `MotionConfig` + CSS),
`<noscript>` fallback, image/video/audio error fallbacks, 44 px touch targets, mobile-first layout.

---

## RSVP — privacy and delivery

- Answers are **never shown on the site**; there is **no endpoint that lists them** (`/api/rsvp` is POST-only).
- Answers are forwarded server-side to **Telegram** and/or a **webhook**. Secrets are environment variables only.
- If neither is configured: in development the answer prints to your terminal; in **production the form shows
  "unavailable"** rather than silently losing replies.
- Protections: server-side re-validation, honeypot field, same-origin check, 2 KB body limit, best-effort
  rate limit (6 / 10 min / IP), spreadsheet-formula neutralisation, `Cache-Control: no-store`, nothing logged in production.

**Telegram setup (recommended)**
1. Message **@BotFather** → `/newbot` → copy the token → `TELEGRAM_BOT_TOKEN`.
2. Send any message to your new bot (or add it to a private group).
3. Open `https://api.telegram.org/bot<TOKEN>/getUpdates`, copy `"chat":{"id":…}` → `TELEGRAM_CHAT_ID`.

**Webhook (Google Sheets, Make, Zapier, n8n…)** — `RSVP_WEBHOOK_URL` receives
`{ name, attending, guests, lang, submittedAt }` as JSON (`Authorization: Bearer <RSVP_WEBHOOK_SECRET>` if set).
Google Apps Script cannot read headers, so for Apps Script put a key in the URL (`…/exec?key=XYZ`) and check `e.parameter.key`.

> The simple rate limiter is per server instance. For a public launch with heavy traffic add Vercel's WAF rate limiting.

---

## The film (`/film`)

A 1080×1920 (9:16) and 1920×1080 (16:9) film, 30 fps, exactly **40 s**, for each of uz / ru / en.

| Seconds | Scene | What you see |
|---|---|---|
| 0–5 | Atmospheric opening | Starry horizon resolving out of blur, gold dust, ETERNAL LOVE title |
| 5–12 | Cinematic couple visuals | Three slow-push photos (gallery 1–3), cross-dissolves |
| 12–18 | Romantic detail shots | Three tight "macro" crops (gallery 4–6), light leak, cinema bars |
| 18–25 | Couple names | Letter-spacing reveal of the two names with the ampersand |
| 25–32 | Wedding date | Weekday, large day number, month, year, time |
| 32–37 | Invitation message | `film.inviteMessage` + venue name & address |
| 37–40 | VOW FILMS closing | Wordmark, collection, tagline, fade to black |

It imports `../wedding.config.ts`, `src/i18n/translations.ts` and `src/lib/dates.ts` — so **text, images, date, time,
venue and address change from the same configuration as the website**. Scene timings are in `film/src/timing.ts`.

```bash
cd film
npm install
npm run studio                 # live preview & scrubbing in the browser
npm run render                 # 3 languages × 2 formats → film/out/*.mp4   (6 files)
npm run render -- uz vertical  # only Uzbek, 9:16
npm run still                  # poster frame → film/out/poster.png
```

First render downloads a headless Chrome (~100 MB) automatically. No separate FFmpeg install is needed.
Add music by setting `film.audioSrc` (file inside `/public`); it fades in/out automatically.

---

## Deploy to Vercel

1. Push this folder to a Git repository (GitHub / GitLab / Bitbucket).
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo. Framework preset: **Next.js** (auto-detected). Root directory: the repo root. Build/Output settings: defaults.
3. **Settings → Environment Variables** — add (Production + Preview) the values from `.env.example`:
   `NEXT_PUBLIC_SITE_URL`, and `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` and/or `RSVP_WEBHOOK_URL` (+ `RSVP_WEBHOOK_SECRET`).
4. **Deploy.** Then **Settings → Domains** to attach the couple's domain.
5. Submit a test RSVP on the live site and confirm it arrives. **Redeploy after changing any env var.**

CLI alternative: `npm i -g vercel && vercel && vercel --prod`.

The site sends `noindex` (header + meta) so search engines skip a private invitation. To make it public, remove
the `X-Robots-Tag` line in `next.config.mjs` and `robots` in `src/app/layout.tsx`.

To host the rendered film on the site, put the `.mp4` in `public/` and link or embed it — keep it under ~50 MB.

---

## Project structure

```
wedding.config.ts            ← the single source of truth (site + film)
src/
  app/                       layout, page, globals.css, api/rsvp/route.ts
  components/                EnterScreen, Header, InvitationExperience
    sections/                Hero, Story, Gallery(+Lightbox), Countdown, EventDetails, Rsvp, Closing
    ui/                      Reveal, Ornament, SectionHeading, LanguageSwitcher, MusicToggle, icons
  i18n/translations.ts       uz / ru / en UI strings (type-checked for identical keys)
  lib/                       language, dates, rsvp (shared validation), ics, useMusic, useCountdown, theme
public/images, public/audio  placeholder art / your music
scripts/                     generate-placeholders.mjs, check-config.ts
film/                        Remotion project (own package.json)
```

**Adding a language:** add it to `Lang` and `languages` in `wedding.config.ts`, add a `Localized` value everywhere
the checker reports, and add a dictionary in `translations.ts` — TypeScript will list every missing key.

---

## Verification checklist (run once on your machine)

- [ ] `npm install && npm run check && npm run typecheck && npm run build` all succeed
- [ ] Open the site on a phone: intro → ENTER → music (if file present) → all sections → RSVP
- [ ] Switch UZ / RU / EN: no clipped text; Cyrillic and Uzbek characters render in the serif font
- [ ] OS "reduce motion" on: no parallax/Ken-Burns drift, content still fully visible
- [ ] Gallery viewer: arrows, Esc, swipe; focus returns to the thumbnail
- [ ] RSVP: errors show, success shows, the message reaches Telegram/webhook; production with no env shows "unavailable"
- [ ] `cd film && npm install && npm run studio` → scrub 0–40 s; render one file and watch it
- [ ] Lighthouse mobile: performance & accessibility (target ≥ 90 once real photos are compressed)

## Known limitations / decisions

- Story text, gallery, venue, address, date and map link are placeholders by design — nothing about the couple was invented.
- Uzbek is written in Latin script. Have a native speaker proof-read all three languages before sending to guests.
- Rate limiting is best-effort (in-memory). Remotion version is `^4`; if Remotion warns about mismatched package versions run `npx remotion upgrade` in `/film`.
- Fonts (Cormorant Garamond, Manrope) load from Google Fonts at build time; both are open-licensed (SIL OFL).
