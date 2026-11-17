"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useState } from "react";
import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";
import { formatLongDate, formatTime, formatWeekday } from "@/lib/dates";
import { Ornament } from "@/components/ui/Ornament";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.28, delayChildren: 0.5 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.6, ease: [0.2, 0.7, 0.2, 1] } },
};

export function Hero({ entered }: { entered: boolean }) {
  const { t, l, lang } = useLang();
  const reduce = useReducedMotion();
  const [videoFailed, setVideoFailed] = useState(false);
  const { couple, hero, event } = weddingConfig;

  const date = formatLongDate(event.dateTime, event.timeZone, lang);
  const time = formatTime(event.dateTime, event.timeZone);
  const weekday = formatWeekday(event.dateTime, event.timeZone, lang);
  const showVideo = Boolean(hero.video) && !videoFailed && !reduce;

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-28" aria-labelledby="hero-title">
      {/* background: video if provided, otherwise the photograph with a slow cinematic push */}
      <div className="absolute inset-0" aria-hidden="true">
        {showVideo ? (
          <video
            className="h-full w-full object-cover"
            src={hero.video}
            poster={hero.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.image} alt="" className="h-full w-full animate-kenburns object-cover" fetchPriority="high" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/25 to-ink" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgb(var(--c-ink)/0.8)_100%)]" />
      </div>
      <div className="pointer-events-none absolute inset-4 border border-gold/20 sm:inset-8" aria-hidden="true" />

      <motion.div
        className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate={entered ? "show" : "hidden"}
      >
        <motion.p variants={item} className="eyebrow max-w-xs leading-loose sm:max-w-none">
          {l(hero.invite)}
        </motion.p>

        <h1 id="hero-title" className="display mt-10 flex flex-col items-center text-[clamp(3.4rem,17vw,9.5rem)]">
          <motion.span variants={item} className="block">
            {couple.first}
          </motion.span>
          <motion.span variants={item} className="my-1 block font-serif text-[0.5em] italic leading-none text-gold sm:my-2" aria-hidden="true">
            &amp;
          </motion.span>
          <span className="sr-only"> and </span>
          <motion.span variants={item} className="block">
            {couple.second}
          </motion.span>
        </h1>

        <motion.div variants={item} className="mt-12 w-full">
          <Ornament />
        </motion.div>

        <motion.div variants={item} className="mt-10">
          {weekday ? <p className="eyebrow">{weekday}</p> : null}
          {date ? <p className="mt-3 font-serif text-3xl font-light sm:text-4xl">{date}</p> : null}
          {time ? <p className="mt-2 font-serif text-xl italic text-ivory/70">{time}</p> : null}
          {event.isPlaceholder ? (
            <p className="mt-4 inline-block border border-dashed border-gold/40 px-3 py-1 text-[0.65rem] uppercase tracking-wide2 text-mist">
              {t.hero.placeholderDate}
            </p>
          ) : null}
        </motion.div>
      </motion.div>

      <motion.a
        href="#story"
        className="focus-ring absolute bottom-8 z-10 flex flex-col items-center gap-3 text-[0.62rem] uppercase tracking-cine text-ivory/60 sm:bottom-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: entered ? 1 : 0 }}
        transition={{ delay: 3, duration: 1.5 }}
      >
        {t.hero.scroll}
        <span className="block h-10 w-px animate-floaty bg-gradient-to-b from-gold to-transparent" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
