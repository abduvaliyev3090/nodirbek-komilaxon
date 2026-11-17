"use client";

import type { ComponentType, SVGProps } from "react";
import { weddingConfig } from "@wedding";
import { fill } from "@/i18n/translations";
import { useLang } from "@/lib/language";
import { formatLongDate, formatTime, formatWeekday } from "@/lib/dates";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CalendarIcon, ClockIcon, MapIcon, PinIcon, RouteIcon } from "@/components/ui/icons";

/** Text wrapped in [ square brackets ] is treated as an editable placeholder and styled quietly. */
const isPlaceholder = (text: string) => /^\s*\[.*\]\s*$/.test(text);

function Detail({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  sub?: string | null;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="relative border border-gold/20 bg-ivory/[0.02] p-7 text-center sm:p-9">
      <Icon className="mx-auto h-6 w-6 text-gold" />
      <h3 className="eyebrow mt-5">{label}</h3>
      <p className={`mt-4 font-serif text-2xl font-light leading-snug sm:text-[1.7rem] ${isPlaceholder(value) ? "is-placeholder" : ""}`}>{value}</p>
      {sub ? <p className="mt-2 font-serif text-lg italic text-ivory/60">{sub}</p> : null}
    </Reveal>
  );
}

export function EventDetails() {
  const { t, l, lang } = useLang();
  const { event, couple } = weddingConfig;

  const date = formatLongDate(event.dateTime, event.timeZone, lang) ?? "—";
  const weekday = formatWeekday(event.dateTime, event.timeZone, lang);
  const time = formatTime(event.dateTime, event.timeZone) ?? "—";
  const venue = l(event.venue.name);
  const address = l(event.venue.address);

  const addToCalendar = () => {
    const startMs = Date.parse(event.dateTime);
    if (Number.isNaN(startMs)) return;
    const names = `${couple.first} & ${couple.second}`;
    downloadIcs(
      "wedding-invitation.ics",
      buildIcs({
        title: fill(t.details.calendarTitle, { names }),
        startMs,
        durationHours: event.durationHours,
        location: `${venue}, ${address}`,
        url: event.mapUrl || undefined,
      }),
    );
  };

  return (
    <section id="details" className="px-4 py-28 sm:px-8 sm:py-36" aria-labelledby="details-title">
      <SectionHeading index={4} id="details-title" title={t.details.title} />

      <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 sm:gap-6">
        <Detail icon={CalendarIcon} label={t.details.date} value={date} sub={weekday} delay={0} />
        <Detail icon={ClockIcon} label={t.details.time} value={time} delay={0.08} />
        <Detail icon={PinIcon} label={t.details.venue} value={venue} delay={0.16} />
        <Detail icon={MapIcon} label={t.details.address} value={address} delay={0.24} />
      </div>

      <Reveal className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
        {event.mapUrl ? (
          <a href={event.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-gold">
            {t.details.directions}
            <RouteIcon className="h-4 w-4" />
          </a>
        ) : null}
        <button type="button" onClick={addToCalendar} className="btn-quiet">
          <CalendarIcon className="h-4 w-4" />
          {t.details.calendar}
        </button>
      </Reveal>
    </section>
  );
}
