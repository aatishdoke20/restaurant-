"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

export type DialogName = "menu" | "philosophy" | "private-dining" | "nav" | "privacy" | "terms";
export type DialogState = { name: DialogName; tab?: string } | null;
export type ReservePrefill = { experience?: string; guests?: number; nonce: number } | null;
type ScrollTarget = string | number | HTMLElement;

type SiteContextValue = {
  scrollTo: (target: ScrollTarget, options?: { offset?: number; immediate?: boolean }) => void;
  dialog: DialogState;
  openDialog: (name: DialogName, options?: { tab?: string }) => void;
  closeDialog: () => void;
  /** Queue a callback to run once the current dialog has fully closed (e.g. navigate). */
  afterDialogClose: (fn: () => void) => void;
  prefill: ReservePrefill;
  reserve: (options?: { experience?: string; guests?: number }) => void;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [prefill, setPrefill] = useState<ReservePrefill>(null);

  // Lenis drives native scrolling, GSAP's ticker drives Lenis, and Lenis keeps ScrollTrigger in sync.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    document.fonts?.ready.then(refresh).catch(() => undefined);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      if (tick) gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Scroll lock while a dialog is open.
  useEffect(() => {
    const root = document.documentElement;
    if (dialog) {
      lenisRef.current?.stop();
      root.classList.add("is-locked");
      return;
    }
    lenisRef.current?.start();
    root.classList.remove("is-locked");
    const queued = afterClose.current;
    afterClose.current = null;
    if (queued) requestAnimationFrame(() => queued());
  }, [dialog]);

  const scrollTo = useCallback<SiteContextValue["scrollTo"]>((target, options) => {
    const offset = options?.offset ?? 0;
    const immediate = options?.immediate ?? false;
    const resolved: number | HTMLElement | null =
      typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (resolved === null) return;

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(resolved, {
        offset,
        immediate,
        duration: 1.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      });
      return;
    }
    const top =
      typeof resolved === "number" ? resolved : resolved.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  const openDialog = useCallback<SiteContextValue["openDialog"]>((name, options) => {
    setDialog({ name, tab: options?.tab });
  }, []);

  const closeDialog = useCallback(() => setDialog(null), []);

  const afterDialogClose = useCallback((fn: () => void) => {
    afterClose.current = fn;
  }, []);

  const reserve = useCallback<SiteContextValue["reserve"]>(
    (options) => {
      setPrefill({ ...options, nonce: Date.now() });
      scrollTo("#reserve", { offset: -24 });
    },
    [scrollTo],
  );

  const value = useMemo<SiteContextValue>(
    () => ({ scrollTo, dialog, openDialog, closeDialog, afterDialogClose, prefill, reserve }),
    [scrollTo, dialog, openDialog, closeDialog, afterDialogClose, prefill, reserve],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
