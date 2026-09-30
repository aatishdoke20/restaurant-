"use client";

import type { RefObject } from "react";
import { gsap, MEDIA, ScrollTrigger, scopedQuery, useIsoLayoutEffect, type Query } from "@/lib/gsap";

export type ChoreographyApi = {
  section: HTMLElement;
  q: Query;
  isDesktop: boolean;
  reduced: boolean;
  /** The section entrance timeline (null when reduced motion is on). */
  entrance: gsap.core.Timeline | null;
};

type Options = {
  /** ScrollTrigger start for the entrance choreography. */
  start?: string;
  /** Subtle scrubbed fade/lift of `[data-exit]` content as the section leaves (desktop). */
  exit?: boolean;
  /** Section specific extras (pins, drifts, loops). May return a cleanup. */
  setup?: (api: ChoreographyApi) => void | (() => void);
};

/**
 * Central section choreography. Every section declares its layers with data attributes
 * and gets the same cinematic order:
 *
 * atmosphere (bg) → image (clip + scale) → heading lines → rules → text → metadata → lists
 *
 * plus scrubbed parallax for `[data-speed]` layers and a soft exit for `[data-exit]`.
 */
export function useSectionChoreography(ref: RefObject<HTMLElement | null>, options: Options = {}) {
  const { start = "top 74%", exit = true, setup } = options;

  useIsoLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add({ isDesktop: MEDIA.desktop, reduced: MEDIA.reduce }, (context) => {
      const { isDesktop = false, reduced = false } = context.conditions ?? {};
      const q = scopedQuery(section);

      if (reduced) {
        return setup?.({ section, q, isDesktop, reduced, entrance: null });
      }

      const entrance = buildEntrance(section, q, start);
      buildParallax(section, q);
      if (exit && isDesktop) buildExit(section, q);

      return setup?.({ section, q, isDesktop, reduced, entrance });
    });

    return () => mm.revert();
    // Choreography is intentionally built once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function buildEntrance(section: HTMLElement, q: Query, start: string) {
  const bg = q('[data-anim="bg"]');
  const images = q('[data-anim="image"]');
  const imageInners = images
    .map((img) => img.querySelector<HTMLElement>("[data-anim-inner]"))
    .filter((el): el is HTMLElement => el !== null);
  const headings = q('[data-anim="heading"] .rt-inner');
  const rules = q('[data-anim="rule"]');
  const rulesY = q('[data-anim="rule-y"]');
  const texts = q('[data-anim="text"]');
  const metas = q('[data-anim="meta"]');
  const lists = q('[data-anim="list"] > *');

  const total =
    bg.length + images.length + headings.length + rules.length + rulesY.length + texts.length + metas.length + lists.length;
  if (!total) return null;

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  let t = 0;

  if (bg.length) {
    tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0);
    t = 0.12;
  }
  if (images.length) {
    tl.fromTo(
      images,
      { clipPath: "inset(14% 9% 14% 9%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", stagger: 0.13 },
      t,
    );
    if (imageInners.length) {
      tl.fromTo(imageInners, { scale: 1.2 }, { scale: 1, duration: 2, ease: "expo.out", stagger: 0.13 }, t);
    }
    t += 0.32;
  }
  if (headings.length) {
    tl.fromTo(
      headings,
      { yPercent: 118 },
      { yPercent: 0, duration: 1.15, ease: "power4.out", stagger: 0.12 },
      t,
    );
    t += 0.3 + headings.length * 0.07;
  }
  if (rules.length) {
    tl.fromTo(
      rules,
      { scaleX: 0 },
      { scaleX: 1, transformOrigin: "left center", duration: 1.3, ease: "expo.out", stagger: 0.1 },
      Math.max(0, t - 0.35),
    );
  }
  if (rulesY.length) {
    tl.fromTo(
      rulesY,
      { scaleY: 0 },
      { scaleY: 1, transformOrigin: "center top", duration: 1.6, ease: "expo.out" },
      Math.max(0, t - 0.4),
    );
  }
  if (texts.length) {
    tl.fromTo(texts, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.95, stagger: 0.11 }, t);
    t += 0.18;
  }
  if (metas.length) {
    tl.fromTo(metas, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, t + 0.08);
    t += 0.16;
  }
  if (lists.length) {
    tl.fromTo(lists, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.075 }, t);
  }

  ScrollTrigger.create({
    trigger: section,
    start,
    onEnter: () => tl.play(),
    onLeave: (self) => {
      if (tl.progress() < 1) tl.progress(1);
      self.kill();
    },
  });

  return tl;
}

function buildParallax(section: HTMLElement, q: Query) {
  q("[data-speed]").forEach((el) => {
    const speed = Number(el.dataset.speed) || 0;
    if (!speed) return;
    const prop = el.dataset.axis === "x" ? "xPercent" : "yPercent";
    gsap.fromTo(
      el,
      { [prop]: -speed },
      {
        [prop]: speed,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}

function buildExit(section: HTMLElement, q: Query) {
  const els = q("[data-exit]");
  if (!els.length) return;
  gsap.fromTo(
    els,
    { opacity: 1, y: 0 },
    {
      opacity: 0.18,
      y: -46,
      ease: "none",
      scrollTrigger: { trigger: section, start: "bottom 52%", end: "bottom top", scrub: true },
    },
  );
}
