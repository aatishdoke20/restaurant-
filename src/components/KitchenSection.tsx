"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/Button";
import { Embers, FireGlow, Steam } from "@/components/ui/Atmosphere";
import { IMAGES, KITCHEN_NOTES } from "@/content/site";
import { cn } from "@/lib/cn";

export function KitchenSection() {
  const ref = useRef<HTMLElement>(null);
  const { openDialog } = useSite();
  const [activeNote, setActiveNote] = useState(0);
  const noteRef = useRef(0);

  useSectionChoreography(ref, {
    setup: ({ section, q, reduced }) => {
      // Metadata cycles Temperature → Flame → Texture → Taste as the section passes.
      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        end: "bottom 35%",
        onUpdate: (self) => {
          const index = Math.min(KITCHEN_NOTES.length - 1, Math.floor(self.progress * KITCHEN_NOTES.length));
          if (index !== noteRef.current) {
            noteRef.current = index;
            setActiveNote(index);
          }
        },
      });
      if (reduced) return;
      // Slow background zoom across the whole pass.
      gsap.fromTo(
        q("[data-kitchen-zoom]"),
        { scale: 1.14 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
  });

  return (
    <section
      ref={ref}
      id="kitchen"
      data-nav="story"
      aria-labelledby="kitchen-title"
      className="relative overflow-hidden bg-ink hairline-top lg:h-[max(540px,38vw)]"
    >
      <div className="relative h-[96vw] max-h-[600px] overflow-hidden lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
        <div data-kitchen-zoom="" className="absolute inset-0 origin-[55%_60%]">
          <ParallaxImage
            src={IMAGES.kitchen.src}
            alt={IMAGES.kitchen.alt}
            sizes="100vw"
            className="absolute inset-0"
            position="56% 55%"
            speed={7}
            reveal
          />
        </div>
        <div data-speed="-6" className="absolute left-[38%] top-[24%] h-[88%] w-[34%]">
          <FireGlow className="h-full w-full" />
        </div>
        <Steam tone="smoke" className="left-[34%] top-[-14%] h-[76%] w-[46%]" />
        <Embers className="left-[42%] top-[8%] h-[62%] w-[26%]" count={12} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#090806_0%,rgba(9,8,6,0.55)_30%,transparent_60%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.82)_16%,rgba(9,8,6,0.3)_34%,transparent_50%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[22%] bg-gradient-to-l from-ink/75 to-transparent lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-ink/80 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[22%] bg-gradient-to-t from-ink/80 to-transparent lg:block" />
      </div>

      <div
        className="relative z-10 px-[var(--pad)] max-lg:-mt-32 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[40%] lg:flex-col lg:justify-center lg:pb-[2vw] lg:pr-0"
        data-exit=""
      >
        <div data-speed="3">
          <SectionLabel>The Kitchen</SectionLabel>
          <RevealText id="kitchen-title" lines={["Fire. Time.", "Craft."]} className="display-l mt-6 text-ivory lg:mt-7" />
          <p data-anim="text" className="body-copy mt-6 lg:mt-7">
            Extra fire. Traditional techniques.
            <br />
            Modern plates.
          </p>
          <blockquote data-anim="text" className="mt-8 max-w-[21rem] border-l border-gold-soft/45 pl-6">
            <p className="font-serif text-[1.45rem] italic leading-[1.35] text-ivory/90">
              &ldquo;Fire is the only ingredient we cannot buy.&rdquo;
            </p>
            <footer className="meta mt-3 text-ivory/50">Ananya Raghunathan, Chef de Cuisine</footer>
          </blockquote>
          <div data-anim="text" className="mt-8 lg:mt-10">
            <ArrowLink onClick={() => openDialog("philosophy")}>Our philosophy</ArrowLink>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-6 px-[var(--pad)] pb-20 pt-10 lg:absolute lg:left-[88.6%] lg:top-[24%] lg:block lg:p-0">
        <ul data-anim="list" aria-label="What we cook with" className="flex flex-wrap gap-x-5 gap-y-2 lg:block lg:space-y-2.5">
          {KITCHEN_NOTES.map((note, i) => (
            <li
              key={note}
              aria-current={i === activeNote ? "true" : undefined}
              className={cn("meta transition-colors duration-700", i === activeNote ? "text-ivory" : "text-ivory/40")}
            >
              {note}
            </li>
          ))}
        </ul>
        <p data-anim="meta" className="flex items-center gap-3 text-ivory/75 lg:mt-9" aria-hidden="true">
          <span className="h-px w-5 bg-ivory/45" />
          <span className="font-serif text-[1.2rem] leading-none tabular-nums">0{activeNote + 1}</span>
        </p>
      </div>

    </section>
  );
}
