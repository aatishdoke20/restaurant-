import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 20" width={14} height={18} {...base} {...props}>
      <path d="M8 19s6-6.2 6-11A6 6 0 0 0 2 8c0 4.8 6 11 6 11Z" />
      <circle cx="8" cy="8" r="2.2" />
    </svg>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} {...base} {...props}>
      <circle cx="10" cy="10" r="3.4" />
      <path d="M10 1.5v2.2M10 16.3v2.2M1.5 10h2.2M16.3 10h2.2M4 4l1.6 1.6M14.4 14.4 16 16M4 16l1.6-1.6M14.4 5.6 16 4" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} {...base} {...props}>
      <path d="M16.5 12.6A7 7 0 0 1 7.4 3.5a7 7 0 1 0 9.1 9.1Z" />
    </svg>
  );
}

export function DoorIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} {...base} {...props}>
      <path d="M4 18.5V4a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 16 4v14.5M2.5 18.5h15" />
      <circle cx="12.6" cy="10.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={14} height={14} {...base} {...props}>
      <rect x="2.5" y="4" width="15" height="13.5" rx="0.5" />
      <path d="M2.5 8h15M6.5 2v4M13.5 2v4" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 12 8" width={10} height={7} {...base} {...props}>
      <path d="m1 1.5 5 5 5-5" />
    </svg>
  );
}

export function ChevronIcon({ direction = "left", ...props }: IconProps & { direction?: "left" | "right" }) {
  return (
    <svg viewBox="0 0 8 14" width={7} height={12} {...base} {...props}>
      <path d={direction === "left" ? "M7 1 1 7l6 6" : "m1 1 6 6-6 6"} />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={15} height={15} {...base} {...props}>
      <rect x="2" y="2" width="16" height="16" rx="4.5" />
      <circle cx="10" cy="10" r="3.6" />
      <circle cx="14.7" cy="5.3" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 10 30" width={10} height={30} {...base} {...props}>
      <path d="M5 0v28M1.5 24.5 5 28l3.5-3.5" />
    </svg>
  );
}
