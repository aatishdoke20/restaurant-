"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { useSite } from "@/components/providers/SiteProvider";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/Button";
import { Steam } from "@/components/ui/Atmosphere";
import { IMAGES } from "@/content/site";

export function SignatureDish() {
  const ref = useRef<HTMLElement>(null);
  const { openDialog } = useSite();

  useSectionChoreography(ref, {
    setup: ({ section, q, reduced }) => {
      if (reduced) return;
      // Oversized word drifts slower than the foreground, and the dish breathes sideways.
      gsap.fromTo(
        q("[data-sig-word]"),
        { xPercent: 7, yPercent: 14 },
        {
          xPercent: -7,
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-sig-drift]"),
        { xPercent: 1.6 },
        {
          xPercent: -1.6,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        q("[data-sig-word]"),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" },
        },
      );
    },
  });

  return (
    <section
      ref={ref}
      id="signature"
      data-nav="menu"
      aria-labelledby="signature-title"
      className="relative overflow-hidden bg-ink hairline-top lg:h-[max(620px,45vw)]"
    >
      {/* Dish photography */}
      <div className="relative h-[82vw] max-h-[560px] lg:absolute lg:inset-y-0 lg:left-[19%] lg:right-0 lg:h-auto lg:max-h-none">
        <div data-sig-drift="" className="absolute inset-y-0 -left-[2%] -right-[3%]">
          <ParallaxImage
            src={IMAGES.butterChicken.src}
            alt={IMAGES.butterChicken.alt}
            sizes="(min-width: 1024px) 82vw, 100vw"
            className="absolute inset-0"
            position="52% 42%"
            speed={5}
            reveal
          />
        </div>
        <Steam className="left-[34%] top-[2%] h-[38%] w-[34%]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,6,0.5)_0%,transparent_30%,transparent_60%,#090806_100%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.72)_14%,rgba(9,8,6,0.12)_36%,transparent_55%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[30%] bg-gradient-to-t from-ink/80 to-transparent lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 hidden h-[18%] bg-gradient-to-b from-ink/70 to-transparent lg:block" />

        {/* Oversized atmospheric word */}
        <p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-0.1em] left-1/2 -translate-x-1/2 select-none lg:left-[48%]"
        >
          <span
            data-sig-word=""
            className="block whitespace-nowrap bg-[linear-gradient(180deg,rgba(196,160,112,0.42)_0%,rgba(154,121,80,0.2)_55%,rgba(120,90,60,0.08)_100%)] bg-clip-text font-serif text-[25vw] font-medium leading-[0.8] tracking-[0.02em] text-transparent lg:text-[13.2vw]"
          >
            KHAANA
          </span>
        </p>
      </div>

      {/* Copy */}
      <div
        className="relative z-10 px-[var(--pad)] pb-20 pt-4 max-lg:-mt-10 lg:absolute lg:inset-y-0 lg:left-0 lg:flex lg:w-[44%] lg:flex-col lg:justify-center lg:pb-[3vw] lg:pr-0 lg:pt-0"
        data-exit=""
      >
        <SectionLabel rule>Signature Dish</SectionLabel>
        <RevealText
          id="signature-title"
          lines={["Butter", "Chicken", "Reimagined"]}
          className="display-l mt-6 text-ivory lg:mt-7"
        />
        <p data-anim="text" className="body-copy mt-6 max-w-[20rem] lg:mt-7">
          A timeless classic, elevated with
          <br />
          smoked spices and a modern touch.
        </p>
        <dl data-anim="text" className="mt-8 grid max-w-[24rem] grid-cols-3 gap-x-5 border-t border-ivory/10 pt-5 lg:mt-9">
          {[
            { label: "Spice", value: "Medium" },
            { label: "Serves", value: "2 — 3" },
            { label: "Pairs with", value: "Sula Rasa Shiraz" },
          ].map((spec) => (
            <div key={spec.label}>
              <dt className="meta text-ivory/45">{spec.label}</dt>
              <dd className="mt-1.5 text-[0.82rem] leading-snug text-ivory/85">{spec.value}</dd>
            </div>
          ))}
        </dl>
        <div data-anim="text" className="mt-8 lg:mt-10">
          <ArrowLink onClick={() => openDialog("menu", { tab: "mains" })}>Discover this dish</ArrowLink>
        </div>
      </div>

      {/* Section index */}
      <div
        data-anim="meta"
        className="absolute right-[2.1vw] top-[22%] z-10 hidden flex-col items-start text-ivory/80 lg:flex"
      >
        <span className="font-serif text-[1.35rem] leading-none">01</span>
        <span className="meta mt-2 leading-[1.6] text-ivory/60">
          Signature
          <br />
          Dish
        </span>
        <span aria-hidden="true" className="ml-1 mt-4 block h-12 w-px bg-ivory/35" />
      </div>

    </section>
  );
}
