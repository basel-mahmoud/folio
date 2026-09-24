"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Wraps the logo marquee with a pause control. Auto-moving content needs one
 * (WCAG 2.2.2); hover still pauses it too, and reduced motion stops it outright.
 */
export function MarqueeShell({ children }: { children: React.ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="marquee relative border-y border-border" data-paused={paused ? "" : undefined}>
      <div
        className="overflow-hidden py-5"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 86%, transparent)" }}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Play the logo strip" : "Pause the logo strip"}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg text-muted transition-[color,border-color,transform] duration-200 ease-[var(--ease-out)] hover:border-border-strong hover:text-ink active:scale-[0.94] motion-reduce:hidden sm:right-5"
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
      </button>
    </div>
  );
}
