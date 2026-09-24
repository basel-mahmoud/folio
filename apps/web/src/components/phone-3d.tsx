"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * A real 3D phone rendered with React Three Fiber. The screen is the actual app
 * screenshot; the titanium frame and glass pick up a studio environment built
 * from cobalt / indigo / mint light strips, so the brand gradient lives in the
 * product's reflections instead of in a background blob.
 *
 * Interaction: the phone leans toward the cursor (damped), and can be dragged
 * to spin; it coasts on release and settles facing front.
 */

// Physical proportions (units ≈ 71mm-wide phone scaled to 1.0).
const W = 1;
const H = 2.09;
const D = 0.11;
const R = 0.15;
const BEVEL = 0.03;
// Screen matches the screenshot aspect (402 × 874).
const SW = 0.9;
const SH = SW * (874 / 402);
const SR = 0.105;

const TAU = Math.PI * 2;
const BASE_Y = -0.32; // resting yaw: shows the right edge so it reads as an object
const BASE_X = 0.05;

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Flat rounded-rect geometry with UVs remapped to 0..1 across its bounds. */
function planeGeometry(w: number, h: number, r: number) {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 32);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  uv.needsUpdate = true;
  return g;
}

function Phone({ screen, reduce, onReady }: { screen: string; reduce: boolean; onReady?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { gl, invalidate } = useThree();
  const tex = useTexture(screen, (t) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    t.needsUpdate = true;
  });
  const pointer = useRef({ x: 0, y: 0 });
  const tilt = useRef({ x: 0, y: 0 });
  // Seconds of entrance played so far. Accumulated from frame deltas (not the
  // R3F clock, which resets to 0 whenever the frameloop toggles off-screen).
  const intro = useRef(reduce ? Infinity : 0);
  // Drag-to-spin state. Velocity is rad/s; on release a spring settles the angle.
  const drag = useRef({ active: false, lastX: 0, lastT: 0 });
  const spin = useRef({ angle: 0, vel: 0 });
  // R3F calls a group handler once per intersected child mesh; handle each native event once.
  const lastNative = useRef<Event | null>(null);
  // Native end-of-drag listener: R3F never delivers pointercancel to objects, so a
  // touch swipe that turns into a page scroll would otherwise leave the drag stuck.
  const endDrag = useRef<((ev: PointerEvent) => void) | null>(null);

  const stopListening = () => {
    if (!endDrag.current) return;
    window.removeEventListener("pointerup", endDrag.current);
    window.removeEventListener("pointercancel", endDrag.current);
    endDrag.current = null;
  };

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    drag.current = { active: true, lastX: e.clientX, lastT: performance.now() };
    (e.target as unknown as Element).setPointerCapture?.(e.pointerId);
    document.body.style.cursor = "grabbing";
    stopListening();
    const id = e.pointerId;
    endDrag.current = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return;
      drag.current.active = false;
      document.body.style.cursor = "";
      stopListening();
      invalidate();
    };
    window.addEventListener("pointerup", endDrag.current);
    window.addEventListener("pointercancel", endDrag.current);
  };
  const onMoveDrag = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current;
    if (!d.active || e.nativeEvent === lastNative.current) return;
    lastNative.current = e.nativeEvent;
    const now = performance.now();
    const delta = (e.clientX - d.lastX) * 0.012;
    spin.current.angle += delta;
    spin.current.vel = THREE.MathUtils.clamp(delta / (Math.max(1, now - d.lastT) / 1000), -18, 18);
    d.lastX = e.clientX;
    d.lastT = now;
    invalidate();
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    drag.current.active = false;
    (e.target as unknown as Element).releasePointerCapture?.(e.pointerId);
    document.body.style.cursor = "";
    stopListening();
    invalidate();
  };

  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(W - 2 * BEVEL, H - 2 * BEVEL, R - BEVEL), {
      depth: D - 2 * BEVEL,
      bevelEnabled: true,
      bevelThickness: BEVEL,
      bevelSize: BEVEL,
      bevelSegments: 10,
      curveSegments: 40,
    });
    g.center();
    return g;
  }, []);
  const glass = useMemo(() => planeGeometry(W - 2 * BEVEL - 0.004, H - 2 * BEVEL - 0.004, R - BEVEL), []);
  const display = useMemo(() => planeGeometry(SW, SH, SR), []);
  const island = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(0.34, 0.34, 0.09), {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 4,
      curveSegments: 24,
    });
    g.center();
    return g;
  }, []);

  useEffect(() => {
    onReady?.();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (endDrag.current) {
        window.removeEventListener("pointerup", endDrag.current);
        window.removeEventListener("pointercancel", endDrag.current);
      }
      document.body.style.cursor = "";
    };
  }, [onReady, reduce]);

  useFrame((state, rawDt) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDt, 1 / 20);
    const t = state.clock.elapsedTime;

    // Damped lean toward the cursor.
    const k = 1 - Math.exp(-dt * 4);
    tilt.current.x += (pointer.current.y * 0.32 - tilt.current.x) * k;
    tilt.current.y += (pointer.current.x * 0.55 - tilt.current.y) * k;

    // Spin: drag sets velocity; on release a spring settles on the nearest turn.
    const s = spin.current;
    if (!drag.current.active) {
      const target = Math.round(s.angle / TAU) * TAU;
      s.vel += ((target - s.angle) * 26 - s.vel * 7) * dt;
      s.angle += s.vel * dt;
    }

    // Mount entrance: rises and turns into its resting pose (ease-out expo).
    // Unclamped deltas keep it wall-clock paced even if the first frames are slow.
    if (intro.current < 1.8) intro.current += rawDt;
    const p = Math.min(1, intro.current / 1.8);
    const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

    const float = reduce ? 0 : Math.sin(t * 0.9) * 0.045;
    g.position.y = float - (1 - e) * 0.55;
    g.rotation.y = BASE_Y + tilt.current.y + s.angle - (1 - e) * 1.25;
    g.rotation.x = BASE_X + tilt.current.x + (1 - e) * 0.25;
    g.rotation.z = reduce ? 0 : Math.sin(t * 0.6) * 0.018;
    const sc = 0.92 + 0.08 * e;
    g.scale.setScalar(sc);

    if (reduce && (drag.current.active || Math.abs(s.vel) > 0.001 || Math.abs(s.angle % TAU) > 0.001)) invalidate();
  });

  const frame = (
    <meshPhysicalMaterial color="#c4c4cf" metalness={1} roughness={0.2} clearcoat={0.4} clearcoatRoughness={0.2} envMapIntensity={1.15} />
  );

  return (
    <group
      ref={group}
      onPointerDown={onDown}
      onPointerMove={onMoveDrag}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerOver={() => (document.body.style.cursor = drag.current.active ? "grabbing" : "grab")}
      onPointerOut={() => !drag.current.active && (document.body.style.cursor = "")}
    >
      {/* Body: caps (front/back) get the matte back glass, sides are polished titanium. */}
      <mesh geometry={body}>
        <meshPhysicalMaterial attach="material-0" color="#16161b" metalness={0.35} roughness={0.42} clearcoat={0.8} clearcoatRoughness={0.25} envMapIntensity={0.9} />
        <meshPhysicalMaterial attach="material-1" color="#c4c4cf" metalness={1} roughness={0.2} clearcoat={0.4} clearcoatRoughness={0.2} envMapIntensity={1.15} />
      </mesh>

      {/* Front glass (black bezel) with a clearcoat sheen. */}
      <mesh geometry={glass} position={[0, 0, D / 2 + 0.0006]}>
        <meshPhysicalMaterial color="#030304" metalness={0} roughness={0.08} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={0.6} />
      </mesh>

      {/* Display: the real screenshot, emissive (true colours) with a faint glass reflection. */}
      <mesh geometry={display} position={[0, 0, D / 2 + 0.0014]}>
        <meshStandardMaterial
          color="#000000"
          emissive="#ffffff"
          emissiveMap={tex}
          emissiveIntensity={1}
          roughness={0.14}
          metalness={0}
          envMapIntensity={0.45}
          toneMapped={false}
        />
      </mesh>

      {/* Punch-hole camera. */}
      <mesh position={[0, SH / 2 - 0.036, D / 2 + 0.0022]}>
        <circleGeometry args={[0.017, 32]} />
        <meshStandardMaterial color="#000" roughness={0.1} />
      </mesh>

      {/* Side keys (right edge). */}
      <RoundedBox args={[0.018, 0.24, 0.045]} radius={0.008} position={[W / 2 + 0.004, 0.46, 0]}>
        {frame}
      </RoundedBox>
      <RoundedBox args={[0.018, 0.13, 0.045]} radius={0.008} position={[W / 2 + 0.004, 0.14, 0]}>
        {frame}
      </RoundedBox>

      {/* Camera island on the back (top-left when seen from behind). */}
      <group position={[W / 2 - 0.24, H / 2 - 0.25, -D / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <mesh geometry={island}>
          <meshPhysicalMaterial color="#1c1c22" metalness={0.6} roughness={0.3} clearcoat={1} envMapIntensity={1} />
        </mesh>
        {[
          [-0.075, 0.075],
          [0.075, -0.075],
          [-0.075, -0.075],
        ].map(([x, y], i) => (
          <group key={i} position={[x, y, 0.014]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.058, 0.058, 0.012, 40]} />
              <meshPhysicalMaterial color="#9a9aa6" metalness={1} roughness={0.25} envMapIntensity={1.2} />
            </mesh>
            <mesh position={[0, 0, 0.0065]}>
              <circleGeometry args={[0.044, 40]} />
              <meshPhysicalMaterial color="#05060a" metalness={0.2} roughness={0.05} clearcoat={1} envMapIntensity={1.4} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.075, 0.075, 0.009]}>
          <circleGeometry args={[0.022, 24]} />
          <meshStandardMaterial color="#e8e2d0" emissive="#3a362c" roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}

/** Studio light built from the brand trio — no network HDR, rendered once. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={4} color="#5277ff" position={[-4, 1.5, 2.5]} scale={[1.4, 7, 1]} />
      <Lightformer form="rect" intensity={3} color="#8b6cff" position={[0, 5, 1.5]} scale={[7, 1.2, 1]} />
      <Lightformer form="rect" intensity={3.5} color="#43e3c0" position={[4, -1, 2.5]} scale={[1.2, 6, 1]} />
      <Lightformer form="ring" intensity={1.6} color="#ffffff" position={[1.5, 1.5, 5]} scale={1.6} />
      <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, -5, -2]} scale={[8, 1, 1]} />
      <Lightformer form="rect" intensity={2} color="#5277ff" position={[0, 0, -5]} scale={[6, 6, 1]} />
    </Environment>
  );
}

export default function Phone3D({
  screen = "/app/home.png",
  reduce = false,
  active = true,
  onReady,
  onLost,
}: {
  screen?: string;
  reduce?: boolean;
  active?: boolean;
  onReady?: () => void;
  /** GPU context lost (driver reset, memory pressure, dev strict-mode remount). */
  onLost?: () => void;
}) {
  return (
    <Canvas
      style={{ touchAction: "pan-y" }}
      dpr={[1, 2]}
      frameloop={!active ? "never" : reduce ? "demand" : "always"}
      camera={{ position: [0, 0, 4.6], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={(state) => {
        const { gl } = state;
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", () => onLost?.(), { once: true });
        gl.domElement.setAttribute("role", "img");
        gl.domElement.setAttribute(
          "aria-label",
          "A 3D Folio phone showing the app's home screen: a completeness ring, identity card and section checklist. Drag to spin.",
        );
      }}
    >
      <ambientLight intensity={0.15} />
      <Studio />
      <Phone screen={screen} reduce={reduce} onReady={onReady} />
    </Canvas>
  );
}
