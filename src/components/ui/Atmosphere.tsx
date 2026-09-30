"use client";

import { useRef } from "react";
import { gsap, MEDIA, useIsoLayoutEffect } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/* Deterministic ember positions (left %, top %, size px) — no hydration mismatch. */
const EMBER_POINTS: [number, number, number][] = [
  [12, 88, 2],
  [22, 72, 1.5],
  [31, 94, 2.4],
  [38, 80, 1.4],
  [46, 90, 2],
  [53, 76, 1.2],
  [60, 92, 2.2],
  [67, 84, 1.6],
  [74, 95, 2],
  [81, 78, 1.4],
  [88, 90, 1.8],
  [18, 96, 1.3],
  [57, 98, 1.7],
  [42, 70, 1.2],
];

/** Tiny sparks drifting upward from a fire or a freshly finished dish. */
export function Embers({ className, count = 14 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      root.querySelectorAll<HTMLElement>("[data-ember]").forEach((dot, i) => {
        const duration = 3.6 + ((i * 7) % 5) * 0.6;
        const tl = gsap.timeline({ repeat: -1, repeatRefresh: true, delay: (i * 0.53) % 4 });
        tl.fromTo(
          dot,
          { x: 0, y: 0, scale: 1 },
          { x: "random(-46, 46)", y: "random(-260, -140)", scale: 0.35, duration, ease: "sine.out" },
          0,
        )
          .fromTo(dot, { opacity: 0 }, { opacity: "random(0.55, 1)", duration: duration * 0.18, ease: "power1.out" }, 0)
          .to(dot, { opacity: 0, duration: duration * 0.5, ease: "power1.in" }, duration * 0.5);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      {EMBER_POINTS.slice(0, count).map(([left, top, size], i) => (
        <span
          key={i}
          data-ember=""
          className="absolute block rounded-full bg-[#ffb46a] opacity-0 shadow-[0_0_6px_1px_rgba(255,140,60,0.75)]"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
        />
      ))}
    </div>
  );
}

/** Soft rising steam / smoke built from pre-softened radial gradients (no blur filters). */
export function Steam({ className, tone = "light" }: { className?: string; tone?: "light" | "smoke" }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      root.querySelectorAll<HTMLElement>("[data-wisp]").forEach((wisp, i) => {
        const tl = gsap.timeline({ repeat: -1, delay: i * 2.2 });
        tl.fromTo(
          wisp,
          { yPercent: 18, xPercent: 0, scaleX: 0.7, scaleY: 0.75, rotate: -4 + i * 4 },
          {
            yPercent: -40,
            xPercent: i % 2 ? 12 : -12,
            scaleX: 1.35,
            scaleY: 1.25,
            rotate: 6 - i * 3,
            duration: 6.6,
            ease: "sine.inOut",
          },
          0,
        )
          .fromTo(wisp, { opacity: 0 }, { opacity: tone === "smoke" ? 0.95 : 0.8, duration: 2.2, ease: "sine.out" }, 0)
          .to(wisp, { opacity: 0, duration: 2.8, ease: "sine.in" }, 3.8);
      });
    });
    return () => mm.revert();
  }, [tone]);

  const gradient =
    tone === "smoke"
      ? "radial-gradient(ellipse at center, rgba(214,204,188,0.17) 0%, rgba(214,204,188,0.065) 38%, transparent 68%)"
      : "radial-gradient(ellipse at center, rgba(240,232,218,0.15) 0%, rgba(240,232,218,0.05) 40%, transparent 70%)";

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          data-wisp=""
          className="absolute bottom-0 left-[15%] block h-[80%] w-[70%] rounded-full opacity-0"
          style={{ background: gradient }}
        />
      ))}
    </div>
  );
}

/** Breathing firelight — a screen-blended glow that flickers irregularly. */
export function FireGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MEDIA.motion, () => {
      gsap.to(el, {
        opacity: "random(0.5, 1)",
        scale: "random(0.93, 1.08)",
        duration: 0.75,
        ease: "sine.inOut",
        repeat: -1,
        repeatRefresh: true,
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none mix-blend-screen", className)}
      style={{
        background:
          "radial-gradient(ellipse at 50% 65%, rgba(255,150,60,0.42) 0%, rgba(255,100,30,0.16) 38%, transparent 70%)",
      }}
    />
  );
}
