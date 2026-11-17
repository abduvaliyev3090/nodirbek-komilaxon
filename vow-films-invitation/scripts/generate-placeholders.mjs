/**
 * Generates the cinematic PLACEHOLDER images in /public/images.
 *
 * These are original, abstract SVG artworks created for this project (no stock photography,
 * nothing to license). They exist only so the site and film look complete until the couple's
 * real photographs arrive. Replace them — see README → "Replacing placeholders".
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

// deterministic pseudo-random so output is stable between runs
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const wrap = (w, h, title, body, defs = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<title>${title}</title>
<desc>Placeholder artwork generated for VOW FILMS · ETERNAL LOVE. Replace with a real photograph.</desc>
<defs>
${defs}
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${Math.round(w / 55)}"/></filter>
<filter id="soft2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.round(w / 140)}"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 .55 0"/></filter>
<radialGradient id="vig" cx="50%" cy="48%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".78"/></radialGradient>
</defs>
${body}
<rect width="${w}" height="${h}" fill="url(#vig)"/>
<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".09"/>
</svg>
`;

const write = (name, svg) => writeFileSync(join(OUT, name), svg);

/* ── hero: a night sky, a low golden glow and layered ridges ─────────────── */
{
  const w = 2000, h = 2000, r = rng(11);
  let stars = "";
  for (let i = 0; i < 260; i++) {
    const x = r() * w, y = r() * h * 0.7, s = r() < 0.08 ? 2.6 : r() * 1.4 + 0.4;
    stars += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${s.toFixed(2)}" fill="#f3ead8" opacity="${(0.25 + r() * 0.7).toFixed(2)}"/>`;
  }
  const ridge = (base, amp, color, seed, op = 1) => {
    const rr = rng(seed);
    let d = `M0 ${h} L0 ${base}`;
    for (let x = 0; x <= w; x += 100) d += ` L${x} ${(base - Math.sin(x / 260 + seed) * amp - rr() * amp * 0.6).toFixed(0)}`;
    return `<path d="${d} L${w} ${h} Z" fill="${color}" opacity="${op}"/>`;
  };
  write(
    "placeholder-hero.svg",
    wrap(
      w, h, "Placeholder: starry night with a golden horizon",
      `<rect width="${w}" height="${h}" fill="url(#sky)"/>
${stars}
<ellipse cx="${w / 2}" cy="${h * 0.72}" rx="${w * 0.55}" ry="${h * 0.2}" fill="#c9a96a" opacity=".42" filter="url(#soft)"/>
<ellipse cx="${w / 2}" cy="${h * 0.7}" rx="${w * 0.18}" ry="${h * 0.07}" fill="#f1dfae" opacity=".55" filter="url(#soft2)"/>
${ridge(h * 0.74, 60, "#16110c", 2, 0.85)}
${ridge(h * 0.8, 80, "#0d0a07", 5)}
${ridge(h * 0.88, 70, "#060504", 9)}`,
      `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050609"/><stop offset=".55" stop-color="#0d0d14"/><stop offset=".82" stop-color="#2a1d10"/><stop offset="1" stop-color="#3b2813"/></linearGradient>`,
    ),
  );
}

/* ── 01: arch of warm light ─────────────────────────────────────────────── */
{
  const w = 1200, h = 1600;
  write(
    "placeholder-01.svg",
    wrap(
      w, h, "Placeholder: an arch of warm light",
      `<rect width="${w}" height="${h}" fill="#0a0806"/>
<path d="M330 1250 V620 A270 270 0 0 1 870 620 V1250 Z" fill="url(#glow)"/>
<path d="M330 1250 V620 A270 270 0 0 1 870 620 V1250 Z" fill="none" stroke="#c9a96a" stroke-opacity=".55" stroke-width="3"/>
<ellipse cx="600" cy="1000" rx="300" ry="420" fill="#e6c887" opacity=".28" filter="url(#soft)"/>
<rect x="0" y="1250" width="${w}" height="350" fill="#050403"/>
<path d="M330 1260 H870 L960 1600 H240 Z" fill="#c9a96a" opacity=".14" filter="url(#soft2)"/>`,
      `<linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dfa8" stop-opacity=".9"/><stop offset=".6" stop-color="#b98a45" stop-opacity=".75"/><stop offset="1" stop-color="#5c3a18" stop-opacity=".9"/></linearGradient>`,
    ),
  );
}

