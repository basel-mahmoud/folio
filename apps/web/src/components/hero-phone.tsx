"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DeviceFrame } from "@/components/device";
import { FlickeringGrid } from "@/components/motion/flickering-grid";
import { useInView } from "@/components/motion/in-view";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

const Phone3D = dynamic(() => import("@/components/phone-3d"), { ssr: false });

/**
 * Contains every 3D failure (renderer creation, texture load, lazy chunk load)
 * to the stage. R3F rethrows scene errors during render; without this boundary
 * they would take down the whole page instead of falling back to the flat frame.
 */
class ThreeBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Hero product stage. The flat device frame renders first (SSR, LCP-friendly,
 * and the permanent fallback without WebGL). When WebGL is available the 3D
 * phone loads lazily and blur-crossfades over it once its texture is ready.
 * The canvas stops rendering whenever the stage is off-screen.
 */
export function HeroPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { margin: "120px" });
  const [webgl, setWebgl] = useState(false);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => setLost(true), []);
  const live = ready && !lost;

  useEffect(() => {
    try {
      // three r186 renders with WebGL2 only; release the probe context right away.
      const gl = document.createElement("canvas").getContext("webgl2");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time capability probe
      setWebgl(!!gl);
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
      {/* Pixel field behind the product — texture, masked to the stage. */}
      <FlickeringGrid
        className="absolute inset-[-12%] [mask-image:radial-gradient(closest-side,#000_35%,transparent)]"
        maxOpacity={0.14}
      />
      {/* Contact shadow: offset below the phone, soft — depth, not glow. */}
      <div aria-hidden className="absolute bottom-[7%] left-1/2 h-10 w-[42%] -translate-x-1/2 rounded-[50%] bg-black blur-2xl" />

      <div
        className={`absolute inset-0 flex items-center justify-center transition-[opacity,filter,transform] duration-700 ease-[var(--ease-out)] ${
          live ? "scale-[0.97] opacity-0 blur-md" : "opacity-100"
        }`}
        aria-hidden={live}
      >
        <div className="w-[48%]">
          <DeviceFrame
            src="/app/home.png"
            alt="The Folio app home screen: a circular completeness ring at 100%, identity card, and section checklist"
            priority
            maxWidth={999}
            sizes="(max-width: 1024px) 45vw, 260px"
          />
        </div>
      </div>

      {webgl && !lost && (
        <ThreeBoundary onError={onLost}>
          <div className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}>
            <Phone3D reduce={reduce} active={inView} onReady={onReady} onLost={onLost} />
          </div>
        </ThreeBoundary>
      )}

      <p
        className={`font-mono pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-muted transition-opacity delay-1000 duration-700 ${
          live ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        drag to spin
      </p>
    </div>
  );
}
