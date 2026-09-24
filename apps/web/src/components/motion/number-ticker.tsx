"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";

/**
 * Springs from `from` to `value` when scrolled into view (after Magic UI's
 * NumberTicker). Writes textContent directly: no React re-render per frame.
 * SSR renders the final value, so no-JS and reduced-motion read correctly.
 */
export function NumberTicker({
  value,
  from = 0,
  className = "",
  play = true,
}: {
  value: number;
  from?: number;
  className?: string;
  /** Optional external trigger (e.g. a parent's in-view state). */
  play?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(from);
  const spring = useSpring(mv, { damping: 42, stiffness: 110 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.textContent = String(from);
    const unsub = spring.on("change", (v) => {
      el.textContent = String(Math.round(v));
    });
    // Printing / Save as PDF shows the real number, never the pre-reveal start.
    const onPrint = () => {
      mv.jump(value);
      spring.jump(value);
      el.textContent = String(value);
    };
    window.addEventListener("beforeprint", onPrint);
    return () => {
      unsub();
      window.removeEventListener("beforeprint", onPrint);
    };
  }, [from, spring, mv, value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !play) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          mv.set(value);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mv, value, play]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
    </span>
  );
}
