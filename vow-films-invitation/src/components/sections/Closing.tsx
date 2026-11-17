"use client";

import { weddingConfig } from "@wedding";
import { useLang } from "@/lib/language";
import { Ornament } from "@/components/ui/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpIcon } from "@/components/ui/icons";

export function Closing() {
  const { t, l } = useLang();
  const { closing, brand, gallery } = weddingConfig;
  const backdrop = gallery.images[gallery.images.length - 1]?.src ?? weddingConfig.hero.image;

  return (
    <footer className="relative isolate overflow-hidden px-6 pb-12 pt-36 text-center sm:pt-52" aria-labelledby="closing-title">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={backdrop} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      </div>

      <div className="mx-auto max-w-2xl">
        <Reveal>
          <Ornament />
          <h2 id="closing-title" className="display mt-10 text-[clamp(2.6rem,9vw,5rem)]">
            {t.closing.title}
          </h2>
          <p className="mt-10 font-serif text-2xl font-light italic leading-relaxed text-ivory/80 sm:text-[1.7rem]">{l(closing.message)}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <p className="eyebrow">{t.closing.regards}</p>
          <p className="mt-4 font-serif text-3xl italic text-gold-soft sm:text-4xl">{closing.signature}</p>
        </Reveal>
      </div>

      <div className="mx-auto mt-28 flex max-w-4xl flex-col items-center gap-8 border-t border-ivory/10 pt-10">
        <a href="#content" className="btn-quiet" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <ArrowUpIcon className="h-4 w-4" />
          {t.closing.backToTop}
        </a>
        <div>
          <p className="font-sans text-[0.68rem] uppercase tracking-cine text-ivory/70">{brand.name}</p>
          <p className="mt-2 text-[0.62rem] uppercase tracking-wide2 text-mist/70">
            {brand.collection} · {l(brand.tagline)}
          </p>
          <p className="mt-2 text-[0.62rem] tracking-wide2 text-mist/50">{t.footer.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
