"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/Icons";
import { RESTAURANT } from "@/content/site";
import { isEmail } from "@/content/reservations";
import { cn } from "@/lib/cn";

const WORD = ["K", "H", "A", "A", "N", "A"];

export function Footer({ year }: { year: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo, reserve, openDialog } = useSite();

  useSectionChoreography(ref, {
    exit: false,
    start: "top 85%",
    setup: ({ section, q, reduced }) => {
      if (reduced) return;
      gsap.fromTo(
        q("[data-footer-letter]"),
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 1.5,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        },
      );
    },
  });

  const links = [
    { label: "Contact", href: `mailto:${RESTAURANT.email}` },
    { label: "Location", href: "#location", scroll: true },
    { label: "Reservations", href: "#reserve", reserve: true },
  ];

  return (
    <footer ref={ref} id="contact" aria-label="Footer" className="relative overflow-hidden bg-ink hairline-top pt-20 lg:pt-[4.2vw]">
      <div className="mx-auto max-w-[1760px] px-[var(--pad)]">
        <div className="grid grid-cols-12 items-start gap-x-6">
          <p data-anim="meta" className="col-span-12 hidden font-serif text-[1.15rem] font-medium tracking-[0.5em] text-ivory lg:col-span-2 lg:block">
            KHAANA
          </p>

          <div className="col-span-12 flex justify-center lg:col-span-6 lg:col-start-4">
            <p aria-hidden="true" className="flex overflow-hidden font-serif text-[19.5vw] font-medium leading-[0.86] tracking-[0.02em] lg:text-[10.2vw]">
              {WORD.map((letter, i) => (
                <span
                  key={i}
                  data-footer-letter=""
                  className="block bg-[linear-gradient(180deg,#b38e60_0%,#8a6844_45%,#4f3824_100%)] bg-clip-text text-transparent"
                >
                  {letter}
                </span>
              ))}
            </p>
            <span className="sr-only">Khaana</span>
          </div>

          <div className="col-span-12 mt-14 lg:col-span-3 lg:col-start-10 lg:mt-[0.6vw]" data-anim="text">
            <Newsletter />
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-x-8 gap-y-8 border-t border-ivory/[0.07] pt-8 lg:mt-[4.6vw]">
          <nav aria-label="Footer" data-anim="text">
            <ul className="flex flex-wrap items-center gap-y-3 text-ivory/70">
              <li className="flex items-center pr-6">
                <a
                  href={RESTAURANT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 meta transition-colors hover:text-ivory"
                >
                  <InstagramIcon />
                  Instagram
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              {links.map((link) => (
                <li key={link.label} className="flex items-center border-l border-ivory/15 px-6">
                  <a
                    href={link.href}
                    onClick={(event) => {
                      if (link.reserve) {
                        event.preventDefault();
                        reserve();
                      } else if (link.scroll) {
                        event.preventDefault();
                        scrollTo(link.href);
                      }
                    }}
                    className="meta transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div data-anim="text">
            <Button variant="pill" onClick={() => reserve()}>
              Reserve
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pb-10 text-ivory/40">
          <p className="meta">© {year} Khaana. All rights reserved.</p>
          <p className="meta hidden md:block">
            <a href={RESTAURANT.phoneHref} className="transition-colors hover:text-ivory">
              {RESTAURANT.phone}
            </a>
            <span className="px-3" aria-hidden="true">
              ·
            </span>
            <a href={`mailto:${RESTAURANT.email}`} className="transition-colors hover:text-ivory">
              {RESTAURANT.email}
            </a>
          </p>
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => openDialog("privacy")} className="meta transition-colors hover:text-ivory">
              Privacy
            </button>
            <button type="button" onClick={() => openDialog("terms")} className="meta transition-colors hover:text-ivory">
              Terms
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
}

function Newsletter() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    let serverError = "Something went wrong. Please try again.";
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        if (data.error) serverError = data.error;
        throw new Error("Subscription failed");
      }
      setStatus("done");
      setMessage("Thank you — the season's first menu will find you.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(serverError);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby={`${id}-intro`}>
      <p className="eyebrow text-ivory/85">Stay close to the table</p>
      <p id={`${id}-intro`} className="mt-4 text-[0.78rem] leading-relaxed text-ivory/55">
        Be the first to know about seasonal menus, events and special experiences.
      </p>
      <div
        className={cn(
          "mt-6 flex items-center gap-3 border-b transition-colors duration-500",
          status === "error" ? "border-danger/70" : "border-ivory/25 focus-within:border-ivory/60",
        )}
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === "error") setStatus("idle");
          }}
          aria-invalid={status === "error" || undefined}
          aria-describedby={message ? `${id}-status` : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-[0.82rem] text-ivory outline-none placeholder:text-ivory/35"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="group grid h-10 w-10 shrink-0 place-items-center text-ivory/80 transition-colors hover:text-ivory disabled:opacity-40"
        >
          <ArrowIcon className="w-6" />
        </button>
      </div>
      <p
        id={`${id}-status`}
        role="status"
        aria-live="polite"
        className={cn("mt-3 min-h-[1.2rem] text-[0.72rem]", status === "error" ? "text-danger" : "text-gold-soft")}
      >
        {message}
      </p>
    </form>
  );
}
