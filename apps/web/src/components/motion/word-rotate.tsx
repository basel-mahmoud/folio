"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useInView } from "./in-view";
import { usePrefersReducedMotion } from "./use-reduced-motion";

/**
 * Steps through words with a blur crossfade (after Magic UI's WordRotate), once,
 * starting when it scrolls into view, then settles on the last word. The whole
 * run stays within 5s, so it needs no pause control (WCAG 2.2.2). Under reduced
 * motion it shows the settled word straight away.
 */
export function WordRotate({
  words,
  interval = 1500,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [i, setI] = useState(0);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const last = words.length - 1;
  const step = Math.min(interval, Math.floor(4800 / Math.max(1, last)));
  const shown = reduce ? last : i;

  useEffect(() => {
    if (reduce || !inView || i >= last) return;
    const id = setTimeout(() => setI((n) => Math.min(n + 1, last)), step);
    return () => clearTimeout(id);
  }, [i, last, step, reduce, inView]);

  return (
    <span ref={ref} className={`relative inline-grid ${className}`} aria-live="off">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={shown}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.4em", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[shown]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
