"use client";

import { useEffect, useRef } from "react";

/**
 * A field of tiny squares that flicker like idle pixels (after Magic UI's
 * FlickeringGrid). Neutral ink with a rare brand-coloured pixel. Canvas work is
 * throttled to ~30fps, paused off-screen/hidden, and static under reduced motion.
 */
export function FlickeringGrid({
  squareSize = 3,
  gridGap = 7,
  flickerChance = 0.35,
  maxOpacity = 0.16,
  className = "",
}: {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  maxOpacity?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PALETTE = ["247,247,248", "82,119,255", "139,108,255", "67,227,192"];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let alpha = new Float32Array(0);
    let tint = new Uint8Array(0);
    let raf = 0;
    let last = 0;
    let visible = false;

    const seed = (k: number) => {
      alpha[k] = Math.random() * maxOpacity;
      const r = Math.random();
      tint[k] = r < 0.93 ? 0 : r < 0.955 ? 1 : r < 0.98 ? 2 : 3;
    };

    const setup = () => {
      const { width, height } = wrap.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const step = squareSize + gridGap;
      cols = Math.ceil(width / step);
      rows = Math.ceil(height / step);
      alpha = new Float32Array(cols * rows);
      tint = new Uint8Array(cols * rows);
      for (let k = 0; k < alpha.length; k++) seed(k);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const step = (squareSize + gridGap) * dpr;
      const s = squareSize * dpr;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const k = c * rows + r;
          const t = tint[k];
          // Brand pixels read a little brighter than the neutral field.
          const a = t === 0 ? alpha[k] : Math.min(1, alpha[k] * 3.2);
          ctx.fillStyle = `rgba(${PALETTE[t]},${a})`;
          ctx.fillRect(c * step, r * step, s, s);
        }
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = now - last;
      if (dt < 33) return;
      last = now;
      const p = flickerChance * (dt / 1000);
      for (let k = 0; k < alpha.length; k++) if (Math.random() < p) seed(k);
      draw();
    };

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    draw();

    const ro = new ResizeObserver(() => {
      setup();
      draw();
    });
    ro.observe(wrap);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [squareSize, gridGap, flickerChance, maxOpacity]);

  return (
    <div ref={wrapRef} aria-hidden className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
