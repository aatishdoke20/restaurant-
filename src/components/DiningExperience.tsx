"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { DoorIcon, MoonIcon, SunIcon } from "@/components/ui/Icons";
import { IMAGES, SERVICE_HOURS, type ServiceHour } from "@/content/site";
import { cn } from "@/lib/cn";

const ICONS: Record<ServiceHour["icon"], typeof SunIcon> = { sun: SunIcon, moon: MoonIcon, door: DoorIcon };

export function DiningExperience() {
  const ref = useRef<HTMLElement>(null);

  useSectionChoreography(ref, {
    exit: false,
    setup: ({ section, q, isDesktop, reduced }) => {
      if (reduced) return;
      if (isDesktop) {
        // Pinned cinematic moment: the room pans while each service lights up in turn.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "+=90%", pin: true, scrub: true, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-dining-pan]"), { xPercent: 0 }, { xPercent: -12, ease: "none", duration: 1 }, 0).fromTo(
          q("[data-pin-progress]"),
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: 1 },
          0,
        );
        q("[data-service]").forEach((el, i) => {
          tl.fromTo(el, { opacity: 0.28 }, { opacity: 1, duration: 0.16, ease: "none" }, 0.1 + i * 0.27);
        });
      } else {
        gsap.fromTo(
          q("[data-dining-pan]"),
          { xPercent: 0 },
          {
            xPercent: -8,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      }
    },
  });

  return (
    <section
      ref={ref}
      id="restaurant"
      data-nav="restaurant"
      aria-labelledby="dining-title"
      className="relative z-20 overflow-hidden bg-ink hairline-top lg:h-[100svh] lg:min-h-[640px]"
    >
      <div
        data-anim="image"
        className="relative h-[76vw] max-h-[560px] overflow-hidden lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:max-h-none lg:w-[67%]"
      >
        <div data-dining-pan="" className="absolute inset-y-0 left-0 w-[112%] lg:w-[118%]">
          <div className="absolute inset-0" data-anim-inner="">
            <Image
              src={IMAGES.dining.src}
              alt={IMAGES.dining.alt}
              fill
              sizes="(min-width: 1024px) 80vw, 112vw"
              className="object-cover"
              style={{ objectPosition: "38% 50%" }}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,#090806_0%,transparent_38%)] lg:bg-[linear-gradient(270deg,#090806_0%,rgba(9,8,6,0.62)_12%,transparent_36%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-ink/75 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[20%] bg-gradient-to-t from-ink/80 to-transparent lg:block" />
      </div>

      <div className="relative z-10 px-[var(--pad)] pb-20 max-lg:-mt-10 lg:absolute lg:inset-y-0 lg:left-[68.5%] lg:right-0 lg:flex lg:flex-col lg:justify-center lg:px-0 lg:pb-0 lg:pr-[4.4vw]">
        <SectionLabel>The Dining Experience</SectionLabel>
        <RevealText id="dining-title" lines={["An Evening", "at Khaana"]} className="display-l mt-6 text-ivory lg:mt-7" />
        <p data-anim="text" className="body-copy mt-6 lg:mt-7">
          Thoughtful service. Warm ambience.
          <br />A space to slow down.
        </p>

        <ul data-anim="list" className="mt-10 grid grid-cols-3 lg:mt-[4.2vw]">
          {SERVICE_HOURS.map((item, i) => {
            const Icon = ICONS[item.icon];
            return (
              <li key={item.label} className={cn("min-w-0", i > 0 && "border-l border-ivory/12 pl-4 sm:pl-5")}>
                <div data-service="" className="flex items-start gap-2.5">
                  <Icon className="mt-[2px] shrink-0 text-gold-soft" />
                  <p className="meta leading-[1.65] text-ivory/85">
                    {item.label}
                    <br />
                    <span className="text-ivory/50">{item.value}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 hidden lg:block" aria-hidden="true">
          <span className="block h-px w-full bg-ivory/10">
            <span data-pin-progress="" className="block h-px w-full origin-left scale-x-0 bg-gold-soft/70" />
          </span>
        </div>
      </div>

    </section>
  );
}
