# Design

## Theme

Dark-first, near-black. Layered neutral surfaces with hairline borders; a single
cobalt accent that resolves into a cobalt→indigo→mint gradient for the brand's
signature moments. Matches the native app (one identity across app + web).

Color strategy: **Restrained body, Committed accent.** The surface stays neutral and
calm; the gradient carries identity on the mark, primary CTAs, and product imagery,
including the *reflections* on the 3D phone, which is where the gradient lives
instead of in a background blob.

## Color

Tokens (committed in `apps/web/src/app/globals.css`):

- `--bg #09090b` · `--bg-inset #0d0d10`: body / inset
- `--surface #141417` · `--surface-2 #1a1a1f`: raised surfaces
- `--border #26262c` · `--border-strong #33333b`: hairline structure
- `--ink #f7f7f8` · `--ink-dim #c5c5cd` · `--muted #8e8e97` (6.1:1) · `--faint #5c5c65`
  (3:1, decorative glyphs/separators only, never informative text)
- `--accent #5277ff` · `--indigo #8b6cff` · `--mint #43e3c0`
- **Gradient (voice):** `--grad` `#5277ff → #8b6cff → #43e3c0` (135°): the mark, hairlines,
  the progress ring, beams, the phone's studio light.
- **Button fill:** `--grad-cta` `#4665f0 → #5b63f5 → #7457f5`: the cobalt→indigo leg,
  deepened so white text clears AA (≥4.6:1) at every stop, including the hover end.
- **Never** a background blob, never `background-clip: text`, never a glow on buttons.

## Typography

Font variables are set by `next/font` on `<html>`; stacks are spelled out in CSS
(`@theme inline` does not emit `--font-*` at runtime).

- **Mona Sans** (display, `.display`): headlines only. Variable width at 108%, weight
  640, tracking -0.035em, balanced. GitHub's own face: the place the audience's
  work already lives.
- **Inter**: UI + body (app match), 400/500/600.
- **JetBrains Mono**: code, data, metadata, the FOLIO wordmark.
- Display max ~5.4rem; section heads `clamp(2.1rem, 4.6vw, 3.6rem)`. Body ≤ 65ch.
- UI text floor 11px, including inside product miniatures.

## Components

- **3D phone** (`phone-3d.tsx`, React Three Fiber): extruded rounded body, titanium
  frame, clearcoat glass, the real screenshot as an emissive screen, lit by a studio
  environment built from brand-coloured Lightformers (no network HDR). Leans toward
  the cursor, drag to spin with a settling spring. Lazy-loaded; the flat
  `DeviceFrame` renders first (SSR/LCP) and remains the fallback without WebGL or
  after a lost GPU context.
- **Device frame**: near-black bezel with punch-hole around a real screenshot.
- **Gradient button**: `--grad-cta` fill, magnetic pull on fine pointers, `scale(.97)` press.
- **Pinned story**: sticky phone whose screens wipe up (clip-path) as steps advance.
- **Tailor demo**: example output shaped like the real API (score ring, keywords,
  original/tailored toggle). The rewrite only reorders real facts, and it is labelled.
- **Beams**: SVG paths with a gradient dash travelling from the phone to its outputs.
- **CV compare**: drag/keyboard slider between the Modern and Harvard layouts of the same data.
- **Bento**: four cells with different content (real SQL, real sha256 chain, the mark,
  a real screenshot); spotlight border on hover.
- **Marquee**: real Simple Icons marks for the stack, once per page, pauses on hover.

## Layout

Max content width 72rem (6xl), 1.25–1.5rem gutters. Each section uses a different
composition: split hero, marquee, pinned split, centred panel, diagram, bento, closing
panel. No eyebrows, no section numbers.

## Motion

Libraries: `motion` (springs, scroll, layout), CSS (entrances, reveals, beams),
three / @react-three/fiber / drei (hero only).

- **Focal moment:** the hero phone rising and turning into place, then answering the cursor.
- **Entrances:** headline words blur in (CSS keyframes, first paint, no hydration wait).
- **Reveals:** IntersectionObserver toggles a class; the hidden state is gated on
  `html.js`, so content is visible without JS.
- **Continuity:** story screens wipe with clip-path; the tailor text crossfades with blur.
- **Feedback:** press scale, magnetic CTA, spring tilt, cursor-lit borders.
- Easing: `--ease-out cubic-bezier(.23,1,.32,1)`, `--ease-expo cubic-bezier(.16,1,.3,1)`,
  `--ease-in-out cubic-bezier(.77,0,.175,1)`. No bounce except a 0.15 spring on the tab pill.
- Performance: WebGL and canvas stop off-screen; only transform/opacity/filter/clip-path animate.
- **Reduced motion:** travel removed, fades kept; the phone renders static; loops stop.

## Cascade

Custom component classes live in `@layer components`, and the default border colour
in `@layer base`, so Tailwind utilities can always override them. Only animation-state
classes (`.reveal`, `.split`, `.enter`) stay unlayered.
