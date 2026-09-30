"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSectionChoreography } from "@/hooks/useSectionChoreography";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowLink } from "@/components/ui/Button";
import { IMAGES, RESTAURANT } from "@/content/site";

const MAJOR_ROADS = [
  "M120 318C160 262 200 222 236 196S320 140 420 120",
  "M40 250 170 222 300 214 420 232",
  "M210 18C218 80 228 140 236 196S250 290 256 330",
  "M0 170C80 164 130 176 170 190",
];

const MINOR_ROADS = [
  "M180 160 280 176",
  "M190 210 290 202",
  "M204 140 214 262",
  "M258 132 264 262",
  "M150 280 200 300",
  "M300 262 360 300",
  "M320 150 382 180",
  "M60 110 120 140",
  "M92 200 130 282",
  "M340 38 352 110",
  "M18 60 92 50",
  "M380 244 410 302",
  "M140 120 170 150",
  "M300 90 330 150",
];

export function LocationSection() {
  const ref = useRef<HTMLElement>(null);

  useSectionChoreography(ref, {
    setup: ({ section, q, reduced }) => {
      const route = section.querySelector<SVGPathElement>("[data-route]");
      if (!route || reduced) return;
      const length = route.getTotalLength();
      const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" } });
      tl.fromTo(q("[data-road]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, stagger: 0.04, ease: "power2.out" }, 0)
        .fromTo(route, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" }, 0.5)
        .fromTo(q("[data-marker]"), { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, 2.6);
      gsap.fromTo(
        q("[data-marker-pulse]"),
        { scale: 1, opacity: 0.7, transformOrigin: "50% 50%" },
        { scale: 2.6, opacity: 0, duration: 2.2, ease: "power2.out", repeat: -1, delay: 3.2 },
      );
    },
  });

  return (
    <section
      ref={ref}
      id="location"
      data-nav="restaurant"
      aria-labelledby="location-title"
      className="relative overflow-hidden bg-ink hairline-top lg:h-[max(460px,32vw)]"
    >
      <div aria-hidden="true" data-anim="bg" className="pointer-events-none absolute bottom-0 left-0 hidden h-[62%] w-[15%] lg:block">
        <Image src={IMAGES.leaf.src} alt="" fill sizes="15vw" className="object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink to-transparent" />
      </div>

      <div className="relative mx-auto grid h-full max-w-[1760px] grid-cols-12 items-center gap-x-6 px-[var(--pad)] pb-14 pt-24 lg:py-0">
        {/* Minimal map */}
        <div className="order-2 col-span-12 mt-12 lg:order-none lg:col-span-4 lg:col-start-2 lg:mt-0 lg:h-[80%]">
          <svg
            viewBox="0 0 420 320"
            role="img"
            aria-label="Stylised map showing Khaana on North Main Road, Koregaon Park, Pune"
            className="h-full w-full overflow-visible"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              data-road=""
              d="M-10 88C60 70 110 110 170 96S290 60 340 84 410 120 440 104"
              stroke="rgba(154,121,80,0.14)"
              strokeWidth="9"
              fill="none"
              strokeLinecap="round"
            />
            <text data-road="" x="22" y="70" fill="rgba(232,224,208,0.32)" fontSize="6.5" letterSpacing="2.4">
              MULA-MUTHA RIVER
            </text>
            <path
              data-road=""
              d="M170 150C190 118 262 116 292 146S312 236 276 256 184 262 164 230 152 172 170 150Z"
              stroke="rgba(232,224,208,0.22)"
              strokeWidth="1"
              fill="none"
            />
            {MAJOR_ROADS.map((d) => (
              <path key={d} data-road="" d={d} stroke="rgba(232,224,208,0.2)" strokeWidth="1.1" fill="none" />
            ))}
            {MINOR_ROADS.map((d) => (
              <path key={d} data-road="" d={d} stroke="rgba(232,224,208,0.09)" strokeWidth="0.8" fill="none" />
            ))}
            <text data-road="" x="262" y="166" fill="rgba(232,224,208,0.4)" fontSize="6.5" letterSpacing="2.4">
              KOREGAON PARK
            </text>
            <text data-road="" x="38" y="314" fill="rgba(232,224,208,0.32)" fontSize="6" letterSpacing="2.2">
              PUNE STATION
            </text>
            <path
              data-route=""
              d="M64 302C110 280 140 262 172 232S214 202 238 198"
              stroke="#b8966a"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="64" cy="302" r="2" fill="rgba(232,224,208,0.5)" data-road="" />
            <g data-marker="">
              <circle data-marker-pulse="" cx="238" cy="198" r="6" fill="none" stroke="#b8966a" strokeWidth="0.8" />
              <circle cx="238" cy="198" r="3.4" fill="#d9b889" />
              <text x="248" y="214" fill="#d9b889" fontSize="7" letterSpacing="3">
                KHAANA
              </text>
            </g>
          </svg>
        </div>

        {/* Details */}
        <div className="relative z-10 order-1 col-span-12 lg:order-none lg:col-span-3 lg:col-start-6 lg:pl-[1vw]" data-exit="">
          <SectionLabel>Location</SectionLabel>
          <h2 id="location-title" data-anim="text" className="mt-6 text-[0.95rem] font-medium uppercase tracking-[0.3em] text-ivory">
            Pune, India
          </h2>
          <address data-anim="text" className="body-copy mt-5 not-italic">
            {RESTAURANT.addressLines[0]}
            <br />
            {RESTAURANT.addressLines[1]}
          </address>
          <p data-anim="text" className="meta mt-6 text-ivory/80">
            Open daily
            <br />
            12pm — 11pm
          </p>
          <div data-anim="text" className="mt-8">
            <ArrowLink href={RESTAURANT.mapsUrl} target="_blank" rel="noopener noreferrer">
              Get directions
              <span className="sr-only"> (opens Google Maps in a new tab)</span>
            </ArrowLink>
          </div>
        </div>
      </div>

      {/* Exterior photograph */}
      <div className="relative z-[4] h-[92vw] max-h-[560px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[34%]">
        <ParallaxImage
          src={IMAGES.exterior.src}
          alt={IMAGES.exterior.alt}
          sizes="(min-width: 1024px) 36vw, 100vw"
          className="absolute inset-0"
          position="50% 50%"
          speed={5}
          reveal
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#090806_0%,transparent_22%,transparent_70%,#090806_100%)] lg:bg-[linear-gradient(90deg,#090806_0%,rgba(9,8,6,0.45)_22%,transparent_48%)]"
        />
        <p className="absolute bottom-5 right-[var(--pad)] meta text-ivory/55 lg:right-[2.2vw]">Khaana · Koregaon Park</p>
      </div>

    </section>
  );
}
