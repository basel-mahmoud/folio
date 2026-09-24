"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * A real app screenshot inside an honest phone frame. Optional scroll parallax
 * (transform-only, so content stays in the DOM and SEO is unaffected) and a
 * gentle float. Both are disabled under prefers-reduced-motion. The reduced-
 * motion flag is hydration-safe, so SSR and first client render always match.
 */
export function Device({
  src,
  alt,
  parallax = false,
  float = false,
  priority = false,
  className = "",
  maxWidth = 280,
  sizes,
}: {
  src: string;
  alt: string;
  parallax?: boolean;
  float?: boolean;
  priority?: boolean;
  className?: string;
  maxWidth?: number;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div ref={ref} style={parallax && !reduce ? { y } : undefined} className={className}>
      <DeviceFrame src={src} alt={alt} priority={priority} maxWidth={maxWidth} sizes={sizes} className={float ? "floaty" : ""} />
    </motion.div>
  );
}

/** The static frame, usable from server components. */
export function DeviceFrame({
  src,
  alt,
  priority = false,
  maxWidth = 280,
  sizes,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  maxWidth?: number;
  sizes?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`device-shadow relative mx-auto w-full overflow-hidden rounded-[13.5%/6.2%] border border-border-strong bg-black p-[3%] ${className}`}
      style={{ maxWidth }}
    >
      <div className="relative aspect-[402/874] overflow-hidden rounded-[11%/5%]">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes ?? `${maxWidth}px`} className="object-cover object-top" />
        {children}
      </div>
      {/* punch-hole camera */}
      <div className="absolute left-1/2 top-[2.4%] z-10 h-[1.3%] w-auto -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" style={{ aspectRatio: 1 }} />
    </div>
  );
}
