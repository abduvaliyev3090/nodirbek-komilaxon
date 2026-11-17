import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { weddingConfig } from "@wedding";
import { translations } from "@/i18n/translations";
import { themeVars } from "@/lib/theme";
import "./globals.css";

// Both families include the Cyrillic and Latin-extended glyphs that Russian and Uzbek need.
const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const defaultT = translations[weddingConfig.languages.default];
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  title: defaultT.meta.title,
  description: defaultT.meta.description,
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  applicationName: "VOW FILMS · ETERNAL LOVE",
  // Private invitation: keep out of search engines (also sent as a header in next.config.mjs).
  robots: { index: false, follow: false },
  openGraph: {
    title: defaultT.meta.title,
    description: defaultT.meta.description,
    type: "website",
    images: [{ url: weddingConfig.hero.image }],
  },
};

export const viewport: Viewport = {
  themeColor: weddingConfig.theme.colors.ink,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={weddingConfig.languages.default} className={`${serif.variable} ${sans.variable}`} style={themeVars()}>
      <body>
        <noscript>
          {/* Without JavaScript: remove the intro overlay and show all content. */}
          <style>{`.js-intro{display:none!important}body{overflow:auto!important}[style*="opacity: 0"]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
          <p style={{ position: "relative", zIndex: 70, padding: "1rem", textAlign: "center", background: "#000", color: "#e6d3a3" }}>
            {defaultT.noscript}
          </p>
        </noscript>
        {children}
      </body>
    </html>
  );
}
