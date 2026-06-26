"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * A real app screenshot inside an honest phone frame. Optional scroll parallax
 * (transform-only, so content stays in the DOM and SEO is unaffected) and a
 * gentle float. Both are disabled under prefers-reduced-motion.
 */
export function Device({
  src,
  alt,
  parallax = false,
  float = false,
  priority = false,
  className = "",
  maxWidth = 280,
}: {
  src: string;
  alt: string;
  parallax?: boolean;
  float?: boolean;
  priority?: boolean;
  className?: string;
  maxWidth?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <motion.div
      ref={ref}
      style={parallax && !reduce ? { y } : undefined}
      className={className}
    >
      <div
        className={`device-shadow relative mx-auto w-full overflow-hidden rounded-[36px] border border-border-strong bg-black p-2 ${float ? "floaty" : ""}`}
        style={{ maxWidth }}
      >
        {/* speaker slot */}
        <div className="absolute left-1/2 top-3 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-white/15" />
        <div className="relative aspect-[402/874] overflow-hidden rounded-[28px]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={`${maxWidth}px`}
            className="object-cover object-top"
          />
        </div>
      </div>
    </motion.div>
  );
}
