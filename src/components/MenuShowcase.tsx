"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ArrowLink } from "@/components/ui/Button";
import { ArrowDownIcon } from "@/components/ui/Icons";
import { formatINR, FULL_MENU, MENU_SHOWCASE } from "@/content/site";
import { cn } from "@/lib/cn";

type Layer = { key: number; index: number };

export function MenuShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { openDialog, scrollTo } = useSite();
  const [activeIndex, setActiveIndex] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, index: 0 }]);
  const busy = useRef(false);
  const keyCounter = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useSectionChoreography(ref);

  const current = MENU_SHOWCASE[activeIndex];

  const select = (index: number) => {
    if (index === activeIndex || busy.current) return;
    busy.current = true;
    const section = ref.current;
    const commit = () => {
      keyCounter.current += 1;
      const key = keyCounter.current;
      setLayers((prev) => [...prev.slice(-1), { key, index }]);
      setActiveIndex(index);
    };
    if (!section || prefersReducedMotion()) {
      commit();
      busy.current = false;
      return;
    }
    gsap
      .timeline({ onComplete: commit })
      .to(section.querySelectorAll("[data-dish-line]"), { yPercent: -112, duration: 0.45, ease: "power3.in", stagger: 0.05 })
      .to(section.querySelectorAll("[data-dish-fade]"), { opacity: 0, y: -8, duration: 0.3, stagger: 0.03 }, 0);
  };

  // Choreograph the incoming dish: name lines rise, new photography wipes in over the previous.
  useIsoLayoutEffect(() => {
    const section = ref.current;
    if (!section || layers.length < 2) return;
    const key = layers[layers.length - 1].key;
    if (prefersReducedMotion()) {
      setLayers((prev) => prev.slice(-1));
      return;
    }
    const ctx = gsap.context(() => {
      const incoming = section.querySelectorAll<HTMLElement>(`[data-layer="${key}"]`);
      const tl = gsap.timeline({
        onComplete: () => {
          busy.current = false;
          setLayers((prev) => prev.slice(-1));
        },
      });
      tl.fromTo(
        incoming,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.15, ease: "expo.inOut", stagger: 0.09 },
        0,
      )
        .fromTo(
          section.querySelectorAll(`[data-layer="${key}"] img`),
          { scale: 1.16 },
          { scale: 1, duration: 1.7, ease: "expo.out", stagger: 0.09 },
          0.1,
        )
        .fromTo(
          section.querySelectorAll("[data-dish-line]"),
          { yPercent: 112 },
          { yPercent: 0, duration: 0.95, ease: "power4.out", stagger: 0.08 },
          0.2,
        )
        .fromTo(
          section.querySelectorAll("[data-dish-fade]"),
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 },
          0.45,
        );
    }, section);
    return () => ctx.revert();
  }, [layers]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = MENU_SHOWCASE.length;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (activeIndex + 1) % count;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (activeIndex - 1 + count) % count;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    select(next);
  };

  const renderFrame = (slot: "dish" | 0 | 1, sizes: string) =>
    layers.map((layer) => {
      const category = MENU_SHOWCASE[layer.index];
      const asset = slot === "dish" ? category.dish : category.supporting[slot];
      const image = asset.image;
      const alt = slot === "dish" ? image.alt : "";
      return (
        <div key={layer.key} data-layer={layer.key} className="absolute inset-0">
          <Image
            src={image.src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition: asset.position }}
          />
        </div>
      );
    });

  const viewFullMenu = () => openDialog("menu", { tab: current.id });

  return (
    <section
      ref={ref}
      id="menu"
      data-nav="menu"
      aria-labelledby="menu-title"
      className="relative overflow-hidden bg-ink-2 hairline-top"
    >
      <div className="relative mx-auto grid max-w-[1760px] grid-cols-12 gap-x-6 px-[var(--pad)] pb-20 pt-24 lg:min-h-[max(500px,35vw)] lg:pb-0 lg:pt-[4.6vw]">
        {/* Category navigation */}
        <div className="relative z-10 order-1 col-span-12 lg:order-none lg:col-span-2" data-exit="">
          <div className="flex items-center gap-5">
            <h2 id="menu-title" className="eyebrow text-ivory/80" data-anim="meta">
              Our Menu
            </h2>
            <span aria-hidden="true" data-anim="rule" className="h-px w-16 bg-ivory/25 lg:w-[4.2vw]" />
          </div>
          <div
            role="tablist"
            aria-label="Menu categories"
            data-anim="list"
            onKeyDown={onTabKeyDown}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 lg:mt-10 lg:flex-col lg:flex-nowrap lg:gap-[1.15rem]"
          >
            {MENU_SHOWCASE.map((category, i) => {
              const selected = i === activeIndex;
              return (
                <button
                  key={category.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`menu-tab-${category.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="menu-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "group relative shrink-0 py-1 text-left eyebrow transition-colors duration-500",
                    selected ? "text-ivory" : "text-ivory/50 hover:text-ivory/85",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-8 top-1/2 hidden h-px w-5 origin-right bg-ivory transition-[scale] duration-700 ease-luxe lg:block",
                      selected ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                  <span
                    className={cn(
                      "inline-block transition-[translate] duration-500 ease-luxe",
                      !selected && "group-hover:translate-x-1",
                    )}
                  >
                    {category.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold-soft transition-[scale] duration-700 ease-luxe lg:hidden",
                      selected ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-10 hidden lg:block" data-anim="meta">
            <ArrowLink onClick={viewFullMenu}>View full menu</ArrowLink>
          </div>
        </div>

        {/* Featured dish copy */}
        <div
          id="menu-panel"
          role="tabpanel"
          aria-labelledby={`menu-tab-${current.id}`}
          className="relative z-10 order-3 col-span-12 mt-9 lg:order-none lg:col-span-2 lg:col-start-3 lg:mt-0 lg:pt-[2.2vw]"
          data-exit=""
        >
          <div key={activeIndex} data-anim="text">
            <h3 className="whitespace-nowrap font-serif text-[clamp(2.3rem,9vw,3rem)] font-normal leading-[0.98] text-ivory lg:text-[clamp(2.2rem,2.95vw,3.5rem)]">
              {current.dish.name.map((line) => (
                <span key={line} className="rt-line">
                  <span data-dish-line="" className="rt-inner">
                    {line}
                  </span>
                </span>
              ))}
            </h3>
            <p data-dish-fade="" className="body-copy mt-5 max-w-[15rem] text-[0.82rem] lg:max-w-[12.5rem]">
              {current.dish.description}
            </p>
            <div data-dish-fade="" className="mt-6 flex items-center gap-4 text-ivory/70">
              <span className="meta">01</span>
              <span aria-hidden="true" className="h-px w-16 bg-ivory/30" />
              <span className="meta text-gold-soft">{formatINR(current.dish.price)}</span>
            </div>
            <ul data-dish-fade="" className="mt-7 space-y-3 border-t border-ivory/10 pt-5">
              {(FULL_MENU.find((section) => section.id === current.id)?.items ?? [])
                .slice(1, 4)
                .map((item) => (
                  <li key={item.name} className="flex items-baseline gap-3 text-[0.78rem]">
                    <span className="truncate text-ivory/85">{item.name}</span>
                    <span aria-hidden="true" className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-ivory/15" />
                    <span className="shrink-0 tabular-nums text-ivory/55">{formatINR(item.price)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Featured photograph */}
        <div
          data-anim="image"
          className="relative z-[4] order-2 col-span-12 mt-8 aspect-[4/3] overflow-hidden bg-ink-3 lg:order-none lg:col-span-4 lg:col-start-5 lg:-ml-10 lg:-mr-4 lg:mt-0 lg:aspect-auto lg:min-h-[420px] lg:self-stretch"
        >
          <div className="absolute inset-x-0 -bottom-[10%] -top-[10%]" data-speed="5">
            <div className="absolute inset-0" data-anim-inner="">
              {renderFrame("dish", "(min-width: 1024px) 32vw, 100vw")}
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.55)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-ink-2/60 to-transparent" />
        </div>

        {/* Supporting photographs */}
        <div className="order-4 col-span-12 mt-10 grid grid-cols-2 gap-3 lg:order-none lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-start lg:pt-[1.3vw]">
          {([0, 1] as const).map((slot) => (
            <figure key={slot} className="relative">
              <div
                data-anim="image"
                className="relative aspect-[0.68] overflow-hidden bg-ink-3 ring-1 ring-ivory/[0.08]"
              >
                <div
                  className="absolute inset-x-0 -bottom-[10%] -top-[10%]"
                  data-speed={slot === 0 ? "8" : "3"}
                >
                  <div className="absolute inset-0" data-anim-inner="">
                    {renderFrame(slot, "(min-width: 1024px) 14vw, 50vw")}
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 flex items-center gap-3 text-ivory/70" data-anim="meta">
                <span className="meta">0{slot + 2}</span>
                <span aria-hidden="true" className="h-px w-8 bg-ivory/30" />
                <span className="meta truncate text-ivory/45">{current.supporting[slot].name}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="order-5 col-span-12 mt-12 lg:hidden">
          <ArrowLink onClick={viewFullMenu}>View full menu</ArrowLink>
        </div>
      </div>

      {/* Next-section index */}
      <a
        href="#signature"
        onClick={(event) => {
          event.preventDefault();
          scrollTo("#signature");
        }}
        data-anim="meta"
        className="group absolute right-[2.1vw] top-[24%] z-10 hidden flex-col items-start gap-1 text-ivory/80 lg:flex"
      >
        <span className="font-serif text-[1.35rem] leading-none">01</span>
        <span className="meta mt-2 leading-[1.6] text-ivory/60">
          Signature
          <br />
          Dish
        </span>
        <ArrowDownIcon className="ml-1 mt-4 text-ivory/50 transition-[translate] duration-500 group-hover:translate-y-1" />
      </a>

    </section>
  );
}
