"use client";

import { useRef } from "react";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { IMAGES, PRIVATE_SPACES } from "@/content/site";

export function Gatherings() {
  const ref = useRef<HTMLElement>(null);
  const { openDialog } = useSite();
  useSectionChoreography(ref);

  return (
    <section
      ref={ref}
      id="private-dining"
      data-nav="restaurant"
      aria-labelledby="gatherings-title"
      className="relative overflow-hidden bg-ink hairline-top py-24 lg:py-[4.4vw]"
    >
      <div className="relative mx-auto grid max-w-[1760px] grid-cols-12 items-center gap-x-6 px-[var(--pad)]">
        {/* Prominent image */}
        <figure className="relative z-[4] col-span-12 lg:col-span-4 lg:-ml-[3.3vw]">
          <span aria-hidden="true" data-anim="meta" className="pointer-events-none absolute -inset-3 hidden border border-ivory/10 lg:block" />
          <ParallaxImage
            src={IMAGES.privateDining.src}
            alt={IMAGES.privateDining.alt}
            sizes="(min-width: 1024px) 32vw, 100vw"
            className="aspect-[1.45] w-full"
            position="50% 55%"
            speed={5}
            reveal
          />
          <figcaption data-anim="meta" className="mt-5 flex items-center gap-4 text-ivory/60">
            <span className="meta">01</span>
            <span aria-hidden="true" className="h-px w-10 bg-ivory/25" />
            <span className="meta">{PRIVATE_SPACES[0].name}</span>
          </figcaption>
        </figure>

        {/* Copy */}
        <div className="relative z-10 col-span-12 mt-16 lg:col-span-3 lg:col-start-7 lg:mt-0" data-exit="">
          <SectionLabel>Private Dining &amp; Events</SectionLabel>
          <RevealText id="gatherings-title" lines={["Made for", "Gatherings"]} className="display-m mt-5 text-ivory lg:mt-6" />
          <p data-anim="text" className="body-copy mt-6">
            Intimate spaces for your special moments.
            <br />
            From private dinners to celebrations.
          </p>
          <div data-anim="text" className="mt-8">
            <Button variant="outline" arrow onClick={() => openDialog("private-dining")}>
              Explore
            </Button>
          </div>
        </div>

        {/* Secondary image, overlapping on mobile */}
        <figure className="relative z-[4] col-span-7 col-start-6 -mt-2 max-lg:order-first max-lg:mb-[-18vw] max-lg:translate-y-[-4vw] lg:col-span-2 lg:col-start-11 lg:mt-0 lg:-mr-[4.4vw]">
          <ParallaxImage
            src={IMAGES.candlelit.src}
            alt={IMAGES.candlelit.alt}
            sizes="(min-width: 1024px) 16vw, 58vw"
            className="aspect-[1.02] w-full ring-1 ring-ivory/10"
            position="50% 60%"
            speed={8}
            reveal
          />
          <figcaption data-anim="meta" className="mt-4 hidden items-center gap-3 text-ivory/55 lg:flex">
            <span className="meta">02</span>
            <span aria-hidden="true" className="h-px w-6 bg-ivory/25" />
            <span className="meta truncate">{PRIVATE_SPACES[1].name}</span>
          </figcaption>
        </figure>
      </div>

    </section>
  );
}
