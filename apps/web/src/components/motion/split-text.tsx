"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Word-by-word blur-in (after React Bits' BlurText / Magic UI's TextAnimate).
 * Pure CSS so it runs off the main thread and needs no hydration to play:
 *  - trigger="mount": keyframes on first paint (hero).
 *  - trigger="view":  transitions when scrolled into view (section heads).
 * The words are real text in the DOM. `\n` forces a line break.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  trigger = "view",
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  trigger?: "mount" | "view";
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (trigger !== "view") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [trigger]);

  let i = 0;
  const lines = text.split("\n");
  const children = lines.map((line, li) => (
    <span key={li}>
      {li > 0 && <br />}
      {line.split(" ").map((word, wi) => {
        const style = { "--i": i++, "--d": `${delay}s`, "--s": `${stagger}s` } as CSSProperties;
        return (
          <span key={wi}>
            {wi > 0 && " "}
            <span className="split-word" style={style}>
              {word}
            </span>
          </span>
        );
      })}
    </span>
  ));
  // Any of the allowed tags; typed as one intrinsic so JSX accepts the ref.
  const Comp = Tag as "span";
  return (
    <Comp ref={ref} className={`split${shown ? " in" : ""}${className ? " " + className : ""}`} data-trigger={trigger}>
      {children}
    </Comp>
  );
}
