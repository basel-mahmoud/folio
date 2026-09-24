"use client";

/**
 * Cursor-tracked light on the card's 1px border (after Magic UI's MagicCard /
 * React Bits' SpotlightCard). Writes CSS vars directly; no re-render.
 */
export function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`spotlight ${className}`}
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
