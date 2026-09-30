"use client";

import { useRef } from "react";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/Button";
import { Embers, FireGlow, Steam } from "@/components/ui/Atmosphere";
import { CHEF_NOTES, IMAGES } from "@/content/site";

/**
 * Layered depth: background photograph (slow) · midground firelight (counter-drift)
 * · foreground counter shadow, smoke and embers (fast).
 */
export function ChefTable() {
  const ref = useRef<HTMLElement>(null);
  const { reserve } = useSite();
  useSectionChoreography(ref);

  return (
    <section
      ref={ref}
      id="story"
      data-nav="story"
      aria-labelledby="chef-title"
      className="relative z-20 overflow-hidden bg-ink hairline-top lg:h-[max(580px,40vw)]"
    >
      <div className="relative aspect-[4/3] w-full lg:absolute lg:inset-y-0 lg:left-[25%] lg:right-0 lg:aspect-auto">
        {/* Background layer */}
        <ParallaxImage
          src={IMAGES.chef.src}
          alt={IMAGES.chef.alt}
          sizes="(min-width: 1024px) 76vw, 100vw"
          className="absolute inset-0"
          position="50% 40%"
          speed={4}
          reveal
        />
        {/* Midground: firelight */}
        <div data-speed="-9" className="absolute right-[2%] top-[-8%] h-[72%] w-[44%]">
          <FireGlow className="h-full w-full" />
        </div>
        {/* Foreground: counter shadow, smoke, sparks */}
        <div
          data-speed="12"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-[12%] h-[46%] bg-gradient-to-t from-ink via-ink/65 to-transparent"
        />
        <Steam tone="smoke" className="right-[6%] top-[-6%] h-[60%] w-[40%]" />
        <Embers className="right-[8%] top-[6%] h-[58%] w-[36%]" count={10} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#090806_0%,rgba(9,8,6,0.2)_40%,transparent_70%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.72)_15%,rgba(9,8,6,0.1)_40%,transparent_55%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[24%] bg-gradient-to-l from-ink/80 to-transparent lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[16%] bg-gradient-to-b from-ink/70 to-transparent lg:block" />
      </div>

      <div
        className="relative z-10 px-[var(--pad)] max-lg:-mt-14 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[42%] lg:flex-col lg:justify-center lg:pr-0"
        data-exit=""
      >
        <SectionLabel>An intimate culinary journey</SectionLabel>
        <RevealText id="chef-title" lines={["The", "Chef\u2019s Table"]} className="display-l mt-6 text-ivory lg:mt-7" />
        <p data-anim="text" className="body-copy mt-6 max-w-[19.5rem] lg:mt-7">
          Go beyond the menu. Experience a close-up of our chefs, techniques and seasonal creations at our open
          kitchen.
        </p>
        <div data-anim="text" className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ivory/10 pt-5">
          <p className="meta text-ivory/85">Chef Ananya Raghunathan</p>
          <span aria-hidden="true" className="hidden h-px w-8 bg-ivory/25 sm:block" />
          <p className="meta text-ivory/50">8 seats · 6 courses · 7pm &amp; 8.30pm</p>
        </div>
        <div data-anim="text" className="mt-8 lg:mt-10">
          <ArrowLink onClick={() => reserve({ experience: "Chef's Table" })}>Discover the experience</ArrowLink>
        </div>
      </div>

      <ul
        data-anim="list"
        aria-label="Chef's table highlights"
        className="relative z-10 flex flex-wrap gap-x-6 gap-y-2 px-[var(--pad)] pb-20 pt-10 lg:absolute lg:left-[88.6%] lg:top-[29%] lg:block lg:space-y-2.5 lg:p-0"
      >
        {CHEF_NOTES.map((note) => (
          <li key={note} className="meta text-ivory/75">
            {note}
          </li>
        ))}
      </ul>

    </section>
  );
}
