"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { Dialog, DialogClose } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { formatINR, FULL_MENU } from "@/content/site";
import { cn } from "@/lib/cn";

export function FullMenuDialog({ initialTab, onClose }: { initialTab?: string; onClose: () => void }) {
  const { reserve, afterDialogClose } = useSite();
  const [index, setIndex] = useState(() => Math.max(0, FULL_MENU.findIndex((section) => section.id === initialTab)));
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const section = FULL_MENU[index];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      panel.querySelectorAll("[data-menu-row]"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.05, ease: "power3.out", delay: 0.1 },
    );
    return () => {
      tween.kill();
    };
  }, [index]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = FULL_MENU.length;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % count;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + count) % count;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Dialog labelledBy="full-menu-title" onClose={onClose} variant="full">
      {(close) => (
        <div className="grid min-h-full lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative hidden lg:block">
            <div className="sticky top-0 h-[100svh] overflow-hidden">
              {FULL_MENU.map((item, i) => (
                <Image
                  key={item.id}
                  src={item.image.src}
                  alt=""
                  fill
                  sizes="42vw"
                  className={cn("object-cover transition-opacity duration-1000 ease-luxe", i === index ? "opacity-100" : "opacity-0")}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-ink" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
              <div className="absolute bottom-[8%] left-[12%] right-[10%]" data-dialog-item="">
                <p className="eyebrow text-ivory/70">Khaana · À la carte</p>
                <p className="mt-5 font-serif text-[3.4vw] font-medium uppercase leading-[0.95] text-ivory">{section.title}</p>
                <p className="body-copy mt-4">{section.intro}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col px-[var(--pad)] pb-16 pt-5 lg:px-[5vw] lg:pt-10">
            <div className="flex h-12 items-center justify-between" data-dialog-item="">
              <p className="font-serif text-[1.2rem] font-medium tracking-[0.5em] text-ivory">KHAANA</p>
              <DialogClose onClick={close} />
            </div>
            <h2 id="full-menu-title" data-dialog-item="" className="display-m mt-10 text-ivory lg:mt-14">
              The Menu
            </h2>
            <div
              role="tablist"
              aria-label="Menu sections"
              onKeyDown={onTabKeyDown}
              data-dialog-item=""
              className="mt-8 flex flex-wrap gap-x-7 gap-y-4 border-b border-ivory/10 pb-5"
            >
              {FULL_MENU.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`full-menu-tab-${item.id}`}
                  aria-selected={i === index}
                  aria-controls="full-menu-panel"
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative eyebrow transition-colors duration-500",
                    i === index ? "text-ivory" : "text-ivory/45 hover:text-ivory/80",
                  )}
                >
                  {item.title}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-[21px] left-0 h-px w-full origin-left bg-gold-soft transition-[scale] duration-500",
                      i === index ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              ))}
            </div>

            <div
              ref={panelRef}
              id="full-menu-panel"
              role="tabpanel"
              aria-labelledby={`full-menu-tab-${section.id}`}
              className="mt-2"
            >
              <p className="body-copy mt-6 lg:hidden">{section.intro}</p>
              <ul className="mt-2">
                {section.items.map((item) => (
                  <li key={item.name} data-menu-row="" className="border-b border-ivory/[0.07] py-5">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-serif text-[1.35rem] font-medium leading-tight text-ivory sm:text-[1.5rem]">{item.name}</h3>
                      {item.signature ? <span className="meta hidden text-gold-soft sm:inline">Signature</span> : null}
                      <span aria-hidden="true" className="mx-1 min-w-6 flex-1 -translate-y-1 border-b border-dotted border-ivory/20" />
                      <span className="shrink-0 text-[0.88rem] tabular-nums text-ivory/85">{formatINR(item.price)}</span>
                    </div>
                    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ivory/55">
                      {item.description}
                      {item.tags?.length ? <span className="meta ml-3 text-ivory/40">{item.tags.join(" · ")}</span> : null}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <p className="meta mt-10 leading-[2] text-ivory/40">
              V — Vegetarian · GF — Gluten free · N — Contains nuts
              <br />
              Prices in INR, exclusive of taxes. Please tell us about any allergies.
            </p>
            <div className="mt-10">
              <Button
                variant="solid"
                arrow
                onClick={() => {
                  afterDialogClose(() => reserve());
                  close();
                }}
              >
                Reserve a table
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
