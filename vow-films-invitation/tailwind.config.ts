import type { Config } from "tailwindcss";

/** Colours come from CSS variables that are filled from wedding.config.ts (see src/lib/theme.ts). */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: channel("--c-ink"),
        ivory: channel("--c-ivory"),
        gold: channel("--c-gold"),
        "gold-soft": channel("--c-gold-soft"),
        mist: channel("--c-mist"),
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        cine: "0.32em",
        wide2: "0.22em",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.04) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.16) translate3d(-1.5%,-1%,0)" },
        },
        drawline: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        eq: {
          "0%,100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        floaty: {
          "0%,100%": { transform: "translateY(0)", opacity: "0.5" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
      },
      animation: {
        kenburns: "kenburns 26s ease-in-out infinite alternate",
        drawline: "drawline 1.6s cubic-bezier(.2,.7,.2,1) both",
        eq: "eq 1s ease-in-out infinite",
        floaty: "floaty 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
