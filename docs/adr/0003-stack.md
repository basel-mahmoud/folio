# ADR-0003: Technology stack

## Status
Accepted (2026-06-24)

## Decision
- **Mobile:** Expo SDK 56 / React Native (Expo Router, Reanimated 4). Real APK
  via EAS Build; web export available for previewing.
- **Web/API:** Next.js 16 (App Router, Turbopack), React 19, TypeScript strict.
- **DB:** Neon Postgres + Drizzle ORM (typed, parameterized, snake_case).
- **Auth:** Clerk (email code + Google) — managed identity, mobile + web SDKs.
- **AI:** Google Gemini 2.5 Flash via REST (free tier → zero running cost for a
  public demo), JSON response mode.
- **Design:** hand-built "mono-utility" system (Inter + JetBrains Mono, layered
  depth, one cobalt accent), dark-first — deliberately not a component-kit look.
- **Hosting:** Vercel (web) + EAS (APK). **CI:** GitHub Actions.

## Rationale
Managed identity/DB/AI keep ops light while staying production-grade; Gemini's
free tier keeps the live demo free; Expo yields a genuine native artifact for the
portfolio. Trade-off: vendor reliance (Clerk/Neon/Vercel/Google), accepted for a
solo project and isolated behind small service modules.
