"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

/**
 * Full-screen cinematic opening. Doubles as the explicit-interaction gate for music:
 * sound only ever starts from the ENTER INVITATION click (never automatically).
 */
export function EnterScreen({ onEnter }: { onEnter: (withSound: boolean) => void }) {
  const { t, l } = useLang();
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { couple, brand, hero } = weddingConfig;

  // Loading state: wait for the hero photograph, but never block longer than 3 s.
  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        setReady(true);
      }
    };
    const img = new Image();
    img.onload = finish;
    img.onerror = finish;
    img.src = hero.image;
    const timer = window.setTimeout(finish, 3000);
    return () => {
      finished = true;
      window.clearTimeout(timer);
    };
  }, [hero.image]);

  useEffect(() => {
    if (ready) buttonRef.current?.focus({ preventScroll: true });
  }, [ready]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${brand.name} — ${brand.collection}`}
      className="js-intro fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ink px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* photograph, deeply darkened */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-40 blur-[2px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--c-ink)/0.35)_0%,rgb(var(--c-ink)/0.92)_75%)]" />
      <div className="pointer-events-none absolute inset-4 border border-gold/20 sm:inset-8" />

      <div className="absolute right-4 top-4 z-10 sm:right-10 sm:top-8">
        <LanguageSwitcher />
      </div>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2 }}
        >
          {t.intro.presents}
        </motion.p>

        <motion.h1
          className="display mt-8 text-[clamp(2.6rem,11vw,5.5rem)] tracking-[0.2em] [text-indent:0.2em]"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ delay: 0.7, duration: 1.8 }}
        >
          {brand.collection.split(" ").map((word) => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </motion.h1>

        <motion.span
          aria-hidden="true"
          className="mt-8 block h-px w-28 origin-center bg-gold/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        />

        <motion.p
          className="mt-8 font-serif text-xl italic text-ivory/80 sm:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.4 }}
        >
          {couple.first} <span className="text-gold">&amp;</span> {couple.second}
        </motion.p>

        <div className="mt-14 flex min-h-[8.5rem] flex-col items-center justify-start">
          {ready ? (
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              <button ref={buttonRef} type="button" className="btn-gold" onClick={() => onEnter(true)}>
                {t.intro.enter}
              </button>
              <button type="button" className="btn-quiet" onClick={() => onEnter(false)}>
                {t.intro.silent}
              </button>
              <p className="mt-1 text-[0.68rem] tracking-wide2 text-mist/80">{t.intro.hint}</p>
            </motion.div>
          ) : (
            <div role="status" className="flex flex-col items-center gap-4 pt-3">
              <span className="relative block h-px w-32 overflow-hidden bg-ivory/15">
                <span className="absolute inset-y-0 left-0 w-1/3 animate-pulse bg-gold" />
              </span>
              <span className="text-[0.68rem] uppercase tracking-wide2 text-mist">{t.intro.loading}</span>
            </div>
          )}
        </div>
      </div>

      <p className="sr-only">{l(brand.tagline)}</p>
    </motion.div>
  );
}
