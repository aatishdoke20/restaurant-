"use client";

import { useRef } from "react";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/Button";
import { Steam } from "@/components/ui/Atmosphere";
import { formatINR, IMAGES, SEASONAL_MENU } from "@/content/site";

export function SeasonalMenu() {
  const ref = useRef<HTMLElement>(null);
  const { openDialog, reserve } = useSite();
  useSectionChoreography(ref);

  return (
    <section
      ref={ref}
      id="seasonal"
      data-nav="menu"
      aria-labelledby="seasonal-title"
      className="relative overflow-hidden bg-ink hairline-top"
    >
      {/* Plated dish */}
      <div className="relative ml-auto h-[86vw] max-h-[560px] w-[92%] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[53%]">
        <ParallaxImage
          src={IMAGES.seasonal.src}
          alt={IMAGES.seasonal.alt}
          sizes="(min-width: 1024px) 55vw, 92vw"
          className="absolute inset-0"
          position="56% 50%"
          speed={5}
          reveal
        />
        <Steam className="left-[38%] top-[4%] h-[42%] w-[32%]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#090806_0%,transparent_40%),linear-gradient(90deg,#090806_0%,transparent_30%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.55)_18%,transparent_42%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-1/5 bg-gradient-to-b from-ink/80 to-transparent lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/5 bg-gradient-to-t from-ink/80 to-transparent lg:block" />
      </div>

      <div
        className="relative z-10 mx-auto grid max-w-[1760px] grid-cols-12 gap-x-6 px-[var(--pad)] pb-20 max-lg:-mt-16 lg:min-h-[max(540px,37vw)] lg:items-center lg:py-[5vw]"
        data-exit=""
      >
        <div className="col-span-12 lg:col-span-3">
          <SectionLabel>Seasonal Menu</SectionLabel>
          <RevealText id="seasonal-title" lines={["What\u2019s", "In Season"]} className="display-l mt-6 text-ivory lg:mt-7" />
          <p data-anim="text" className="body-copy mt-6">
            Fresh ingredients. Inspired dishes.
            <br />
            Limited time only.
          </p>
          <div data-anim="text" className="mt-8">
            <ArrowLink onClick={() => reserve({ experience: "Seasonal Tasting" })}>Reserve a tasting</ArrowLink>
          </div>
        </div>

        <div className="relative col-span-12 mt-14 lg:col-span-3 lg:col-start-4 lg:mt-0 lg:pl-[2.6vw]">
          <span
            aria-hidden="true"
            data-anim="rule-y"
            className="absolute -bottom-[14%] -top-[14%] left-0 hidden w-px bg-ivory/15 lg:block"
          />
          <ul data-anim="list" aria-label="Seasonal dishes" className="divide-y divide-ivory/[0.08] border-y border-ivory/[0.08] lg:border-y-0">
            {SEASONAL_MENU.map((item) => (
              <li key={item.name} className="group flex items-baseline justify-between gap-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-[0.84rem] text-ivory/90 transition-[translate,color] duration-500 ease-luxe group-hover:translate-x-1 group-hover:text-ivory">
                    {item.name}
                  </p>
                  <p className="mt-1 text-[0.68rem] leading-snug text-muted/70">{item.description}</p>
                </div>
                <span className="shrink-0 text-[0.8rem] tabular-nums text-ivory/80">{formatINR(item.price)}</span>
              </li>
            ))}
          </ul>
          <div data-anim="text" className="mt-8">
            <ArrowLink onClick={() => openDialog("menu", { tab: "seasonal" })}>View full menu</ArrowLink>
          </div>
        </div>
      </div>

    </section>
  );
}
