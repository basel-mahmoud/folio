# Design

## Theme

Dark-first, near-black. Layered neutral surfaces with hairline borders; a single
cobalt accent that resolves into a cobalt→indigo→mint gradient for the brand's
signature moments. Matches the native app exactly (one identity across app + web).

Color strategy: **Restrained body, Committed accent.** The surface stays neutral and
calm; the gradient carries identity on the mark, primary CTAs, and product imagery.

## Color

Tokens (OKLCH-equivalent hex, committed in `globals.css`):

- `--bg #09090b` · `--bg-inset #0d0d10` — body / inset
- `--surface #141417` · `--surface-2 #1a1a1f` — raised surfaces
- `--border #26262c` · `--border-strong #33333b` — hairline structure
- `--ink #f7f7f8` · `--ink-dim #c5c5cd` · `--muted #86868f` · `--faint #56565e` — text ramp
- `--accent #5277ff` · `--accent-ink #ffffff`
- **Gradient (voice):** `#5277ff → #8b6cff → #43e3c0` (135°). Used on the logo,
  primary buttons, the progress-ring motif, and a thin top hairline. **Never** as a
  background blob or as `background-clip: text`.

Contrast: `--ink` and `--ink-dim` clear AA on `--bg`; `--muted` for ≥14px/labels only.

## Typography

- **Inter** (sans) — UI + body, weights 400/500/600.
- **JetBrains Mono** — labels, metadata, code-credibility moments, the FOLIO wordmark.
- Established identity → kept (no reflex-reject; these already ship on app + web).
- Display headings: fluid `clamp()`, max ≤ ~5rem, letter-spacing -0.02 to -0.03em,
  `text-wrap: balance`. Body measure ≤ 70ch, `text-wrap: pretty`.

## Components

- **Logo** — folded-page F mark (SVG), flat cobalt + dark flap + white F.
- **Device frame** — rounded near-black bezel around a real app screenshot.
- **Gradient button** — primary CTA, cobalt→indigo fill, spring hover.
- **Feature row** — alternating copy + device/asset; not an icon-card grid.
- **Marquee** — mono tech credits, slow linear scroll.

## Layout

Max content width ~64rem (5xl), 1.5rem gutters. Fluid vertical rhythm with `clamp()`;
sections vary between centered, split, and asymmetric — no single repeated template.

## Motion

Library: **`motion`** (Motion for React, installed). Plus CSS for scroll reveals.

- **Hero:** orchestrated mount entrance (staggered lines → subcopy → CTAs → device).
  Mount-time, never visibility-gated.
- **Device:** gentle continuous float + scroll parallax (`useScroll`/`useTransform`,
  transform-only).
- **Interactions:** spring hover on buttons/cards (mirrors the app's spring-press).
- **Section reveals:** IntersectionObserver + CSS (`.reveal`) — content is in the DOM
  and only fades/lifts in (reliable in the Next 16 prod build; `whileInView` is not).
- Easing: ease-out expo `cubic-bezier(0.16,1,0.3,1)`. No bounce/elastic.
- Every effect has a `prefers-reduced-motion: reduce` fallback.
