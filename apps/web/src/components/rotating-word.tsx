"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a soft fade — used in the hero headline. */
export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => {
        setI((n) => (n + 1) % words.length);
        setVis(true);
      }, 260);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span
      className="text-accent"
      style={{
        display: "inline-block",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(6px)",
        transition: "opacity .25s ease, transform .25s ease",
      }}
    >
      {words[i]}
    </span>
  );
}
