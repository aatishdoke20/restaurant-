"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { addDays, formatLongDate, formatShortDate, fromISO, MONTHS_LONG, toISODate } from "@/content/reservations";
import { CalendarIcon, ChevronIcon } from "@/components/ui/Icons";

type DatePickerProps = {
  id: string;
  value: string | null;
  min: string | null;
  max: string | null;
  onChange: (iso: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

type View = { y: number; m: number };

const WEEK_HEAD = [
  ["Mo", "Monday"],
  ["Tu", "Tuesday"],
  ["We", "Wednesday"],
  ["Th", "Thursday"],
  ["Fr", "Friday"],
  ["Sa", "Saturday"],
  ["Su", "Sunday"],
];

function buildMonth(view: View): (string | null)[][] {
  const first = new Date(view.y, view.m, 1);
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISODate(new Date(view.y, view.m, d)));
  while (cells.length % 7) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Accessible calendar popover (grid keyboard model: arrows, Home/End, PageUp/PageDown, Esc). */
export function DatePicker({ id, value, min, max, onChange, invalid, describedBy }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLTableElement>(null);
  const titleId = `${id}-month`;

  const isDisabled = (iso: string) => (min !== null && iso < min) || (max !== null && iso > max);

  const clamp = (iso: string) => {
    if (min && iso < min) return min;
    if (max && iso > max) return max;
    return iso;
  };

  const openPicker = () => {
    const base = clamp(value ?? min ?? toISODate(new Date()));
    const d = fromISO(base);
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setFocused(base);
    setOpen(true);
  };

  const closePicker = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  const focusDate = (iso: string) => {
    const next = clamp(iso);
    const d = fromISO(next);
    setFocused(next);
    setView({ y: d.getFullYear(), m: d.getMonth() });
  };

  const shiftMonth = (delta: number) => {
    if (!view) return;
    const target = new Date(view.y, view.m + delta, 1);
    const baseDay = focused ? fromISO(focused).getDate() : 1;
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    focusDate(toISODate(new Date(target.getFullYear(), target.getMonth(), Math.min(baseDay, lastDay))));
  };

  // Move DOM focus to the roving date.
  useEffect(() => {
    if (!open || !focused) return;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus({ preventScroll: true });
  }, [open, focused, view]);

  // Close on outside pointer.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!popRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (open && popRef.current && !prefersReducedMotion()) {
      gsap.fromTo(popRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
    }
  }, [open]);

  const onGridKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    if (!focused) return;
    const d = fromISO(focused);
    const weekday = (d.getDay() + 6) % 7;
    switch (event.key) {
      case "ArrowLeft":
        focusDate(toISODate(addDays(d, -1)));
        break;
      case "ArrowRight":
        focusDate(toISODate(addDays(d, 1)));
        break;
      case "ArrowUp":
        focusDate(toISODate(addDays(d, -7)));
        break;
      case "ArrowDown":
        focusDate(toISODate(addDays(d, 7)));
        break;
      case "Home":
        focusDate(toISODate(addDays(d, -weekday)));
        break;
      case "End":
        focusDate(toISODate(addDays(d, 6 - weekday)));
        break;
      case "PageUp":
        shiftMonth(-1);
        break;
      case "PageDown":
        shiftMonth(1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const weeks = useMemo(() => (view ? buildMonth(view) : []), [view]);
  const canPrev = !!view && (!min || toISODate(new Date(view.y, view.m, 0)) >= min);
  const canNext = !!view && (!max || toISODate(new Date(view.y, view.m + 1, 1)) <= max);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? closePicker(false) : openPicker())}
        className="flex w-full items-center justify-between gap-3 py-2 text-left text-[0.88rem] text-ivory"
      >
        <span className={cn(!value && "text-ivory/45")}>{value ? formatShortDate(value) : "Select date"}</span>
        <CalendarIcon className="text-ivory/50" />
      </button>

      {open && view ? (
        <div
          ref={popRef}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              closePicker();
            }
          }}
          className="absolute left-0 top-[calc(100%+14px)] z-40 w-[19.5rem] max-w-[calc(100vw-2.75rem)] border border-ivory/15 bg-[#0d0b08] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canPrev}
              aria-label="Previous month"
              className="grid h-8 w-8 place-items-center text-ivory/70 transition hover:text-ivory disabled:opacity-20"
            >
              <ChevronIcon direction="left" />
            </button>
            <p id={titleId} aria-live="polite" className="meta text-ivory">
              {MONTHS_LONG[view.m]} {view.y}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canNext}
              aria-label="Next month"
              className="grid h-8 w-8 place-items-center text-ivory/70 transition hover:text-ivory disabled:opacity-20"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          <table ref={gridRef} role="grid" aria-labelledby={titleId} onKeyDown={onGridKeyDown} className="mt-4 w-full border-collapse">
            <thead>
              <tr>
                {WEEK_HEAD.map(([short, long]) => (
                  <th key={short} scope="col" abbr={long} className="pb-2 text-center text-[0.6rem] font-normal tracking-[0.18em] text-ivory/40">
                    {short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, wi) => (
                <tr key={wi}>
                  {week.map((iso, di) => {
                    if (!iso) return <td key={di} role="gridcell" />;
                    const selected = iso === value;
                    const disabled = isDisabled(iso);
                    return (
                      <td key={iso} role="gridcell" aria-selected={selected} className="p-[2px] text-center">
                        <button
                          type="button"
                          data-date={iso}
                          tabIndex={iso === focused ? 0 : -1}
                          disabled={disabled}
                          aria-label={formatLongDate(iso)}
                          aria-current={iso === min ? "date" : undefined}
                          onClick={() => {
                            onChange(iso);
                            closePicker();
                          }}
                          className={cn(
                            "h-9 w-full text-[0.8rem] tabular-nums transition-colors duration-300",
                            selected
                              ? "bg-ivory text-ink"
                              : "text-ivory/85 hover:bg-ivory/10 focus-visible:bg-ivory/10",
                            disabled && "cursor-not-allowed text-ivory/20 line-through decoration-ivory/10 hover:bg-transparent",
                          )}
                        >
                          {Number(iso.slice(8))}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[0.68rem] leading-relaxed text-ivory/40">Bookings open up to 90 days ahead.</p>
        </div>
      ) : null}
    </div>
  );
}
