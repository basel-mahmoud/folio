"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowUpRight, FileDown, Lock } from "lucide-react";
import { DeviceFrame } from "@/components/device";
import { useInView } from "@/components/motion/in-view";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

/**
 * One source, three outputs. Beams (after Magic UI's AnimatedBeam) carry a
 * gradient pulse from the phone to a live mini render of the public page and to
 * the CV, where a drag handle compares the Modern and Harvard layouts of the
 * same data (clip-path inset, after Aceternity's Compare).
 */
export function Outputs() {
  const stage = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const web = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLDivElement>(null);

  return (
    <div ref={stage} className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-24">
      <Beams stage={stage} from={phone} to={[web, cv]} />

      <div ref={phone} className="relative z-10 mx-auto w-full max-w-[250px]">
        <DeviceFrame
          src="/app/preview.png"
          alt="Folio's in-app portfolio preview, the single source for the web page and both CVs"
          maxWidth={250}
          sizes="250px"
        />
      </div>

      <div className="relative z-10 grid gap-6">
        <div ref={web}>
          <BrowserWindow />
          <Link href="/u/basel" className="font-mono mt-3 inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink">
            Open the live page <ArrowUpRight size={13} className="text-faint" />
          </Link>
        </div>
        <div ref={cv}>
          <CvCompare />
          <Link href="/u/basel/cv?template=harvard" className="font-mono mt-3 inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink">
            Open the Harvard CV <ArrowUpRight size={13} className="text-faint" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Beams --------------------------------- */

type Path = { d: string; x1: number; y1: number; x2: number; y2: number };

function Beams({ stage, from, to }: { stage: RefObject<HTMLDivElement | null>; from: RefObject<HTMLDivElement | null>; to: RefObject<HTMLDivElement | null>[] }) {
  const [paths, setPaths] = useState<Path[]>([]);
  const id = useId().replace(/:/g, "");
  const inView = useInView(stage, { margin: "80px" });

  useEffect(() => {
    const s = stage.current;
    if (!s) return;
    const compute = () => {
      const f = from.current?.getBoundingClientRect();
      const c = s.getBoundingClientRect();
      if (!f) return;
      const next: Path[] = [];
      to.forEach((ref, i) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r || r.left < f.right) return; // stacked layout: no beams
        const x1 = f.right - c.left - 6;
        const y1 = f.top - c.top + f.height * (0.38 + i * 0.24);
        const x2 = r.left - c.left - 10;
        const y2 = r.top - c.top + Math.min(r.height / 2, 150);
        const dx = (x2 - x1) * 0.55;
        next.push({ d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, x1, y1, x2, y2 });
      });
      setPaths(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(s);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [stage, from, to]);

  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" data-play={inView ? "" : undefined}>
      <defs>
        {paths.map((p, i) => (
          <linearGradient key={i} id={`${id}-g${i}`} gradientUnits="userSpaceOnUse" x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}>
            <stop offset="0%" stopColor="#5277ff" />
            <stop offset="55%" stopColor="#8b6cff" />
            <stop offset="100%" stopColor="#43e3c0" />
          </linearGradient>
        ))}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="rgb(255 255 255 / 0.13)" strokeWidth={1} />
          <path
            d={p.d}
            pathLength={1}
            fill="none"
            stroke={`url(#${id}-g${i})`}
            strokeWidth={1.5}
            strokeLinecap="round"
            className="beam-pulse"
            style={{ animationDelay: `${i * 1.1}s` }}
          />
          <circle cx={p.x2} cy={p.y2} r={3} fill="#43e3c0" />
          <circle cx={p.x1} cy={p.y1} r={3} fill="#5277ff" />
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------- Public page render --------------------------- */

function BrowserWindow() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border-strong bg-bg shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]">
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="font-mono mx-auto flex items-center gap-1.5 rounded-[7px] bg-bg px-3 py-1 text-[11px] text-muted">
          <Lock size={10} />
          <span>
            folio.app/u/<span className="text-ink">basel</span>
          </span>
        </div>
        <span className="w-[42px]" aria-hidden />
      </div>
      {/* A live render of the public page's design, with the demo profile. */}
      <div className="relative h-[270px] overflow-hidden px-7 pt-6 sm:px-9">
        <div className="grad-hairline absolute inset-x-0 top-0" />
        <div className="flex items-center gap-3">
          <div className="tile-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]">
            <span className="font-mono text-[12px] font-semibold text-ink">BM</span>
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[-0.02em] text-ink">Basel Mahmoud</p>
            <p className="text-[12px] text-ink-dim">Full-stack engineer</p>
          </div>
        </div>
        <p className="font-mono mt-3 flex items-center gap-3 text-[11px] text-muted">
          Amman, Jordan
          <span className="inline-flex items-center gap-0.5 text-ink">
            GitHub <ArrowUpRight size={10} className="text-faint" />
          </span>
          <span className="inline-flex items-center gap-0.5 text-ink">
            Email <ArrowUpRight size={10} className="text-faint" />
          </span>
        </p>
        <p className="mt-3 max-w-[60ch] text-[12.5px] leading-relaxed text-ink-dim">
          I build production-grade web and mobile apps: secure, tested and fast. Recently shipped multi-tenant SaaS with AI integrations end to end.
        </p>
        <span className="btn-grad mt-4 inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[11px] font-medium">
          <FileDown size={11} /> Download CV
        </span>
        <div className="mt-6 flex items-center gap-3">
          <p className="text-[12.5px] font-semibold text-ink">Selected work</p>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-ink">DeskHive</p>
            <p className="font-mono text-[11px] text-muted">Solo engineer</p>
          </div>
          <span className="font-mono text-[11px] text-muted">2026</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>
    </div>
  );
}

