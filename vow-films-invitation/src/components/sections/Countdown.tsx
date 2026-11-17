"use client";

import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";
import { useCountdown } from "@/lib/useCountdown";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

function Unit({ value, label, pad = 2 }: { value: number; label: string; pad?: number }) {
  const text = String(value).padStart(pad, "0");
  return (
    <div className="flex min-w-0 flex-col items-center">
      <div className="relative h-[1.1em] overflow-hidden font-serif text-[clamp(2.6rem,12vw,6rem)] font-light leading-none tabular-nums text-ivory">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block"
            initial={{ y: "60%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-60%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-3 text-[0.6rem] uppercase tracking-wide2 text-gold sm:text-xs">{label}</span>
    </div>
  );
}

export function Countdown() {
  const { t } = useLang();
  const cd = useCountdown(weddingConfig.event.dateTime);

  const spoken = `${cd.days} ${t.countdown.days}, ${cd.hours} ${t.countdown.hours}, ${cd.minutes} ${t.countdown.minutes}`;

  return (
    <section className="relative overflow-hidden px-4 py-28 sm:py-36" aria-labelledby="countdown-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--c-gold)/0.08),transparent_65%)]" aria-hidden="true" />
      <SectionHeading index={3} id="countdown-title" title={t.countdown.title} />

      <Reveal className="mx-auto mt-14 max-w-4xl text-center">
        {!cd.ready ? (
          <div className="mx-auto h-24 w-full max-w-md animate-pulse border-y border-ivory/10" aria-hidden="true" />
        ) : !cd.valid ? (
          <p className="font-serif text-2xl italic text-ivory/70">{t.countdown.unavailable}</p>
        ) : cd.arrived ? (
          <p className="font-serif text-4xl italic text-gold-soft sm:text-5xl">{t.countdown.arrived}</p>
        ) : (
          <div role="timer" aria-label={spoken} className="grid grid-cols-4 gap-2 border-y border-gold/20 py-10 sm:gap-8">
            <Unit value={cd.days} label={t.countdown.days} pad={cd.days >= 100 ? 3 : 2} />
            <Unit value={cd.hours} label={t.countdown.hours} />
            <Unit value={cd.minutes} label={t.countdown.minutes} />
            <Unit value={cd.seconds} label={t.countdown.seconds} />
          </div>
        )}
      </Reveal>
    </section>
  );
}
