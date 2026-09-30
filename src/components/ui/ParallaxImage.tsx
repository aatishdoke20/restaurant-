import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Must include positioning/sizing (e.g. "absolute inset-0" or an aspect ratio). */
  className?: string;
  imgClassName?: string;
  position?: string;
  /** yPercent travel of the inner layer across the section scroll (max ~8). */
  speed?: number;
  /** Registers with the section choreography for a clip + scale reveal. */
  reveal?: boolean;
  preload?: boolean;
  children?: ReactNode;
};

/**
 * Three layers: frame (clip reveal) → parallax layer (scrubbed yPercent, 120% tall)
 * → inner (entrance scale). Transforms never touch layout.
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  position,
  speed = 6,
  reveal = false,
  preload = false,
  children,
}: ParallaxImageProps) {
  const positioned = className?.includes("absolute") || className?.includes("fixed");
  return (
    <div className={cn(!positioned && "relative", "overflow-hidden", className)} data-anim={reveal ? "image" : undefined}>
      <div className="absolute inset-x-0 -top-[10%] -bottom-[10%]" data-speed={speed ? String(speed) : undefined}>
        <div className="absolute inset-0" data-anim-inner>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            preload={preload}
            className={cn("object-cover", imgClassName)}
            style={position ? { objectPosition: position } : undefined}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
