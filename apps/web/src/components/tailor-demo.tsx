"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import { useInView } from "@/components/motion/in-view";
import { NumberTicker } from "@/components/motion/number-ticker";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * A worked example of the Tailor feature, shaped like its real output
 * (matchScore, strengths, gaps, rewrittenBullets). The rewrite only reorders
 * and re-emphasises facts already in the demo profile: that is the product's
 * promise, so the demo keeps it too. Labelled as an example.
 */
const KEYWORDS = [
  { k: "Accessibility", hit: true },
  { k: "Core Web Vitals", hit: true },
  { k: "TypeScript", hit: true },
  { k: "React", hit: true },
  { k: "Design systems", hit: false },
  { k: "Testing", hit: false },
];
const BEFORE = "Built responsive, accessible interfaces for small businesses; improved Core Web Vitals and conversion.";
const AFTER: (string | { m: string })[] = [
  "Improved ",
  { m: "Core Web Vitals" },
  " and conversion for small-business clients by shipping responsive, ",
  { m: "accessible" },
  " interfaces.",
];
const SCORE = 82;
const RING = 2 * Math.PI * 52;

export function TailorDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const reduce = usePrefersReducedMotion();
  const [tailored, setTailored] = useState(false);
  const [touched, setTouched] = useState(false);

  // Play the rewrite once on arrival, unless the visitor already took over.
  useEffect(() => {
    if (!inView || touched) return;
    const id = setTimeout(() => setTailored(true), reduce ? 0 : 1500);
    return () => clearTimeout(id);
  }, [inView, touched, reduce]);

  return (
    // reducedMotion="user": travel and layout springs become instant; fades stay.
    <MotionConfig reducedMotion="user">
    <div ref={ref} className="relative overflow-hidden rounded-[22px] border border-border bg-surface/60">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        {/* Job + score */}
        <div className="border-b border-border p-6 sm:p-8 lg:border-r lg:border-b-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Job description</p>
              <p className="mt-1 text-lg font-medium text-ink">Senior Frontend Engineer</p>
            </div>
            <span className="font-mono rounded-full border border-border-strong px-2.5 py-1 text-[11px] text-muted">example</span>
          </div>

          <div className="mt-8 flex flex-col items-start gap-6 min-[420px]:flex-row min-[420px]:items-center">
            <div className="relative h-[124px] w-[124px] shrink-0">
              <svg viewBox="0 0 124 124" className="h-full w-full -rotate-90" aria-hidden>
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#5277ff" />
                    <stop offset="55%" stopColor="#8b6cff" />
                    <stop offset="100%" stopColor="#43e3c0" />
                  </linearGradient>
                </defs>
                <circle cx="62" cy="62" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle
                  cx="62"
                  cy="62"
                  r="52"
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={RING}
                  data-in={inView ? "" : undefined}
                  className="score-ring"
                  style={{ "--ring-to": RING * (1 - SCORE / 100), "--ring-from": RING } as React.CSSProperties}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="display text-[2.1rem] leading-none text-ink" aria-hidden>
                  <NumberTicker value={SCORE} />
                </span>
                <span className="sr-only">Match score {SCORE} out of 100</span>
                <span className="font-mono mt-1 text-[11px] text-muted">match</span>
              </div>
            </div>
            <p className="text-pretty text-[15px] leading-relaxed text-ink-dim">
              Strong on performance and accessibility. Add work that shows design systems and testing.
            </p>
          </div>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Keywords from the job">
            {KEYWORDS.map(({ k, hit }, i) => (
              <li
                key={k}
                data-in={inView ? "" : undefined}
                className={`chip font-mono inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1 text-[12px] ${
                  hit ? "border-accent/50 bg-accent/10 text-ink" : "border-dashed border-border-strong text-muted"
                }`}
                style={{ transitionDelay: `${0.35 + i * 0.08}s` }}
              >
                {hit ? <Check size={12} className="text-accent" /> : <Plus size={12} className="text-muted" />}
                {k}
                <span className="sr-only">{hit ? "(matched)" : "(gap)"}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Rewrite */}
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted">Experience bullet</p>
            <div role="tablist" aria-label="Bullet version" className="relative flex rounded-[10px] border border-border bg-bg p-1">
              {[
                { id: false, label: "Original" },
                { id: true, label: "Tailored" },
              ].map((t) => (
                <button
                  key={t.label}
                  role="tab"
                  type="button"
                  aria-selected={tailored === t.id}
                  onClick={() => {
                    setTouched(true);
                    setTailored(t.id);
                  }}
                  className={`relative z-10 rounded-[7px] px-3 py-1.5 text-[13px] transition-colors duration-200 ${
                    tailored === t.id ? "text-ink" : "text-muted hover:text-ink-dim"
                  }`}
                >
                  {tailored === t.id && (
                    <motion.span
                      layoutId="tailor-pill"
                      className="absolute inset-0 -z-10 rounded-[7px] bg-surface-2 ring-1 ring-border-strong"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                    />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-8 min-h-[9.5rem] flex-1 sm:min-h-[8rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={tailored ? "after" : "before"}
                initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(6px)", y: -8 }}
                transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                className="display text-pretty text-[clamp(1.35rem,2.4vw,1.85rem)] leading-snug font-[560] text-ink"
              >
                {tailored
                  ? AFTER.map((part, i) =>
                      typeof part === "string" ? (
                        <span key={i}>{part}</span>
                      ) : (
                        <mark key={i} className="bg-transparent text-ink [background-image:var(--grad-h)] bg-[length:100%_2px] bg-bottom bg-no-repeat pb-0.5">
                          {part.m}
                        </mark>
                      ),
                    )
                  : BEFORE}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted">
            {tailored
              ? "Same facts, reordered to lead with what this role asks for."
              : "Your words, exactly as you wrote them in the app."}
          </p>
        </div>
      </div>
    </div>
    </MotionConfig>
  );
}
