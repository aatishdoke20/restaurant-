"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MEDIA } from "@/lib/gsap";

/** A quiet trailing ring for fine pointers only. The native cursor is kept. */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`${MEDIA.finePointer} and ${MEDIA.motion}`);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!enabled || !ring) return;
    gsap.set(ring, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.6, ease: "power3.out" });
    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set(ring, { x: event.clientX, y: event.clientY });
        gsap.to(ring, { autoAlpha: 1, duration: 0.4 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      ring.dataset.hover = String(!!target?.closest("a, button, select, input, textarea, label, [role='tab']"));
    };
    const onLeave = () => {
      visible = false;
      gsap.to(ring, { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(ring);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      data-hover="false"
      className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border border-ivory/30 opacity-0 transition-[scale,border-color,background-color] duration-500 ease-luxe data-[hover=true]:scale-[1.7] data-[hover=true]:border-gold-soft/70 data-[hover=true]:bg-gold-soft/[0.06]"
    />
  );
}