/* ── 02: golden bokeh (landscape) ───────────────────────────────────────── */
{
  const w = 1600, h = 1200, r = rng(21);
  let dots = "";
  for (let i = 0; i < 46; i++) {
    const rad = 18 + r() * 90, op = 0.1 + r() * 0.5;
    dots += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${rad.toFixed(0)}" fill="${r() < 0.7 ? "#d9b46c" : "#f0d9a0"}" opacity="${op.toFixed(2)}" filter="url(#soft2)"/>`;
  }
  write("placeholder-02.svg", wrap(w, h, "Placeholder: golden bokeh lights", `<rect width="${w}" height="${h}" fill="#0b0907"/>${dots}`));
}

/* ── 03: candlelight ────────────────────────────────────────────────────── */
{
  const w = 1200, h = 1500, r = rng(31);
  let flames = "";
  for (let i = 0; i < 9; i++) {
    const x = 140 + i * 115 + r() * 30, y = 820 + Math.sin(i * 1.3) * 60 + r() * 40, s = 0.7 + r() * 0.7;
    flames += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${(150 * s).toFixed(0)}" ry="${(230 * s).toFixed(0)}" fill="#e7b865" opacity=".22" filter="url(#soft)"/>
<ellipse cx="${x.toFixed(0)}" cy="${(y + 20).toFixed(0)}" rx="${(13 * s).toFixed(0)}" ry="${(34 * s).toFixed(0)}" fill="#ffe9b0"/>
<rect x="${(x - 9).toFixed(0)}" y="${(y + 52).toFixed(0)}" width="18" height="${(260 + r() * 80).toFixed(0)}" fill="#e9dcc0" opacity=".72"/>`;
  }
  write("placeholder-03.svg", wrap(w, h, "Placeholder: candlelight", `<rect width="${w}" height="${h}" fill="#070605"/>${flames}<rect y="1230" width="${w}" height="270" fill="#030302" opacity=".85"/>`));
}

/* ── 04: folds of fabric ────────────────────────────────────────────────── */
{
  const w = 1200, h = 1600;
  let folds = "";
  for (let i = 0; i < 9; i++) {
    const x = -100 + i * 160, o = (0.07 + (i % 3) * 0.06).toFixed(2);
    folds += `<path d="M${x} 0 C ${x + 220} 380, ${x - 160} 900, ${x + 160} ${h}" fill="none" stroke="#efe2c4" stroke-opacity="${o}" stroke-width="${70 + (i % 4) * 26}" stroke-linecap="round" filter="url(#soft)"/>`;
  }
  write("placeholder-04.svg", wrap(w, h, "Placeholder: folds of fabric", `<rect width="${w}" height="${h}" fill="#0d0b09"/>${folds}<rect width="${w}" height="${h}" fill="#c9a96a" opacity=".05"/>`));
}

/* ── 05: two golden rings ───────────────────────────────────────────────── */
{
  const w = 1200, h = 1200;
  write(
    "placeholder-05.svg",
    wrap(
      w, h, "Placeholder: two golden rings",
      `<rect width="${w}" height="${h}" fill="#090807"/>
<circle cx="600" cy="600" r="420" fill="#c9a96a" opacity=".1" filter="url(#soft)"/>
<circle cx="510" cy="600" r="210" fill="none" stroke="url(#gold)" stroke-width="26"/>
<circle cx="690" cy="600" r="210" fill="none" stroke="url(#gold)" stroke-width="26"/>
<circle cx="510" cy="600" r="210" fill="none" stroke="#fff4d0" stroke-opacity=".25" stroke-width="3"/>
<circle cx="690" cy="600" r="210" fill="none" stroke="#fff4d0" stroke-opacity=".25" stroke-width="3"/>`,
      `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1dca0"/><stop offset=".5" stop-color="#a97f3f"/><stop offset="1" stop-color="#e3c27c"/></linearGradient>`,
    ),
  );
}

