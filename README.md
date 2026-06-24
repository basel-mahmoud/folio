# Folio

**AI portfolio & CV builder.** Build a live, shareable portfolio in a native
mobile app, let AI polish every word, and tailor your CV to any job in seconds —
then publish a fast, clean page recruiters can open anywhere.

> Monorepo: a **native Expo app** (the builder, shipped as an Android APK) backed
> by a **Next.js API + public web pages** on Vercel. Built by Basel Mahmoud.

---

## Architecture

```
folio/
├─ apps/
│  ├─ mobile/   Expo (React Native) — the builder app → APK via EAS Build
│  └─ web/      Next.js 16 — typed API + public portfolio pages (/u/<handle>) on Vercel
└─ .github/     CI (lint · typecheck · test · audit · build) for both apps
```

You author your portfolio in the **native app**; it’s published to a fast,
accessible **web page** at `folio.app/u/<handle>` that you can share on every
application. AI features (bio polish, project write-ups, CV-to-job tailoring) are
served by the Next.js API and powered by Google Gemini.

## Stack

| Layer        | Choice                                                              |
| ------------ | ------------------------------------------------------------------ |
| Mobile       | Expo SDK 56 · React Native 0.85 · React 19 · Expo Router · Reanimated 4 |
| Web / API    | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript          |
| Data         | Neon Postgres · Drizzle ORM · **forced row-level security**         |
| Auth         | Clerk (email + Google)                                              |
| AI           | Google Gemini 2.5 Flash                                             |
| Design       | Hand-built "mono-utility" system — Inter + JetBrains Mono, layered depth, one cobalt accent |
| Tests / CI   | Vitest · Playwright · GitHub Actions                                |
| Hosting      | Vercel (web) · EAS Build (Android APK)                              |

## Design

A restrained, Linear/Vercel-grade system: layered surfaces with real elevation
(no glow), generous spacing, sharp type hierarchy, and purposeful motion.
Monospace for labels and metadata, Inter for content, a single cobalt accent used
like punctuation. Dark-first, with a light theme.

## Production hardening

Folio is built to a full production-readiness standard — input validation,
forced-RLS multi-tenancy, session/token management, rate limiting, idempotent
mutations, tamper-evident audit logging, PII export/delete, security headers,
tests across the pyramid, and CI gates. Status is tracked per area in
[`PRODUCTION-HARDENING.md`](./PRODUCTION-HARDENING.md) and the decisions in
[`docs/adr`](./docs/adr).

## Run locally

```bash
# Web (API + public pages)
cd apps/web && npm install && npm run dev        # http://localhost:3000

# Mobile (native app)
cd apps/mobile && npm install && npm run start    # Expo — press a for Android, w for web
```

See `apps/web/.env.local.example` for required environment variables.

## Status

Work in progress — built in staged milestones (scaffold → data/RLS → auth →
builder → AI → public web/export → hardening → APK). See commit history.
