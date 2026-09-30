import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect } from "react";

let registered = false;

function register() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 1 });
  registered = true;
}

register();

export { gsap, ScrollTrigger };

/** Layout effect on the client, plain effect on the server (avoids SSR warnings). */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const MEDIA = {
  desktop: "(min-width: 1024px)",
  reduce: "(prefers-reduced-motion: reduce)",
  motion: "(prefers-reduced-motion: no-preference)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(MEDIA.reduce).matches;
}

export type Query = (selector: string) => HTMLElement[];

export function scopedQuery(root: ParentNode): Query {
  return (selector) => Array.from(root.querySelectorAll<HTMLElement>(selector));
}
