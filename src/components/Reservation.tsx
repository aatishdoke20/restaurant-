"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink, Button } from "@/components/ui/Button";
import { DatePicker } from "@/components/ui/DatePicker";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { IMAGES, RESTAURANT } from "@/content/site";
import {
  addDays,
  EXPERIENCES,
  formatLongDate,
  formatShortDate,
  formatTime,
  fromISO,
  isEmail,
  isPhone,
  MAX_ONLINE_GUESTS,
  OCCASIONS,
  RESERVATION_WINDOW_DAYS,
  TIME_SLOTS,
  toISODate,
  toMinutes,
} from "@/content/reservations";
import { cn } from "@/lib/cn";

export function Reservation() {
  const ref = useRef<HTMLElement>(null);
  useSectionChoreography(ref);

  return (
    <section
      ref={ref}
      id="reserve"
      data-nav="reserve"
      aria-labelledby="reserve-title"
      className="relative overflow-x-clip bg-ink-2 hairline-top py-24 lg:py-[5.4vw]"
    >
      <div aria-hidden="true" data-anim="bg" className="pointer-events-none absolute inset-y-0 left-0 w-[46%] lg:w-[17%]">
        <Image src={IMAGES.stone.src} alt="" fill sizes="(min-width: 1024px) 17vw, 46vw" className="object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink-2/55 to-ink-2" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink-2 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink-2 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-[1760px] grid-cols-12 gap-x-6 px-[var(--pad)]">
        <div className="relative z-10 col-span-12 lg:col-span-4 lg:col-start-2 lg:pl-[0.6vw]" data-exit="">
          <SectionLabel>Reservation</SectionLabel>
          <RevealText id="reserve-title" lines={["Your Table", "Awaits."]} className="display-l mt-6 text-ivory lg:mt-7" />
          <p data-anim="text" className="body-copy mt-6 max-w-[21rem]">
            Reserve online for up to {MAX_ONLINE_GUESTS} guests. For larger celebrations, our private dining team will
            craft the evening with you.
          </p>
        </div>
        <div className="relative z-30 col-span-12 mt-14 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:self-center" data-anim="text">
          <ReservationForm />
        </div>
      </div>

    </section>
  );
}

/* ---------------------------------------------------------------- */

type Step = "select" | "details" | "confirmed";
type FieldKey = "date" | "time" | "guests" | "name" | "phone" | "email" | "notes";
type Errors = Partial<Record<FieldKey, string>>;
type Confirmation = {
  reference: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  experience: string;
};

const DEFAULT_EXPERIENCE = EXPERIENCES[0];

