"use client";

import { Download, ArrowRight } from "lucide-react";
import { motion, MotionConfig, type Variants } from "motion/react";
import { RotatingWord } from "@/components/rotating-word";
import { Device } from "@/components/device";
import { CtaButton } from "@/components/cta-button";

const ease = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};
const phone: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease, delay: 0.25 },
  },
};

export function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pt-16 pb-12 sm:pt-24 lg:grid-cols-12 lg:gap-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-7"
        >
          <motion.h1
            variants={item}
            className="text-balance text-[clamp(2.6rem,7vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink"
          >
            Your work,
            <br />
            presented with intent.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md text-pretty text-base leading-relaxed text-ink-dim sm:text-lg"
          >
            Build a live portfolio in a native app, let AI sharpen every word, and
            tailor your CV — Modern or Harvard — to any job.
          </motion.p>

          <motion.p variants={item} className="font-mono mt-4 text-sm text-muted">
            Made for{" "}
            <RotatingWord
              words={[
                "software engineers",
                "designers",
                "new grads",
                "career switchers",
                "product managers",
              ]}
            />
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <CtaButton href="/download" className="w-full sm:w-auto">
              <Download size={17} /> Download the app
            </CtaButton>
            <motion.a
              href="/u/basel"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[11px] border border-border-strong px-6 py-3 text-[15px] text-ink transition-colors hover:bg-surface-2 sm:w-auto"
            >
              See a live example <ArrowRight size={16} className="text-muted" />
            </motion.a>
          </motion.div>

          <motion.p variants={item} className="font-mono mt-4 text-xs text-faint">
            Android APK · free · export anytime
          </motion.p>
        </motion.div>

        <motion.div
          variants={phone}
          initial="hidden"
          animate="show"
          className="lg:col-span-5"
        >
          <Device
            src="/app/home.png"
            alt="The Folio app home screen — a circular completeness ring at 100%, identity card, and section checklist"
            float
            priority
            maxWidth={288}
          />
        </motion.div>
      </section>
    </MotionConfig>
  );
}
