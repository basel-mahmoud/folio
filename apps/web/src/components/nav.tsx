"use client";

import Link from "next/link";
import { useState } from "react";
import { Download } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Logo } from "@/components/logo";

/**
 * Floating nav. Transparent over the hero; once you scroll it settles into a
 * compact surface pill. The brand-gradient hairline doubles as reading progress.
 */
export function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <>
      <motion.div aria-hidden className="grad-hairline fixed inset-x-0 top-0 z-[60] origin-left !opacity-90" style={{ scaleX: progress }} />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
        <nav className="pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center justify-between pl-4 pr-2">
          {/* Surface fades in once you scroll; the bar itself never changes size. */}
          <span
            aria-hidden
            className={`absolute inset-0 -z-10 rounded-[16px] border border-border bg-bg/80 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.8)] backdrop-blur-md transition-opacity duration-500 ease-[var(--ease-out)] ${
              scrolled ? "opacity-100" : "opacity-0"
            }`}
          />
          <Link href="/" className="press inline-flex items-center gap-2.5" aria-label="Folio home">
            <Logo size={22} />
            <span className="font-mono text-[15px] font-bold tracking-[0.22em] text-ink">FOLIO</span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="#how" className="hidden rounded-[10px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink md:block">
              How it works
            </a>
            <Link href="/u/basel" className="hidden rounded-[10px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">
              Live example
            </Link>
            <a href="https://github.com/basel-mahmoud/folio" className="hidden rounded-[10px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">
              GitHub
            </a>
            <a href="/download" className="btn-grad ml-1 inline-flex items-center gap-1.5 rounded-[11px] px-3.5 py-2 text-sm font-medium">
              <Download size={15} /> Download
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}
