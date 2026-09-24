"use client";

import { useRef } from "react";
import { useInView } from "@/components/motion/in-view";

export type Token = { t: string; c?: "kw" | "id" | "str" | "fn" | "cm" | "op" };
const COLOR: Record<NonNullable<Token["c"]>, string> = {
  kw: "text-[#8ea4ff]",
  id: "text-ink",
  str: "text-mint",
  fn: "text-[#c3b3ff]",
  cm: "text-muted",
  op: "text-muted",
};

/** Real source, revealed line by line as if typed (clip-path wipe per line). */
export function CodeReveal({ lines, label }: { lines: Token[][]; label: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <pre
      ref={ref}
      aria-label={label}
      className="font-mono overflow-x-auto text-[12px] leading-[1.75] text-ink-dim [scrollbar-width:none] sm:text-[12.5px]"
    >
      <code>
        {lines.map((line, i) => (
          <span
            key={i}
            className="block whitespace-pre transition-[clip-path,opacity] ease-[steps(24,end)]"
            style={{
              clipPath: inView ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              opacity: inView ? 1 : 0.001,
              transitionDuration: inView ? "0.55s, 0.01s" : "0s",
              transitionDelay: `${0.2 + i * 0.32}s`,
            }}
          >
            {line.length === 0 ? " " : line.map((tok, j) => <span key={j} className={tok.c ? COLOR[tok.c] : undefined}>{tok.t}</span>)}
          </span>
        ))}
      </code>
    </pre>
  );
}
