"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type DialogProps = {
  labelledBy: string;
  onClose: () => void;
  variant?: "full" | "center";
  className?: string;
  /** Render prop receives an animated `close`. */
  children: (close: () => void) => ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Accessible modal: portal, focus trap, Escape, focus restore, curtain animation. */
export function Dialog({ labelledBy, onClose, variant = "full", className, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const done = () => onCloseRef.current();
    if (prefersReducedMotion()) {
      done();
      return;
    }
    const tl = gsap.timeline({ onComplete: done });
    if (variant === "full") {
      tl.to(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "expo.inOut" });
    } else {
      tl.to(panelRef.current, { opacity: 0, y: 16, duration: 0.45, ease: "power3.in" });
    }
    tl.to(overlayRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.35");
  }, [variant]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);

    const initial = panel.querySelector<HTMLElement>("[data-autofocus]") ?? getFocusable()[0] ?? panel;
    initial.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    let tl: gsap.core.Timeline | null = null;
    if (!prefersReducedMotion()) {
      tl = gsap.timeline();
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
      if (variant === "full") {
        tl.fromTo(
          panel,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" },
          0.05,
        );
      } else {
        tl.fromTo(panel, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.08);
      }
      const items = panel.querySelectorAll("[data-dialog-item]");
      if (items.length) {
        tl.fromTo(
          items,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" },
          variant === "full" ? 0.55 : 0.25,
        );
      }
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      tl?.kill();
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [close, variant]);

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[rgba(5,4,3,0.86)]"
        onClick={close}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        data-lenis-prevent=""
        className={cn(
          variant === "full"
            ? "absolute inset-0 overflow-y-auto bg-ink"
            : "absolute left-1/2 top-1/2 max-h-[calc(100svh-2rem)] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-ivory/10 bg-ink-2 shadow-[0_40px_120px_rgba(0,0,0,0.65)]",
          "outline-none",
          className,
        )}
      >
        {children(close)}
      </div>
    </div>,
    document.body,
  );
}

export function DialogClose({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      className={cn(
        "group inline-flex h-11 items-center gap-3 meta text-ivory/70 transition-colors hover:text-ivory",
        className,
      )}
    >
      <span className="hidden sm:inline">Close</span>
      <span className="relative block h-4 w-4" aria-hidden="true">
        <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current transition-transform duration-500 group-hover:rotate-[135deg]" />
        <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current transition-transform duration-500 group-hover:rotate-45" />
      </span>
    </button>
  );
}
