"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MEDIA, scopedQuery, useIsoLayoutEffect } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowLink, Button } from "@/components/ui/Button";
import { Embers, Steam } from "@/components/ui/Atmosphere";
import { PinIcon } from "@/components/ui/Icons";
import { IMAGES } from "@/content/site";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo, reserve } = useSite();

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const q = scopedQuery(root);

    const mm = gsap.matchMedia();
    mm.add({ reduced: MEDIA.reduce, isDesktop: MEDIA.desktop }, (ctx) => {
      const { reduced = false, isDesktop = false } = ctx.conditions ?? {};
      const announce = () => window.dispatchEvent(new CustomEvent("khaana:intro"));
      gsap.set(q("[data-hero-hide]"), { visibility: "visible" });

      if (reduced) {
        gsap.set(q("[data-hero-veil]"), { opacity: 0 });
        announce();
        return;
      }

      // Load choreography: atmosphere → dish → label → title letters → copy → meta → CTAs → cue.
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: "power3.out" } });
      tl.fromTo(q("[data-hero-veil]"), { opacity: 1 }, { opacity: 0, duration: 2.1, ease: "power2.inOut" }, 0)
        .fromTo(q("[data-hero-img]"), { scale: 1.08 }, { scale: 1, duration: 3.2, ease: "power2.out" }, 0)
        .fromTo(q("[data-hero-label]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out" }, 0.5)
        .fromTo(
          q("#hero-title .rt-char"),
          { yPercent: 118 },
          { yPercent: 0, duration: 1.3, ease: "power4.out", stagger: 0.032 },
          0.6,
        )
        .call(announce, [], 1.2)
        .fromTo(q("[data-hero-copy]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 1.3)
        .fromTo(q("[data-hero-meta]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9 }, 1.55)
        .fromTo(
          q("[data-hero-cta] > *"),
          { opacity: 0, y: 16, clipPath: "inset(100% 0% 0% 0%)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.14, ease: "expo.out" },
          1.75,
        )
        .fromTo(q("[data-hero-scroll]"), { opacity: 0 }, { opacity: 1, duration: 1, stagger: 0.12 }, 2.1);

      gsap.fromTo(
        q("[data-scroll-dot]"),
        { yPercent: -100 },
        { yPercent: 320, duration: 1.9, ease: "power2.inOut", repeat: -1, repeatDelay: 0.5, delay: 2.6 },
      );

      // Scrubbed hand-off to the next section.
      gsap.to(q("[data-hero-parallax]"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        q("[data-hero-content]"),
        { y: 0, opacity: 1 },
        {
          y: isDesktop ? -130 : -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom 12%", scrub: true },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink lg:max-h-[1080px] lg:min-h-[680px]"
    >
      {/* Photography */}
      <div className="absolute inset-x-0 top-0 h-[66%] lg:bottom-0 lg:left-[9%] lg:h-auto">
        <div data-hero-parallax="" className="absolute inset-0">
          <div data-hero-img="" className="absolute inset-0 origin-[65%_50%]">
            <Image
              src={IMAGES.hero.src}
              alt={IMAGES.hero.alt}
              fill
              preload
              fetchPriority="high"
              sizes="(min-width: 1024px) 92vw, 100vw"
              className="object-cover object-[68%_50%] lg:object-[74%_50%]"
            />
          </div>
        </div>
        <Steam className="left-[40%] top-[6%] h-[42%] w-[36%] lg:left-[42%] lg:top-[10%] lg:w-[26%]" />
        <Embers className="left-[30%] top-[4%] h-[44%] w-[60%] lg:left-[40%] lg:w-[34%]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,6,0.55)_0%,rgba(9,8,6,0)_20%,rgba(9,8,6,0)_48%,rgba(9,8,6,0.78)_80%,#090806_100%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.9)_13%,rgba(9,8,6,0.5)_31%,rgba(9,8,6,0.06)_54%,transparent_70%)]"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-[34%] bg-gradient-to-t from-ink via-ink/55 to-transparent lg:block" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 hidden h-44 bg-gradient-to-b from-ink/85 to-transparent lg:block" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[14%] bg-gradient-to-l from-ink/60 to-transparent lg:block" />
      </div>

      {/* Near-black veil that lifts on load */}
      <div data-hero-veil="" aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] bg-ink" />

      <div
        data-hero-content=""
        className="relative z-10 flex h-full flex-col justify-end px-[var(--pad)] pb-[19svh] lg:justify-center lg:pb-0"
      >
        <div data-hero-hide="" className="max-w-[40rem] lg:pt-[3vh]">
          <p className="overflow-hidden">
            <span data-hero-label="" className="eyebrow block text-ivory/80">
              Contemporary Indian Cuisine
            </span>
          </p>
          <RevealText
            as="h1"
            id="hero-title"
            lines={["India,", "Reimagined."]}
            split="chars"
            choreograph={false}
            className="display-xl mt-4 text-ivory lg:mt-5"
          />
          <p data-hero-copy="" className="body-copy mt-6 max-w-[23rem] text-ivory/70 lg:mt-7">
            Rooted in tradition. Curated for today.
            <br />A culinary journey through India&rsquo;s boldest flavours.
          </p>
          <div data-hero-cta="" className="mt-8 flex flex-wrap items-center gap-x-9 gap-y-4 lg:mt-9">
            <Button variant="solid" onClick={() => reserve()}>
              Reserve a table
            </Button>
            <ArrowLink
              href="#menu"
              underline={false}
              onClick={(event) => {
                event.preventDefault();
                scrollTo("#menu");
              }}
            >
              Explore menu
            </ArrowLink>
          </div>
        </div>
      </div>

      <div data-hero-hide="" className="absolute bottom-[5.5svh] left-[var(--pad)] z-10">
        <div data-hero-meta="" className="flex items-start gap-4 text-ivory/75">
          <PinIcon className="mt-0.5 text-ivory/70" />
          <p className="meta leading-[1.9]">
            Pune, India
            <br />
            Open daily 12pm — 11pm
          </p>
        </div>
      </div>

      <button
        type="button"
        data-hero-hide=""
        onClick={() => scrollTo("#menu")}
        aria-label="Scroll to the menu"
        className="absolute bottom-[5.5svh] right-[var(--pad)] z-10 hidden flex-col items-center gap-3 lg:flex"
      >
        <span data-hero-scroll="" className="meta text-ivory/70">
          Scroll
        </span>
        <span data-hero-scroll="" className="relative block h-14 w-px overflow-hidden bg-ivory/20">
          <span data-scroll-dot="" className="absolute left-0 top-0 block h-4 w-px bg-ivory" />
        </span>
      </button>

    </section>
  );
}
