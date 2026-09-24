"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "./use-reduced-motion";

/**
 * Steps through words with a blur crossfade (after Magic UI's WordRotate), once,
 * then settles on the last word: auto-updating text should not run forever
 * without a pause control (WCAG 2.2.2). Static under reduced motion.
 */
export function WordRotate({
  words,
  interval = 2200,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const reduce = usePrefersReducedMotion();
  const last = words.length - 1;

  useEffect(() => {
    if (reduce || i >= last) return;
    const id = setTimeout(() => setI((n) => Math.min(n + 1, last)), interval);
    return () => clearTimeout(id);
  }, [i, last, interval, reduce]);

  return (
    <span className={`relative inline-grid ${className}`} aria-live="off">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.4em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.4em", filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
