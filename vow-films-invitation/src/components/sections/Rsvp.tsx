"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { weddingConfig } from "@wedding";
import { fill } from "@/i18n/translations";
import { useLang } from "@/lib/language";
import { validateRsvp, NAME_MAX, type Attendance, type RsvpErrorKey, type RsvpField } from "@/lib/rsvp";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success";
type Errors = Partial<Record<RsvpField, RsvpErrorKey>>;
type ServerError = "network" | "rateLimited" | "unavailable" | "generic" | null;

export function Rsvp() {
  const { t } = useLang();
  const max = weddingConfig.rsvp.maxGuests;

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attendance | "">("");
  const [guests, setGuests] = useState(1);
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<ServerError>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [submittedAttending, setSubmittedAttending] = useState<Attendance>("yes");

  const nameRef = useRef<HTMLInputElement>(null);
  const attendanceRef = useRef<HTMLFieldSetElement>(null);

  const message = (key: RsvpErrorKey) => fill(t.rsvp.errors[key], { max });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError(null);

    const result = validateRsvp({ name, attending, guests }, max);
    if (!result.ok) {
      setErrors(result.errors);
      // move focus to the first problem for keyboard and screen-reader users
      if (result.errors.name) nameRef.current?.focus();
      else attendanceRef.current?.querySelector<HTMLInputElement>("input")?.focus();
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.value, lang: document.documentElement.lang, company }),
      });
      if (res.ok) {
        setSubmittedAttending(result.value.attending);
        setStatus("success");
        return;
      }
      setStatus("idle");
      if (res.status === 429) setServerError("rateLimited");
      else if (res.status === 503 || res.status === 502) setServerError("unavailable");
      else if (res.status === 422) {
        const data = (await res.json().catch(() => null)) as { fields?: Errors } | null;
        if (data?.fields) setErrors(data.fields);
        else setServerError("generic");
      } else setServerError("generic");
    } catch {
      setStatus("idle");
      setServerError("network");
    }
  };

  const nameId = "rsvp-name";
  const nameErrId = "rsvp-name-error";
  const attErrId = "rsvp-attendance-error";

  return (
    <section id="rsvp" className="relative px-4 py-28 sm:px-8 sm:py-40" aria-labelledby="rsvp-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(var(--c-gold)/0.06),transparent_60%)]" aria-hidden="true" />
      <SectionHeading index={5} id="rsvp-title" title={t.rsvp.title} lead={t.rsvp.lead} />

      <Reveal className="relative mx-auto mt-16 max-w-xl">
        <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <motion.div
              key="success"
              role="status"
              className="border border-gold/30 px-8 py-14 text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 text-gold">
                <CheckIcon className="h-6 w-6" />
              </span>
              <h3 className="display mt-7 text-4xl">{t.rsvp.successTitle}</h3>
              <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-ivory/75">
                {submittedAttending === "yes" ? t.rsvp.successYes : t.rsvp.successNo}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              noValidate
              className="space-y-12"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* name */}
              <div>
                <label htmlFor={nameId} className="eyebrow block">
                  {t.rsvp.name}
                </label>
                <input
                  ref={nameRef}
                  id={nameId}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={NAME_MAX + 20}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  placeholder={t.rsvp.namePlaceholder}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? nameErrId : undefined}
                  className="field mt-2"
                />
                {errors.name ? (
                  <p id={nameErrId} role="alert" className="mt-2 text-sm text-[#e8a090]">
                    {message(errors.name)}
                  </p>
                ) : null}
              </div>

              {/* attendance */}
              <fieldset ref={attendanceRef} aria-describedby={errors.attending ? attErrId : undefined}>
                <legend className="eyebrow">{t.rsvp.attendance}</legend>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["yes", t.rsvp.yes],
                      ["no", t.rsvp.no],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className={`relative flex min-h-14 cursor-pointer items-center justify-center border px-4 py-3 text-center font-serif text-lg leading-snug transition-colors duration-500 focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-gold ${
                        attending === value ? "border-gold bg-gold/10 text-gold-soft" : "border-ivory/20 text-ivory/75 hover:border-gold/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={value}
                        checked={attending === value}
                        onChange={() => {
                          setAttending(value);
                          if (errors.attending) setErrors((p) => ({ ...p, attending: undefined }));
                        }}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {errors.attending ? (
                  <p id={attErrId} role="alert" className="mt-2 text-sm text-[#e8a090]">
                    {message(errors.attending)}
                  </p>
                ) : null}
              </fieldset>

              {/* guests (only when attending) */}
              <AnimatePresence initial={false}>
                {attending === "yes" ? (
                  <motion.div
                    key="guests"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-hidden"
                  >
                    <div className="px-1 py-1">
                      <p id="guests-label" className="eyebrow">
                        {t.rsvp.guests}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-8" role="group" aria-labelledby="guests-label">
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          disabled={guests <= 1}
                          aria-label={t.rsvp.guestsDecrease}
                          className="focus-ring flex h-12 w-12 items-center justify-center border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold"
                        >
                          <MinusIcon />
                        </button>
                        <output aria-live="polite" className="w-12 text-center font-serif text-5xl font-light tabular-nums">
                          {guests}
                        </output>
                        <button
                          type="button"
                          onClick={() => setGuests((g) => Math.min(max, g + 1))}
                          disabled={guests >= max}
                          aria-label={t.rsvp.guestsIncrease}
                          className="focus-ring flex h-12 w-12 items-center justify-center border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gold"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                      {errors.guests ? (
                        <p role="alert" className="mt-3 text-center text-sm text-[#e8a090]">
                          {message(errors.guests)}
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* honeypot — invisible to people, tempting to bots */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Company
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
              </div>

              <div aria-live="polite">
                {serverError ? (
                  <p role="alert" className="border border-[#e8a090]/40 px-4 py-3 text-center text-sm text-[#e8a090]">
                    {t.rsvp.errors[serverError]}
                  </p>
                ) : null}
              </div>

              <div className="text-center">
                <button type="submit" disabled={status === "submitting"} className="btn-gold w-full sm:w-auto sm:min-w-[16rem]" aria-busy={status === "submitting"}>
                  {status === "submitting" ? (
                    <>
                      <span className="block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" aria-hidden="true" />
                      {t.rsvp.submitting}
                    </>
                  ) : (
                    t.rsvp.submit
                  )}
                </button>
                <p className="mt-6 text-xs leading-relaxed text-mist/80">{t.rsvp.privacy}</p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