/* ------------------------------- CV compare ------------------------------- */

function CvCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const x = useMotionValue(50);
  const clip = useMotionTemplate`inset(0 0 0 ${x}%)`;
  const left = useMotionTemplate`${x}%`;
  const [aria, setAria] = useState(50);
  const dragging = useRef(false);

  useEffect(() => {
    if (!inView || reduce) return;
    // A one-time hint that the divider moves.
    const c = animate(x, [50, 22, 64, 50], { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 0.3 });
    return () => c.stop();
  }, [inView, reduce, x]);

  const setFrom = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const v = Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100));
    x.jump(v);
  };

  return (
    <div
      ref={ref}
      className="relative h-[300px] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[14px] border border-border-strong bg-[#f4f4f5] sm:h-[280px]"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        x.stop();
        setFrom(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFrom(e.clientX)}
      onPointerUp={() => {
        dragging.current = false;
        setAria(Math.round(x.get()));
      }}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">
        <ModernCv />
      </div>
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <HarvardCv />
      </motion.div>

      <span className="font-mono pointer-events-none absolute left-3 top-3 rounded-[6px] bg-[#111114] px-2 py-1 text-[11px] text-white">Modern</span>
      <span className="font-mono pointer-events-none absolute right-3 top-3 rounded-[6px] bg-[#111114] px-2 py-1 text-[11px] text-white">Harvard</span>

      <motion.div
        role="slider"
        tabIndex={0}
        aria-label="Compare the Modern and Harvard CV layouts"
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuenow={aria}
        aria-valuetext={`${aria}% Modern`}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          const v = Math.min(96, Math.max(4, x.get() + (e.key === "ArrowLeft" ? -5 : 5)));
          x.set(v);
          setAria(Math.round(v));
        }}
        className="absolute inset-y-0 z-10 -ml-5 flex w-10 justify-center focus-visible:outline-offset-[-6px]"
        style={{ left }}
      >
        <span className="h-full w-px bg-[#111114]/70" />
        <span className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-[0_6px_18px_-6px_rgb(0_0_0/0.5)]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M5 3 1.5 7 5 11M9 3l3.5 4L9 11" stroke="#111114" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </motion.div>
    </div>
  );
}

function ModernCv() {
  return (
    <div className="h-full px-8 pt-12 text-[#111114] sm:px-10">
      <div className="border-b-2 border-[#111114] pb-3">
        <p className="text-[22px] font-bold tracking-[-0.02em]">Basel Mahmoud</p>
        <p className="text-[12.5px] text-[#3a3a40]">Full-stack engineer</p>
        <p className="font-mono mt-1.5 text-[11px] text-[#6b6b73]">Amman, Jordan · GitHub: github.com/basel-mahmoud</p>
      </div>
      <p className="font-mono mt-4 border-b border-[#e3e3e6] pb-1.5 text-[11px] uppercase tracking-[0.16em] text-[#6b6b73]">Experience</p>
      <div className="mt-2.5 flex justify-between gap-4 text-[12px]">
        <b>
          Full-stack engineer · <span className="font-normal text-[#3a3a40]">Independent</span>
        </b>
        <span className="font-mono whitespace-nowrap text-[11px] text-[#6b6b73]">Jun 2024 - Present</span>
      </div>
      <p className="mt-1 max-w-[62ch] text-[12px] leading-relaxed text-[#3a3a40]">
        Design, build and ship end-to-end products: typed APIs, Postgres data models, auth, payments and CI/CD on Vercel.
      </p>
      <div className="mt-2.5 flex justify-between gap-4 text-[12px]">
        <b>
          Frontend developer · <span className="font-normal text-[#3a3a40]">Freelance</span>
        </b>
        <span className="font-mono whitespace-nowrap text-[11px] text-[#6b6b73]">Jan 2023 - May 2024</span>
      </div>
    </div>
  );
}

function HarvardCv() {
  return (
    <div className="h-full bg-white px-8 pt-12 text-black sm:px-10" style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
      <div className="text-center">
        <p className="text-[19px] font-bold">Basel Mahmoud</p>
        <p className="text-[11px]">Amman, Jordan • github.com/basel-mahmoud • hello@basel.dev</p>
      </div>
      <p className="mt-4 border-b border-black pb-0.5 text-[11px] font-bold uppercase tracking-[1px]">Education</p>
      <div className="mt-1.5 flex justify-between text-[12px]">
        <b>University of Jordan</b>
        <span>2020 - 2024</span>
      </div>
      <p className="text-[12px] italic">B.Sc. Computer Science</p>
      <p className="mt-3 border-b border-black pb-0.5 text-[11px] font-bold uppercase tracking-[1px]">Experience</p>
      <div className="mt-1.5 flex justify-between text-[12px]">
        <b>Independent</b>
        <span>Jun 2024 - Present</span>
      </div>
      <p className="text-[12px] italic">Full-stack engineer</p>
      <ul className="mt-0.5 max-w-[62ch] list-disc pl-5 text-[12px] leading-snug">
        <li>Design, build and ship end-to-end products: typed APIs, Postgres data models, auth, payments and CI/CD on Vercel.</li>
      </ul>
    </div>
  );
}
