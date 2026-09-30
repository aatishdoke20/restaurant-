"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { gsap, MEDIA, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { useSite } from "@/components/providers/SiteProvider";
import { Button } from "@/components/ui/Button";
import { NAV_ITEMS, type NavId } from "@/content/site";
import { cn } from "@/lib/cn";

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo, openDialog, reserve, dialog } = useSite();
  const [active, setActive] = useState<NavId | null>(null);

  // Entrance + compact / hidden states, all driven by ScrollTrigger (no raw scroll listeners).
  useIsoLayoutEffect(() => {
    const header = ref.current;
    if (!header) return;
    const inner = header.querySelector<HTMLElement>("[data-hero-hide]");

    const mm = gsap.matchMedia();
    mm.add({ reduced: MEDIA.reduce }, (ctx) => {
      if (inner) gsap.set(inner, { visibility: "visible" });
      if (ctx.conditions?.reduced) return;
      gsap.fromTo(
        header.querySelectorAll("[data-header-item]"),
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "power3.out", delay: 1.35 },
      );
    });

    let compact = false;
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        const nextCompact = y > 40;
        const nextHidden = y > window.innerHeight * 0.85 && self.direction === 1;
        if (nextCompact !== compact) {
          compact = nextCompact;
          header.dataset.compact = String(compact);
        }
        if (nextHidden !== hidden) {
          hidden = nextHidden;
          header.dataset.hidden = String(hidden);
        }
      },
    });

    return () => {
      st.kill();
      mm.revert();
    };
  }, []);

  // Subtle active-section indication.
  useEffect(() => {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(el.dataset.nav as NavId);
        },
      }),
    );
    const hero = document.getElementById("top");
    const heroTrigger = hero
      ? ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(null);
          },
        })
      : null;
    return () => {
      triggers.forEach((t) => t.kill());
      heroTrigger?.kill();
    };
  }, []);

  const navigate = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (href === "#reserve") reserve();
    else scrollTo(href);
  };

  const [menu, story, restaurant] = NAV_ITEMS;

  return (
    <header
      ref={ref}
      data-compact="false"
      data-hidden="false"
      className="group/header fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-luxe data-[hidden=true]:-translate-y-full"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 border-b border-ivory/[0.06] bg-[linear-gradient(180deg,rgba(9,8,6,0.96),rgba(9,8,6,0.86))] opacity-0 transition-opacity duration-700 group-data-[compact=true]/header:opacity-100"
      />
      <div
        data-hero-hide=""
        className="relative mx-auto grid h-[68px] max-w-[1760px] grid-cols-12 items-center gap-x-6 px-[var(--pad)] lg:h-[82px]"
      >
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            scrollTo(0);
          }}
          data-header-item=""
          aria-label="Khaana — back to top"
          className="col-span-6 w-max origin-left font-serif text-[1.3rem] font-medium tracking-[0.5em] text-ivory transition-[scale] duration-700 ease-luxe group-data-[compact=true]/header:scale-[0.92] lg:col-span-2 lg:text-[1.45rem]"
        >
          KHAANA
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-14 lg:col-span-3 lg:col-start-3 lg:flex lg:pl-[3.4vw]">
          <NavLink href={menu.href} label={menu.label} active={active === menu.id} onClick={navigate(menu.href)} />
          <NavLink href={story.href} label={story.label} active={active === story.id} onClick={navigate(story.href)} />
        </nav>

        <div className="col-span-6 flex items-center justify-end gap-5 lg:col-span-5 lg:col-start-8 lg:gap-8">
          <span className="hidden lg:inline-flex">
            <NavLink
              href={restaurant.href}
              label={restaurant.label}
              active={active === restaurant.id}
              onClick={navigate(restaurant.href)}
            />
          </span>
          <span aria-hidden="true" data-header-item="" className="hidden h-7 w-px bg-ivory/25 lg:block" />
          <Button
            variant="pill"
            href="#reserve"
            onClick={navigate("#reserve")}
            data-header-item=""
            aria-current={active === "reserve" ? "true" : undefined}
            className="h-9 px-5 lg:px-6"
          >
            Reserve
          </Button>
          <button
            type="button"
            onClick={() => openDialog("nav")}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={dialog?.name === "nav"}
            data-header-item=""
            className="-mr-2 grid h-11 w-11 place-items-center lg:hidden"
          >
            <span className="flex w-6 flex-col gap-[7px]" aria-hidden="true">
              <span className="h-px w-full bg-ivory" />
              <span className="h-px w-4 self-end bg-ivory" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      data-header-item=""
      aria-current={active ? "true" : undefined}
      className={cn(
        "group relative meta transition-colors duration-500 hover:text-ivory",
        active ? "text-ivory" : "text-ivory/75",
      )}
    >
      <span className="inline-block transition-[translate] duration-500 ease-luxe group-hover:-translate-y-px">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-2 left-0 h-px w-full origin-left bg-gold-soft transition-[scale] duration-700 ease-luxe",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </a>
  );
}
