import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { HeroPhone } from "@/components/hero-phone";

/**
 * Hero: asymmetric split. Copy enters word by word (CSS, first paint); the
 * product stage on the right is a real 3D phone running the real home screen.
 */
export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-6 px-5 pt-28 pb-10 sm:px-6 sm:pt-32 lg:min-h-[min(100dvh,980px)] lg:grid-cols-[1.08fr_1fr] lg:gap-4 lg:pt-24 lg:pb-6">
      <div className="relative z-10">
        <SplitText
          as="h1"
          trigger="mount"
          text={"Your work,\npresented with intent."}
          className="display text-[clamp(2.7rem,6.2vw,5.4rem)] leading-[0.98] text-ink"
          stagger={0.07}
        />

        <p className="enter mt-7 max-w-[30rem] text-pretty text-[1.075rem] leading-relaxed text-ink-dim sm:text-lg" style={{ "--d": "0.42s" } as React.CSSProperties}>
          Build a live portfolio in a native app, let AI sharpen every word, and tailor your CV to any job.
        </p>

        <div className="enter mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": "0.55s" } as React.CSSProperties}>
          <Magnetic className="w-full sm:w-auto">
            <a href="/download" className="btn-grad inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-6 py-3.5 text-[15px] font-medium sm:w-auto">
              <Download size={17} strokeWidth={2} /> Download for Android
            </a>
          </Magnetic>
          <Link
            href="/u/basel"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-border-strong bg-surface/40 px-6 py-3.5 text-[15px] text-ink transition-[color,background-color,border-color,transform] duration-200 ease-[var(--ease-out)] hover:border-faint hover:bg-surface-2 active:scale-[0.97] sm:w-auto"
          >
            See a live example
            <ArrowRight size={16} className="text-muted transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <div className="enter relative" style={{ "--d": "0.2s" } as React.CSSProperties}>
        <HeroPhone />
      </div>
    </section>
  );
}
