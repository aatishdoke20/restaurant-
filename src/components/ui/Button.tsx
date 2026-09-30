import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type AnchorOnly = { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href">;
type ButtonOnly = { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 10"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      aria-hidden="true"
      className={cn(
        "h-[10px] w-[30px] shrink-0 overflow-visible transition-transform duration-500 ease-luxe group-hover:translate-x-1.5",
        className,
      )}
    >
      <path d="M0 5h28" />
      <path d="M24.5 1.5 28 5l-3.5 3.5" />
    </svg>
  );
}

type Variant = "solid" | "outline" | "pill";

const VARIANTS: Record<Variant, { root: string; fill: string }> = {
  solid: {
    root: "h-11 px-7 bg-ivory text-ink",
    fill: "origin-left scale-x-0 bg-[#f8f1e4] group-hover:scale-x-100",
  },
  outline: {
    root: "h-10 px-6 border border-ivory/35 text-ivory hover:border-ivory/75",
    fill: "origin-left scale-x-0 bg-ivory/[0.08] group-hover:scale-x-100",
  },
  pill: {
    root: "h-9 px-6 rounded-full border border-ivory/45 text-ivory hover:border-ivory hover:text-ink",
    fill: "origin-bottom scale-y-0 bg-ivory group-hover:scale-y-100",
  },
};

type ButtonProps = { variant?: Variant; arrow?: boolean; className?: string; children: ReactNode } & (
  | AnchorOnly
  | ButtonOnly
);

export function Button(props: ButtonProps) {
  const { variant = "solid", arrow = false, className, children, ...rest } = props;
  const v = VARIANTS[variant];
  const classes = cn(
    "group relative isolate inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden eyebrow transition-[color,border-color] duration-500 ease-luxe",
    v.root,
    className,
  );
  const inner = (
    <>
      <span
        aria-hidden="true"
        className={cn("absolute inset-0 -z-10 transition-transform duration-700 ease-luxe", v.fill)}
      />
      <span className="relative">{children}</span>
      {arrow ? <ArrowIcon className="w-6" /> : null}
    </>
  );

  if (typeof rest.href === "string") {
    const anchorProps = rest as AnchorOnly;
    return (
      <a {...anchorProps} className={classes}>
        {inner}
      </a>
    );
  }
  const buttonProps = rest as ButtonOnly;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {inner}
    </button>
  );
}

type ArrowLinkProps = { underline?: boolean; arrow?: boolean; className?: string; children: ReactNode } & (
  | AnchorOnly
  | ButtonOnly
);

/** Tiny uppercase editorial link with a drawn underline and travelling arrow. */
export function ArrowLink(props: ArrowLinkProps) {
  const { underline = true, arrow = true, className, children, ...rest } = props;
  const classes = cn(
    "group inline-flex items-center gap-4 eyebrow text-ivory/90 transition-colors duration-500 hover:text-ivory",
    className,
  );
  const inner = (
    <>
      <span className={cn("relative", underline && "pb-1.5")}>
        <span className="inline-block transition-transform duration-500 ease-luxe group-hover:translate-x-0.5">
          {children}
        </span>
        {underline ? (
          <>
            <span aria-hidden="true" className="absolute bottom-0 left-0 h-px w-full bg-ivory/35" />
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-ivory transition-transform duration-700 ease-luxe group-hover:scale-x-100"
            />
          </>
        ) : null}
      </span>
      {arrow ? <ArrowIcon className={underline ? "-mt-1.5" : undefined} /> : null}
    </>
  );

  if (typeof rest.href === "string") {
    const anchorProps = rest as AnchorOnly;
    return (
      <a {...anchorProps} className={classes}>
        {inner}
      </a>
    );
  }
  const buttonProps = rest as ButtonOnly;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {inner}
    </button>
  );
}