/* ── 06: constellation (landscape) ──────────────────────────────────────── */
{
  const w = 1600, h = 1100, r = rng(61);
  const pts = Array.from({ length: 9 }, (_, i) => [160 + i * 160 + r() * 60, 280 + Math.sin(i * 0.9) * 230 + r() * 120]);
  let lines = "", dots = "";
  pts.forEach(([x, y], i) => {
    if (i > 0) lines += `<line x1="${pts[i - 1][0].toFixed(0)}" y1="${pts[i - 1][1].toFixed(0)}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="#c9a96a" stroke-opacity=".55" stroke-width="1.6"/>`;
    dots += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="16" fill="#f1dfae" opacity=".25" filter="url(#soft2)"/><circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="#fff4d0"/>`;
  });
  let faint = "";
  for (let i = 0; i < 160; i++) faint += `<circle cx="${(r() * w).toFixed(0)}" cy="${(r() * h).toFixed(0)}" r="${(r() * 1.5 + 0.3).toFixed(1)}" fill="#f3ead8" opacity="${(0.2 + r() * 0.6).toFixed(2)}"/>`;
  write("placeholder-06.svg", wrap(w, h, "Placeholder: a constellation", `<rect width="${w}" height="${h}" fill="#05060a"/>${faint}${lines}${dots}`));
}

/* ── 07: dunes at dusk ──────────────────────────────────────────────────── */
{
  const w = 1200, h = 1500;
  write(
    "placeholder-07.svg",
    wrap(
      w, h, "Placeholder: dunes at dusk",
      `<rect width="${w}" height="${h}" fill="url(#dusk)"/>
<circle cx="760" cy="640" r="150" fill="#f0c98a" opacity=".5" filter="url(#soft)"/>
<path d="M0 860 C 240 740, 470 800, 700 880 S 1050 900, 1200 800 V${h} H0 Z" fill="#2a1a0e"/>
<path d="M0 1010 C 300 900, 560 1010, 820 1040 S 1100 1000, 1200 960 V${h} H0 Z" fill="#150e07"/>
<path d="M0 1200 C 260 1110, 540 1230, 820 1210 S 1100 1170, 1200 1150 V${h} H0 Z" fill="#080604"/>`,
      `<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0a10"/><stop offset=".45" stop-color="#3a2514"/><stop offset=".62" stop-color="#8a5b2c"/><stop offset="1" stop-color="#1a1008"/></linearGradient>`,
    ),
  );
}

/* ── 08: rose-gold bokeh ────────────────────────────────────────────────── */
{
  const w = 1200, h = 1600, r = rng(81);
  let dots = "";
  for (let i = 0; i < 34; i++) {
    const rad = 24 + r() * 100;
    dots += `<circle cx="${(r() * w).toFixed(0)}" cy="${(h * 0.25 + r() * h * 0.7).toFixed(0)}" r="${rad.toFixed(0)}" fill="${r() < 0.5 ? "#d7a58a" : "#e9c79a"}" opacity="${(0.1 + r() * 0.42).toFixed(2)}" filter="url(#soft2)"/>`;
  }
  write("placeholder-08.svg", wrap(w, h, "Placeholder: rose-gold bokeh", `<rect width="${w}" height="${h}" fill="#0c0908"/><rect width="${w}" height="${h}" fill="url(#fade)"/>${dots}`, `<linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#3a2216" stop-opacity=".5"/></linearGradient>`));
}

console.log("Placeholder images written to", OUT);