function ReservationForm() {
  const { prefill, openDialog } = useSite();
  const uid = useId();
  const ids = {
    date: `${uid}-date`,
    time: `${uid}-time`,
    guests: `${uid}-guests`,
    name: `${uid}-name`,
    phone: `${uid}-phone`,
    email: `${uid}-email`,
    occasion: `${uid}-occasion`,
    experience: `${uid}-experience`,
    notes: `${uid}-notes`,
  };
  const rootRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const [today, setToday] = useState<string | null>(null);
  const [nowMinutes, setNowMinutes] = useState(0);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [experience, setExperience] = useState<string>(DEFAULT_EXPERIENCE);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  // Dates are client-only (no hydration mismatch). Default: tomorrow.
  useEffect(() => {
    const now = new Date();
    setToday(toISODate(now));
    setNowMinutes(now.getHours() * 60 + now.getMinutes());
    setDate((prev) => prev ?? toISODate(addDays(now, 1)));
  }, []);

  // Prefill from "Discover the experience", "Reserve a tasting", etc.
  useEffect(() => {
    if (!prefill) return;
    if (prefill.experience) setExperience(prefill.experience);
    if (prefill.guests) setGuests(prefill.guests);
    setStep((current) => (current === "confirmed" ? "select" : current));
  }, [prefill]);

  const maxDate = today ? toISODate(addDays(fromISO(today), RESERVATION_WINDOW_DAYS)) : null;

  const slots = useMemo(() => {
    if (!date || date !== today) return TIME_SLOTS;
    return TIME_SLOTS.filter((slot) => toMinutes(slot.value) >= nowMinutes + 60);
  }, [date, today, nowMinutes]);

  useEffect(() => {
    if (slots.length && !slots.some((slot) => slot.value === time)) setTime(slots[0].value);
  }, [slots, time]);

  // Each step changes the height of the page: re-measure triggers and animate the new step in.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const root = rootRef.current;
    if (root && !prefersReducedMotion()) {
      gsap.fromTo(
        root.querySelectorAll("[data-step-item]"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" },
      );
    }
    if (step === "details") document.getElementById(ids.name)?.focus({ preventScroll: true });
    if (step === "confirmed") root?.querySelector<HTMLElement>("[data-confirm-heading]")?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const clearError = (key: FieldKey) => setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validateSelection = (): Errors => {
    const next: Errors = {};
    if (!date) next.date = "Please choose a date.";
    else if (today && date < today) next.date = "Please choose a future date.";
    else if (maxDate && date > maxDate) next.date = "We take bookings up to 90 days ahead.";
    if (!slots.some((slot) => slot.value === time)) {
      next.time = slots.length ? "Please choose an available time." : "No more seatings today — please pick another date.";
    }
    if (guests < 1) next.guests = "Please choose the number of guests.";
    else if (guests > MAX_ONLINE_GUESTS) next.guests = "For 13 or more guests, please enquire about private dining.";
    return next;
  };

  const validateDetails = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (!isPhone(phone)) next.phone = "Please enter a valid phone number.";
    if (!isEmail(email)) next.email = "Please enter a valid email address.";
    if (notes.length > 500) next.notes = "Please keep notes under 500 characters.";
    return next;
  };

  const focusFirstError = (errs: Errors) => {
    const order: FieldKey[] = ["date", "time", "guests", "name", "phone", "email", "notes"];
    const first = order.find((key) => errs[key]);
    if (first) requestAnimationFrame(() => document.getElementById(ids[first])?.focus());
  };

  const onReserve = (event: FormEvent) => {
    event.preventDefault();
    const errs = validateSelection();
    setErrors(errs);
    setFormError(null);
    if (Object.keys(errs).length) {
      focusFirstError(errs);
      return;
    }
    setStep("details");
  };

  const onConfirm = async (event: FormEvent) => {
    event.preventDefault();
    const selectionErrors = validateSelection();
    const errs = { ...selectionErrors, ...validateDetails() };
    setErrors(errs);
    if (Object.keys(errs).length) {
      if (Object.keys(selectionErrors).length) setStep("select");
      focusFirstError(errs);
      return;
    }
    if (!date) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
          guests,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          occasion: occasion || null,
          notes: notes.trim() || null,
          experience,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { reference?: string; error?: string; fields?: Errors };
      if (!response.ok || !data.reference) {
        if (data.fields) setErrors(data.fields);
        setFormError(data.error ?? "We couldn't confirm your table. Please try again.");
        return;
      }
      setConfirmation({ reference: data.reference, date, time, guests, name: name.trim(), email: email.trim(), experience });
      setStep("confirmed");
    } catch {
      setFormError(`We couldn't reach our reservations desk. Please call us on ${RESTAURANT.phone}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep("select");
    setConfirmation(null);
    setNotes("");
    setOccasion("");
    setExperience(DEFAULT_EXPERIENCE);
  };

  const lunch = slots.filter((slot) => slot.service === "lunch");
  const dinner = slots.filter((slot) => slot.service === "dinner");

  return (
    <div ref={rootRef}>
      {step === "select" ? (
        <form onSubmit={onReserve} noValidate aria-label="Find a table">
          {experience !== DEFAULT_EXPERIENCE ? (
            <p data-step-item="" className="mb-7 flex items-center gap-3 meta text-gold-soft">
              <span aria-hidden="true" className="h-px w-6 bg-gold-soft/60" />
              Experience · {experience}
              <button
                type="button"
                onClick={() => setExperience(DEFAULT_EXPERIENCE)}
                className="ml-1 grid h-6 w-6 place-items-center text-ivory/50 transition hover:text-ivory"
                aria-label={`Remove ${experience}`}
              >
                ×
              </button>
            </p>
          ) : null}
          <div className="grid grid-cols-2 items-end gap-x-6 gap-y-8 sm:grid-cols-[1.4fr_1fr_0.85fr_auto] sm:gap-x-8">
            <Field label="Date" htmlFor={ids.date} error={errors.date} className="col-span-2 sm:col-span-1">
              <DatePicker
                id={ids.date}
                value={date}
                min={today}
                max={maxDate}
                onChange={(value) => {
                  setDate(value);
                  clearError("date");
                }}
                invalid={!!errors.date}
                describedBy={errors.date ? `${ids.date}-error` : undefined}
              />
            </Field>
            <Field label="Time" htmlFor={ids.time} error={errors.time}>
              <SelectShell>
                <select
                  id={ids.time}
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    clearError("time");
                  }}
                  aria-invalid={!!errors.time || undefined}
                  aria-describedby={errors.time ? `${ids.time}-error` : undefined}
                  className={SELECT_CLASS}
                >
                  {!slots.length ? <option value={time}>No seatings left</option> : null}
                  {lunch.length ? (
                    <optgroup label="Lunch">
                      {lunch.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {dinner.length ? (
                    <optgroup label="Dinner">
                      {dinner.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
              </SelectShell>
            </Field>
            <Field label="Guests" htmlFor={ids.guests} error={errors.guests}>
              <SelectShell>
                <select
                  id={ids.guests}
                  value={guests}
                  onChange={(event) => {
                    setGuests(Number(event.target.value));
                    clearError("guests");
                  }}
                  aria-invalid={!!errors.guests || undefined}
                  aria-describedby={errors.guests ? `${ids.guests}-error` : undefined}
                  className={SELECT_CLASS}
                >
                  {Array.from({ length: MAX_ONLINE_GUESTS }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                  <option value={MAX_ONLINE_GUESTS + 1}>{MAX_ONLINE_GUESTS + 1}+</option>
                </select>
              </SelectShell>
            </Field>
            <div data-step-item="" className="col-span-2 sm:col-span-1 sm:pb-[2px]">
              <Button variant="pill" type="submit" className="h-10 w-full px-8 sm:w-auto">
                Reserve
              </Button>
            </div>
          </div>
          {guests > MAX_ONLINE_GUESTS ? (
            <p data-step-item="" className="mt-6 text-[0.78rem] leading-relaxed text-ivory/70">
              For parties of {MAX_ONLINE_GUESTS + 1} or more,{" "}
              <button
                type="button"
                onClick={() => openDialog("private-dining")}
                className="text-ivory underline decoration-ivory/40 underline-offset-4 transition hover:decoration-ivory"
              >
                enquire about private dining
              </button>
              .
            </p>
          ) : (
            <p data-step-item="" className="mt-6 text-[0.72rem] text-ivory/40">
              Lunch 12pm — 3pm · Dinner 6pm — 11pm · Last seating 10pm
            </p>
          )}
        </form>
      ) : null}

      {step === "details" && date ? (
        <form onSubmit={onConfirm} noValidate aria-label="Your details">
          <div data-step-item="" className="flex flex-wrap items-center justify-between gap-4 border-b border-ivory/10 pb-5">
            <p className="meta text-ivory/85">
              {formatShortDate(date)} · {formatTime(time)} · {guests} {guests === 1 ? "guest" : "guests"}
            </p>
            <button
              type="button"
              onClick={() => setStep("select")}
              className="meta text-ivory/55 underline-offset-4 transition hover:text-ivory hover:underline"
            >
              Edit
            </button>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            <Field label="Full name" htmlFor={ids.name} error={errors.name}>
              <input
                id={ids.name}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
                aria-invalid={!!errors.name || undefined}
                aria-describedby={errors.name ? `${ids.name}-error` : undefined}
                className={INPUT_CLASS}
                required
              />
            </Field>
            <Field label="Phone" htmlFor={ids.phone} error={errors.phone}>
              <input
                id={ids.phone}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+91"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  clearError("phone");
                }}
                aria-invalid={!!errors.phone || undefined}
                aria-describedby={errors.phone ? `${ids.phone}-error` : undefined}
                className={INPUT_CLASS}
                required
              />
            </Field>
            <Field label="Email" htmlFor={ids.email} error={errors.email} className="sm:col-span-2">
              <input
                id={ids.email}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError("email");
                }}
                aria-invalid={!!errors.email || undefined}
                aria-describedby={errors.email ? `${ids.email}-error` : undefined}
                className={INPUT_CLASS}
                required
              />
            </Field>
            <Field label="Occasion (optional)" htmlFor={ids.occasion}>
              <SelectShell>
                <select id={ids.occasion} value={occasion} onChange={(event) => setOccasion(event.target.value)} className={SELECT_CLASS}>
                  <option value="">None</option>
                  {OCCASIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </Field>
            <Field label="Experience" htmlFor={ids.experience}>
              <SelectShell>
                <select
                  id={ids.experience}
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  className={SELECT_CLASS}
                >
                  {EXPERIENCES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </SelectShell>
            </Field>
            <Field label="Notes (optional)" htmlFor={ids.notes} error={errors.notes} className="sm:col-span-2">
              <textarea
                id={ids.notes}
                rows={2}
                maxLength={500}
                value={notes}
                onChange={(event) => {
                  setNotes(event.target.value);
                  clearError("notes");
                }}
                placeholder="Allergies, preferences, a surprise we should know about…"
                className={cn(INPUT_CLASS, "resize-none")}
              />
            </Field>
          </div>
          {formError ? (
            <p role="alert" className="mt-6 text-[0.78rem] leading-relaxed text-danger">
              {formError}
            </p>
          ) : null}
          <div data-step-item="" className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Button variant="solid" type="submit" disabled={submitting} arrow aria-busy={submitting}>
              {submitting ? "Confirming…" : "Confirm reservation"}
            </Button>
            <p className="text-[0.72rem] text-ivory/45">Tables are held for 15 minutes.</p>
          </div>
        </form>
      ) : null}

      {step === "confirmed" && confirmation ? (
        <div role="status" aria-live="polite" className="relative">
          <div className="flex items-start justify-between gap-8">
            <div>
              <p data-step-item="" className="flex items-center gap-4 eyebrow text-gold-soft">
                <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full border border-gold-soft/60 text-[0.8rem]">
                  ✓
                </span>
                Reservation confirmed
              </p>
              <h3
                data-step-item=""
                data-confirm-heading=""
                tabIndex={-1}
                className="mt-6 font-serif text-[2.2rem] font-medium leading-none text-ivory outline-none lg:text-[2.7rem]"
              >
                Thank you, {confirmation.name.split(" ")[0]}.
              </h3>
              <p data-step-item="" className="body-copy mt-4 max-w-[30rem]">
                Your table for {confirmation.guests} on {formatLongDate(confirmation.date)} at {formatTime(confirmation.time)} is
                confirmed{confirmation.experience !== DEFAULT_EXPERIENCE ? ` for the ${confirmation.experience}` : ""}. We&rsquo;ll
                send the details to {confirmation.email}.
              </p>
            </div>
            <div data-step-item="" className="relative hidden aspect-[3/4] w-24 shrink-0 overflow-hidden ring-1 ring-ivory/10 xl:block">
              <Image src={IMAGES.reservedTable.src} alt={IMAGES.reservedTable.alt} fill sizes="96px" className="object-cover" />
            </div>
          </div>
          <dl data-step-item="" className="mt-8 grid grid-cols-3 gap-6 border-y border-ivory/10 py-5">
            <div>
              <dt className="meta text-ivory/45">Reference</dt>
              <dd className="mt-2 font-serif text-[1.25rem] tracking-[0.06em] text-ivory">{confirmation.reference}</dd>
            </div>
            <div>
              <dt className="meta text-ivory/45">Date</dt>
              <dd className="mt-2 text-[0.85rem] text-ivory/90">{formatShortDate(confirmation.date)}</dd>
            </div>
            <div>
              <dt className="meta text-ivory/45">Time</dt>
              <dd className="mt-2 text-[0.85rem] text-ivory/90">{formatTime(confirmation.time)}</dd>
            </div>
          </dl>
          <div data-step-item="" className="mt-8 flex flex-wrap gap-x-9 gap-y-4">
            <ArrowLink onClick={() => downloadCalendar(confirmation)}>Add to calendar</ArrowLink>
            <ArrowLink onClick={reset}>New reservation</ArrowLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}

const SELECT_CLASS =
  "w-full cursor-pointer appearance-none truncate bg-transparent py-2 pr-6 text-[0.88rem] text-ivory outline-none [color-scheme:dark]";
const INPUT_CLASS =
  "w-full bg-transparent py-2 text-[0.9rem] text-ivory outline-none placeholder:text-ivory/30 [color-scheme:dark]";

function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDownIcon className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ivory/50" />
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div data-step-item="" className={cn("flex min-w-0 flex-col", className)}>
      <label htmlFor={htmlFor} className="meta text-ivory/55">
        {label}
      </label>
      <div
        className={cn(
          "mt-2 border-b transition-colors duration-500",
          error ? "border-danger/80" : "border-ivory/20 focus-within:border-ivory/60 hover:border-ivory/40",
        )}
      >
        {children}
      </div>
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-[0.7rem] leading-snug text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function downloadCalendar(confirmation: Confirmation) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = confirmation.date.replace(/-/g, "");
  const startMinutes = toMinutes(confirmation.time);
  const endMinutes = Math.min(startMinutes + 120, 23 * 60 + 59);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escape = (value: string) => value.replace(/[,;]/g, (match) => `\\${match}`);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Khaana//Reservations//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${confirmation.reference}@khaana.in`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Kolkata:${day}T${pad(Math.floor(startMinutes / 60))}${pad(startMinutes % 60)}00`,
    `DTEND;TZID=Asia/Kolkata:${day}T${pad(Math.floor(endMinutes / 60))}${pad(endMinutes % 60)}00`,
    `SUMMARY:${escape(`Table at Khaana — ${confirmation.guests} guests`)}`,
    `LOCATION:${escape(RESTAURANT.addressLines.join(", "))}`,
    `DESCRIPTION:${escape(`Reservation ${confirmation.reference}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `khaana-${confirmation.reference}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
