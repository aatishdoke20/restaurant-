import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: ReactNode;
  rule?: boolean;
  className?: string;
  ruleClassName?: string;
};

/** Tiny uppercase eyebrow, optionally followed by a drawn hairline. */
export function SectionLabel({ children, rule = false, className, ruleClassName }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-5", className)}>
      <p className="eyebrow text-ivory/80" data-anim="meta">
        {children}
      </p>
      {rule ? (
        <span aria-hidden="true" data-anim="rule" className={cn("h-px w-14 bg-ivory/30 lg:w-20", ruleClassName)} />
      ) : null}
    </div>
  );
}
