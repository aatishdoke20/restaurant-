"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { IMAGES, INGREDIENTS, SPICE_TILES, type SpiceTile } from "@/content/site";
import { cn } from "@/lib/cn";

export function SpiceTrail() {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const highlight = hovered ?? pinned;

  useSectionChoreography(ref, {
    setup: ({ section, q, reduced }) => {
      if (reduced) return;
      // Each ingredient floats at its own depth.
      q("[data-tile-speed]").forEach((el) => {
        const speed = Number(el.dataset.tileSpeed) || 0;
        gsap.fromTo(
          el,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
  });

  return (
    <section
      ref={ref}
      id="ingredients"
      data-nav="story"
      aria-labelledby="spice-title"
      className="relative z-20 overflow-hidden bg-ink hairline-top lg:h-[max(600px,42vw)]"
    >
      <div
        className="relative z-10 px-[var(--pad)] pt-24 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[36%] lg:flex-col lg:justify-center lg:pr-0 lg:pt-0"
        data-exit=""
      >
        <SectionLabel>Ingredients</SectionLabel>
        <RevealText id="spice-title" lines={["From the", "Spice Trail"]} className="display-l mt-6 text-ivory lg:mt-7" />
        <p data-anim="text" className="body-copy mt-6">
          A journey through ingredients
          <br />
          thoughtfully sourced.
        </p>
        <ol data-anim="list" className="mt-8 space-y-1 lg:mt-9">
          {INGREDIENTS.map((item) => {
            const isOn = highlight === item.n;
            return (
              <li key={item.n}>
                <button
                  type="button"
                  aria-pressed={pinned === item.n}
                  onClick={() => setPinned((prev) => (prev === item.n ? null : item.n))}
                  onMouseEnter={() => setHovered(item.n)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(item.n)}
                  onBlur={() => setHovered(null)}
                  className="group flex w-full items-baseline gap-5 py-[3px] text-left"
                >
                  <span className={cn("meta w-5 transition-colors duration-500", isOn ? "text-gold-soft" : "text-ivory/45")}>
                    {item.n}
                  </span>
                  <span
                    className={cn(
                      "text-[0.8rem] transition-[color,translate] duration-500 ease-luxe",
                      isOn ? "translate-x-1 text-ivory" : "text-ivory/80",
                    )}
                  >
                    {item.name}
                  </span>
                  <span
                    className={cn(
                      "hidden text-[0.68rem] italic text-muted transition-opacity duration-500 sm:inline",
                      isOn ? "opacity-80" : "opacity-0",
                    )}
                  >
                    {item.origin}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Overhead collage */}
      <div
        className="relative mx-[var(--pad)] mt-12 aspect-[0.86] lg:absolute lg:inset-y-0 lg:-right-[3%] lg:left-[35%] lg:mx-0 lg:mt-0 lg:aspect-auto"
        data-speed="1.6"
        data-axis="x"
      >
        {SPICE_TILES.map((tile, i) => (
          <Tile
            key={tile.id}
            tile={tile}
            priorityAlt={i === 3}
            dimmed={highlight !== null && tile.ingredient !== highlight}
            active={highlight !== null && tile.ingredient === highlight}
            onEnter={() => tile.ingredient && setHovered(tile.ingredient)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>

      <div className="h-20 lg:hidden" aria-hidden="true" />
    </section>
  );
}

function Tile({
  tile,
  priorityAlt,
  dimmed,
  active,
  onEnter,
  onLeave,
}: {
  tile: SpiceTile;
  priorityAlt: boolean;
  dimmed: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [x, y, w, h] = tile.rect;
  const [mx, my, mw, mh] = tile.mobile ?? [0, 0, 0, 0];
  const style = { "--x": x, "--y": y, "--w": w, "--h": h, "--mx": mx, "--my": my, "--mw": mw, "--mh": mh } as CSSProperties;
  const [fx, fy] = tile.focal;

  return (
    <div
      data-anim="image"
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "spice-tile overflow-hidden bg-ink-3 transition-opacity duration-700",
        !tile.mobile && "max-lg:hidden",
        dimmed && "opacity-30",
      )}
    >
      <div className="absolute -inset-[8%]" data-tile-speed={tile.speed}>
        <div className="absolute inset-0" data-anim-inner="">
          <div className={cn("absolute inset-0 transition-[scale] duration-[1400ms] ease-luxe", active ? "scale-[1.08]" : "scale-100")}>
            <Image
              src={IMAGES.spices.src}
              alt={priorityAlt ? IMAGES.spices.alt : ""}
              fill
              sizes="(min-width: 1024px) 34vw, 60vw"
              className="object-cover"
              style={{
                objectPosition: `${fx}% ${fy}%`,
                transform: `scale(${tile.zoom})`,
                transformOrigin: `${fx}% ${fy}%`,
              }}
            />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]" />
      {tile.label ? (
        <span data-anim="meta" className="absolute bottom-3 left-3 meta text-ivory/80">
          {tile.label}
        </span>
      ) : null}
    </div>
  );
}
