"use client";

import Image from "next/image";
import { useEffect, useId, useState, type FormEvent } from "react";
import { Dialog, DialogClose } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { IMAGES, PRIVATE_SPACES, RESTAURANT } from "@/content/site";
import { isEmail, OCCASIONS, toISODate } from "@/content/reservations";
import { cn } from "@/lib/cn";

type Errors = Partial<Record<"name" | "email" | "guests" | "eventDate" | "message", string>>;

export function PrivateDiningDialog({ onClose }: { onClose: () => void }) {
  const uid = useId();
  const [space, setSpace] = useState(PRIVATE_SPACES[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("16");
  const [occasion, setOccasion] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [today, setToday] = useState("");

  useEffect(() => setToday(toISODate(new Date())), []);

  const validate = (): Errors => {
    const next: Errors = {};
    const count = Number(guests);
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (!isEmail(email)) next.email = "Please enter a valid email address.";
    if (!Number.isInteger(count) || count < 2 || count > 200) next.guests = "Please enter between 2 and 200 guests.";
    if (eventDate && today && eventDate < today) next.eventDate = "Please choose a future date.";
    if (message.length > 1000) next.message = "Please keep your message under 1000 characters.";
    return next;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const errs = validate();
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          eventDate: eventDate || null,
          guests: Number(guests),
          space: PRIVATE_SPACES.find((item) => item.id === space)?.name ?? null,
          occasion: occasion || null,
          message: message.trim() || null,
        }),
      });
      if (!response.ok) throw new Error("Enquiry failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border-b border-ivory/20 bg-transparent py-2.5 text-[0.9rem] text-ivory outline-none transition-colors placeholder:text-ivory/30 focus:border-ivory/60 [color-scheme:dark]";

  const errorText = (key: keyof Errors) =>
    errors[key] ? (
      <p id={`${uid}-${key}-error`} role="alert" className="mt-2 text-[0.7rem] text-danger">
        {errors[key]}
      </p>
    ) : null;

  return (
    <Dialog labelledBy={`${uid}-title`} onClose={onClose} variant="full">
      {(close) => (
        <div className="grid min-h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative hidden lg:block">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              <Image src={IMAGES.privateDining.src} alt={IMAGES.privateDining.alt} fill sizes="42vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
              <div className="absolute bottom-[8%] left-[12%] right-[10%]" data-dialog-item="">
                <p className="eyebrow text-ivory/70">Private Dining &amp; Events</p>
                <p className="mt-5 font-serif text-[3.2vw] font-medium uppercase leading-[0.95] text-ivory">
                  Made for
                  <br />
                  Gatherings
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-[var(--pad)] pb-16 pt-5 lg:px-[5vw] lg:pt-10">
            <div className="flex h-12 items-center justify-between" data-dialog-item="">
              <p className="font-serif text-[1.2rem] font-medium tracking-[0.5em] text-ivory">KHAANA</p>
              <DialogClose onClick={close} />
            </div>
            <h2 id={`${uid}-title`} data-dialog-item="" className="display-m mt-10 text-ivory lg:mt-14">
              Our Spaces
            </h2>
            <p data-dialog-item="" className="body-copy mt-5 max-w-[34rem]">
              From a candlelit table for twelve to the entire house — tell us about your occasion and our events team
              will respond within one working day.
            </p>

            <fieldset className="mt-10" data-dialog-item="">
              <legend className="meta text-ivory/55">Choose a space</legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {PRIVATE_SPACES.map((item) => {
                  const checked = space === item.id;
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "group relative flex cursor-pointer flex-col border p-3 transition-colors duration-500",
                        checked ? "border-gold-soft/70 bg-ivory/[0.03]" : "border-ivory/10 hover:border-ivory/30",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${uid}-space`}
                        value={item.id}
                        checked={checked}
                        onChange={() => setSpace(item.id)}
                        className="sr-only"
                      />
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <Image
                          src={item.image.src}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 18vw, 90vw"
                          className="object-cover transition-[scale] duration-1000 ease-luxe group-hover:scale-105"
                        />
                      </span>
                      <span className="mt-3 font-serif text-[1.15rem] font-medium leading-tight text-ivory">{item.name}</span>
                      <span className="meta mt-1 text-gold-soft">{item.capacity}</span>
                      <span className="mt-2 text-[0.74rem] leading-relaxed text-ivory/55">{item.description}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {status === "sent" ? (
              <div role="status" className="mt-12 border-t border-ivory/10 pt-10">
                <p className="eyebrow text-gold-soft">Enquiry received</p>
                <p className="mt-5 font-serif text-[2rem] font-medium leading-tight text-ivory">
                  Thank you, {name.trim().split(" ")[0]}.
                </p>
                <p className="body-copy mt-3 max-w-[30rem]">
                  Our events team will be in touch at {email.trim()} within one working day. For anything urgent, call{" "}
                  <a href={RESTAURANT.phoneHref} className="text-ivory underline decoration-ivory/30 underline-offset-4">
                    {RESTAURANT.phone}
                  </a>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-12 grid gap-x-8 gap-y-7 border-t border-ivory/10 pt-10 sm:grid-cols-2" data-dialog-item="">
                <div>
                  <label htmlFor={`${uid}-name`} className="meta text-ivory/55">Full name</label>
                  <input
                    id={`${uid}-name`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                    className={inputClass}
                  />
                  {errorText("name")}
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className="meta text-ivory/55">Email</label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    aria-invalid={!!errors.email || undefined}
                    aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                    className={inputClass}
                  />
                  {errorText("email")}
                </div>
                <div>
                  <label htmlFor={`${uid}-phone`} className="meta text-ivory/55">Phone (optional)</label>
                  <input
                    id={`${uid}-phone`}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${uid}-eventDate`} className="meta text-ivory/55">Preferred date</label>
                  <input
                    id={`${uid}-eventDate`}
                    type="date"
                    min={today || undefined}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    aria-invalid={!!errors.eventDate || undefined}
                    aria-describedby={errors.eventDate ? `${uid}-eventDate-error` : undefined}
                    className={inputClass}
                  />
                  {errorText("eventDate")}
                </div>
                <div>
                  <label htmlFor={`${uid}-guests`} className="meta text-ivory/55">Guests</label>
                  <input
                    id={`${uid}-guests`}
                    type="number"
                    inputMode="numeric"
                    min={2}
                    max={200}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    aria-invalid={!!errors.guests || undefined}
                    aria-describedby={errors.guests ? `${uid}-guests-error` : undefined}
                    className={inputClass}
                  />
                  {errorText("guests")}
                </div>
                <div>
                  <label htmlFor={`${uid}-occasion`} className="meta text-ivory/55">Occasion</label>
                  <select
                    id={`${uid}-occasion`}
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className={cn(inputClass, "cursor-pointer appearance-none")}
                  >
                    <option value="">Select</option>
                    {OCCASIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${uid}-message`} className="meta text-ivory/55">Tell us about the evening</label>
                  <textarea
                    id={`${uid}-message`}
                    rows={3}
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    aria-invalid={!!errors.message || undefined}
                    aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                    className={cn(inputClass, "resize-none")}
                  />
                  {errorText("message")}
                </div>
                {status === "error" ? (
                  <p role="alert" className="text-[0.78rem] text-danger sm:col-span-2">
                    We couldn&rsquo;t send your enquiry. Please try again or call {RESTAURANT.phone}.
                  </p>
                ) : null}
                <div className="sm:col-span-2">
                  <Button variant="solid" type="submit" arrow disabled={status === "sending"} aria-busy={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
