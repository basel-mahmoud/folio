"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { DeviceFrame } from "@/components/device";
import { Reveal } from "@/components/reveal";
import { SplitText } from "@/components/motion/split-text";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

const STEPS = [
  {
    title: "Build it on your phone.",
    body: "Profile, projects, experience and skills in a fast native builder. The completeness ring fills as you go.",
    screen: "/app/home.png",
    name: "Home",
    alt: "Folio home: completeness ring at 100%, identity card, and a checklist of profile sections",
  },
  {
    title: "Let AI sharpen the words.",
    body: "Paste a job description. Gemini scores your fit and rewrites bullets from your real experience, nothing invented.",
    screen: "/app/tailor.png",
    name: "Tailor",
    alt: "Folio Tailor screen: paste a job description or start from a sample role",
  },
  {
    title: "Publish a page that loads fast.",
    body: "Your portfolio goes live at your own handle, ready for every application and your email signature.",
    screen: "/app/preview.png",
    name: "Preview",
    alt: "Folio portfolio preview: name, headline, bio and selected work with tech tags",
  },
  {
    title: "Own every byte.",
    body: "Export everything as JSON or delete your account in one tap. Row-level security keeps your data yours.",
    screen: "/app/profile.png",
    name: "Profile",
    alt: "Folio profile screen: public URL, appearance, export my data, privacy, and delete account",
  },
] as const;

const N = STEPS.length;

export function Story() {
  return (
    <section id="how" className="relative scroll-mt-8">
      <div className="mx-auto max-w-6xl px-5 pt-24 sm:px-6 sm:pt-36">
        <SplitText as="h2" text="Not a description of an app. The app itself." className="display max-w-3xl text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] text-ink" />
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-ink-dim">
            Every screen here is the real product, the same build you install.
          </p>
        </Reveal>
      </div>
      <PinnedStory />
      <StackedStory />
    </section>
  );
}

/** Desktop: the phone pins while the steps advance; screens wipe up in turn. */
function PinnedStory() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const rotateY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-16, 12]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [0, 0, 0] : [6, 2, 6]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let a = 0;
    for (let i = 1; i < N; i++) if (v >= i / N - 0.03) a = i;
    setActive(a);
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((i + 0.35) / N), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div ref={ref} className="relative hidden lg:block" style={{ height: `${N * 75 + 25}vh` }}>
      <div className="sticky top-0 flex h-[100dvh] items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_minmax(0,0.9fr)] items-center gap-16 px-6">
          <ol className="relative pl-8">
            <span aria-hidden className="absolute left-0 top-1 bottom-1 w-px bg-border" />
            <motion.span
              aria-hidden
              className="absolute left-0 top-1 bottom-1 w-px origin-top"
              style={{ scaleY: scrollYProgress, backgroundImage: "linear-gradient(180deg,#5277ff,#8b6cff 55%,#43e3c0)" }}
            />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative py-5">
                <span
                  aria-hidden
                  className={`absolute -left-8 top-[1.95rem] h-px transition-all duration-500 ease-[var(--ease-out)] ${
                    i === active ? "w-5 bg-ink" : "w-2.5 bg-faint"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "step" : undefined}
                  className={`block text-left transition-[opacity,filter] duration-500 ease-[var(--ease-out)] ${
                    i === active ? "opacity-100" : "opacity-35 hover:opacity-60"
                  }`}
                >
                  <span className="display block text-[clamp(1.5rem,2.3vw,2rem)] leading-tight text-ink">{s.title}</span>
                  <span className="mt-2 block max-w-md text-pretty leading-relaxed text-ink-dim">{s.body}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative flex flex-col items-center" style={{ perspective: 1400 }}>
            <div aria-hidden className="dot-field absolute inset-[-10%] [mask-image:radial-gradient(closest-side,#000,transparent)]" />
            <motion.div style={{ rotateY, rotateX, transformStyle: "preserve-3d" }} className="relative w-[min(300px,34vh)]">
              <DeviceFrame src={STEPS[0].screen} alt={STEPS[0].alt} maxWidth={320} sizes="300px">
                {STEPS.slice(1).map((s, k) => (
                  <ScreenLayer key={s.screen} index={k + 1} progress={scrollYProgress} src={s.screen} alt={s.alt} />
                ))}
              </DeviceFrame>
            </motion.div>
            <p className="font-mono mt-7 h-5 text-xs text-muted" aria-live="polite">
              <span className="text-muted/70">screen </span>
              {STEPS[active].name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One screenshot layer that wipes up (clip-path) as its step arrives. */
function ScreenLayer({ index, progress, src, alt }: { index: number; progress: MotionValue<number>; src: string; alt: string }) {
  const b = index / N;
  const range = [b - 0.08, b + 0.01];
  const clipPath = useTransform(progress, range, ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(progress, range, [1.08, 1]);
  return (
    <motion.div className="absolute inset-0" style={{ clipPath }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image src={src} alt={alt} fill sizes="300px" className="object-cover object-top" />
      </motion.div>
    </motion.div>
  );
}

/** Mobile/tablet: plain stacked steps, each with its own screen. No pinning. */
function StackedStory() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 lg:hidden">
      <div className="mt-14 grid gap-16 sm:grid-cols-2 sm:gap-x-10">
        {STEPS.map((s) => (
          <Reveal key={s.title}>
            <DeviceFrame src={s.screen} alt={s.alt} maxWidth={250} sizes="250px" />
            <h3 className="display mt-8 text-2xl text-ink">{s.title}</h3>
            <p className="mt-2 text-pretty leading-relaxed text-ink-dim">{s.body}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
