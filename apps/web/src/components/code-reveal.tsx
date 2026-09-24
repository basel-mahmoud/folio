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

/** Real source, revealed line by line as if typed (clip-path wipe per line; hidden state gated on html.js in globals.css). */
export function CodeReveal({ lines, label }: { lines: Token[][]; label: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    // A focusable, labelled scroll region: long lines scroll horizontally on phones.
    <pre
      ref={ref}
      tabIndex={0}
      role="region"
      aria-label={label}
      className="font-mono overflow-x-auto pb-1 text-[12px] leading-[1.75] text-ink-dim sm:text-[12.5px]"
    >
      <code>
        {lines.map((line, i) => (
          <span
            key={i}
            data-in={inView ? "" : undefined}
            className="code-line block w-max min-w-full whitespace-pre"
            style={{ transitionDelay: `${0.2 + i * 0.32}s` }}
          >
            {line.length === 0 ? " " : line.map((tok, j) => <span key={j} className={tok.c ? COLOR[tok.c] : undefined}>{tok.t}</span>)}
          </span>
        ))}
      </code>
    </pre>
  );
}
