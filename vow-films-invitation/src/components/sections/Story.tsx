"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const ROMAN = ["I", "II", "III", "IV", "V"];

export function Story() {
  const { t, l } = useLang();
  const reduce = useReducedMotion();
  const { story, gallery } = weddingConfig;
  const imageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-36, 36]);
  const portrait = gallery.images[0];

  return (
    <section id="story" className="relative px-6 py-28 sm:py-40" aria-labelledby="story-title">
      <SectionHeading index={1} id="story-title" title={t.story.title} lead={l(story.lead)} />

      <div className="mx-auto mt-20 grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-24">
        {portrait ? (
          <Reveal>
            <div ref={imageRef} className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
              <motion.div className="absolute -inset-[8%]" style={{ y }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portrait.src}
                  alt={l(portrait.alt)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-3 border border-gold/30" />
            </div>
          </Reveal>
        ) : null}

        <ol className="space-y-14">
          {story.chapters.map((chapter, i) => (
            <Reveal as="li" key={i} delay={i * 0.1} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <span className="row-span-2 font-serif text-3xl italic text-gold/80" aria-hidden="true">
                {ROMAN[i] ?? i + 1}
              </span>
              <h3 className="font-serif text-3xl font-light sm:text-4xl">{l(chapter.title)}</h3>
              <p className="text-base leading-8 text-ivory/70 sm:text-lg sm:leading-9">{l(chapter.text)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
