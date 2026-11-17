"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { weddingConfig } from "@wedding";
import { fill } from "@/i18n/translations";
import { useLang } from "@/lib/language";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/ui/icons";

export function Gallery() {
  const { t, l } = useLang();
  const { images, arePlaceholders } = weddingConfig.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpenIndex(index);
  };
  const close = useCallback(() => {
    setOpenIndex(null);
    // hand focus back to the thumbnail that opened the viewer
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  return (
    <section id="gallery" className="px-4 py-28 sm:px-8 sm:py-40" aria-labelledby="gallery-title">
      <SectionHeading index={2} id="gallery-title" title={t.gallery.title} lead={t.gallery.lead} />

      {/* CSS columns = a calm masonry that respects each photograph's own proportions */}
      <div className="mx-auto mt-16 max-w-6xl columns-2 gap-3 sm:gap-5 lg:columns-3">
        {images.map((image, i) => (
          <Reveal key={image.src} delay={(i % 3) * 0.08} className="mb-3 break-inside-avoid sm:mb-5">
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`${t.gallery.open}: ${l(image.alt)}`}
              className="focus-ring group relative block w-full overflow-hidden bg-ivory/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={l(image.alt)}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="h-auto w-full transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05]"
              />
              <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/20" />
              <span className="pointer-events-none absolute inset-2 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40" />
              {arePlaceholders ? (
                <span className="pointer-events-none absolute bottom-2 left-2 bg-ink/70 px-2 py-1 text-[0.55rem] uppercase tracking-wide2 text-mist">
                  {t.gallery.placeholder}
                </span>
              ) : null}
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null ? <Lightbox key="lightbox" index={openIndex} onIndex={setOpenIndex} onClose={close} /> : null}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({ index, onIndex, onClose }: { index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const { t, l } = useLang();
  const { images, arePlaceholders } = weddingConfig.gallery;
  const total = images.length;
  const image = images[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (step: number) => {
      setDirection(step);
      onIndex((index + step + total) % total);
    },
    [index, total, onIndex],
  );

  // keyboard: Esc closes, arrows navigate, Tab stays inside the dialog
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [go, onClose]);

  if (!image) return null;

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery.viewer}
      className="fixed inset-0 z-[55] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={onClose}
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <p className="font-sans text-xs tracking-wide2 text-mist" aria-live="polite">
          {fill(t.gallery.counter, { n: index + 1, total })}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t.gallery.close} className="focus-ring flex h-12 w-12 items-center justify-center text-ivory/80 hover:text-ivory">
          <CloseIcon width={26} height={26} />
        </button>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.figure
          key={image.src}
          custom={direction}
          className="relative flex max-h-[82svh] max-w-[92vw] items-center justify-center"
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 60 }),
            center: { opacity: 1, x: 0 },
            leave: (d: number) => ({ opacity: 0, x: d * -60 }),
          }}
          initial="enter"
          animate="center"
          exit="leave"
          transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) go(1);
            else if (info.offset.x > 70) go(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={l(image.alt)}
            width={image.width}
            height={image.height}
            draggable={false}
            className="max-h-[82svh] w-auto max-w-[92vw] select-none object-contain"
          />
          {arePlaceholders ? (
            <figcaption className="absolute bottom-3 left-3 bg-ink/70 px-2 py-1 text-[0.6rem] uppercase tracking-wide2 text-mist">
              {t.gallery.placeholder}
            </figcaption>
          ) : null}
        </motion.figure>
      </AnimatePresence>

      <div onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={t.gallery.prev}
          className="focus-ring absolute left-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ivory/70 hover:text-gold-soft sm:left-6"
        >
          <ChevronLeftIcon width={30} height={30} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={t.gallery.next}
          className="focus-ring absolute right-1 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ivory/70 hover:text-gold-soft sm:right-6"
        >
          <ChevronRightIcon width={30} height={30} />
        </button>
      </div>
    </motion.div>
  );
}
