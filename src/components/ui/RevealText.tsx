import type { ElementType } from "react";
import { cn } from "@/lib/cn";

type RevealTextProps = {
  as?: ElementType;
  lines: string[];
  id?: string;
  className?: string;
  lineClassName?: string;
  /** "chars" splits every line into letters for the hero reveal. */
  split?: "lines" | "chars";
  /** Registers the heading with the section choreography (data-anim="heading"). */
  choreograph?: boolean;
};

/**
 * Pre-split, SSR-safe heading. Each line is clipped by `.rt-line` so the inner
 * content can be revealed upward. Screen readers get one clean sentence.
 */
export function RevealText({
  as: Tag = "h2",
  lines,
  id,
  className,
  lineClassName,
  split = "lines",
  choreograph = true,
}: RevealTextProps) {
  return (
    <Tag id={id} className={className} data-anim={choreograph ? "heading" : undefined}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true" className="block">
        {lines.map((line, i) => (
          <span key={`${line}-${i}`} className={cn("rt-line", lineClassName)}>
            <span className="rt-inner">
              {split === "chars"
                ? line.split(" ").map((word, wi, words) => (
                    <span key={`${word}-${wi}`} className="rt-word">
                      {Array.from(word).map((ch, ci) => (
                        <span key={ci} className="rt-char">
                          {ch}
                        </span>
                      ))}
                      {wi < words.length - 1 ? <span className="rt-char">&nbsp;</span> : null}
                    </span>
                  ))
                : line}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
