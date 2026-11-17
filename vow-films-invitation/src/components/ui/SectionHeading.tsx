"use client";

import { useLang } from "@/lib/language";
import { Ornament } from "./Ornament";
import { Reveal } from "./Reveal";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

/** "CHAPTER II" + title + optional lead — gives every section the feel of a film chapter card. */
export function SectionHeading({
  index,
  title,
  lead,
  id,
}: {
  index: number;
  title: string;
  lead?: string;
  id?: string;
}) {
  const { t } = useLang();
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">
        {t.common.chapter} {ROMAN[index - 1] ?? index}
      </p>
      <h2 id={id} className="display mt-5 text-[clamp(2.4rem,8vw,4.5rem)]">
        {title}
      </h2>
      <Ornament className="mt-7" />
      {lead ? <p className="mt-7 font-serif text-xl italic leading-relaxed text-ivory/75 sm:text-2xl">{lead}</p> : null}
    </Reveal>
  );
}
