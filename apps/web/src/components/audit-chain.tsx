"use client";

import { useRef } from "react";
import { Link2 } from "lucide-react";
import { useInView } from "@/components/motion/in-view";

export type ChainEntry = { action: string; hash: string };

/**
 * The audit chain drawn from real sha256 values (computed at build time with
 * the app's own hashEntry). Each link appears in order, carrying the previous
 * hash, so the structure explains itself.
 */
export function AuditChain({ entries }: { entries: ChainEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <ol ref={ref} className="relative border-t border-border pt-4">
      <span aria-hidden className="absolute bottom-3 left-[8px] top-7 w-px bg-border-strong" />
      {entries.map((e, i) => {
        const head = i === entries.length - 1;
        return (
          <li
            key={e.hash}
            className="relative flex items-center gap-3 py-1.5 transition-[opacity,transform,filter] duration-700 ease-[var(--ease-expo)]"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(-8px)",
              filter: inView ? "none" : "blur(4px)",
              transitionDelay: `${0.15 + i * 0.28}s`,
            }}
          >
            <span className={`relative z-[1] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] ${head ? "tile-accent" : "border border-border-strong bg-surface"}`}>
              <Link2 size={9} className={head ? "text-ink" : "text-muted"} />
            </span>
            <span className="font-mono truncate text-[12px] text-ink">{e.action}</span>
            <span className="font-mono ml-auto shrink-0 text-[11.5px] text-muted">
              {e.hash.slice(0, 7)}
              <span className="text-faint">…</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
