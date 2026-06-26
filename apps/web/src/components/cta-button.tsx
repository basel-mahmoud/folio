"use client";

import { motion } from "motion/react";

/** Primary gradient action with a spring hover/press — mirrors the app's button. */
export function CtaButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={`btn-grad inline-flex items-center justify-center gap-2 rounded-[11px] px-6 py-3 text-[15px] font-medium ${className}`}
    >
      {children}
    </motion.a>
  );
}
