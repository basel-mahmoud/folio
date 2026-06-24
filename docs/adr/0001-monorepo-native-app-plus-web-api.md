# ADR-0001: Native Expo app + Next.js API/web in one monorepo

## Status
Accepted (2026-06-24)

## Context
Folio must be an installable mobile app (APK) **and** deploy to Vercel, while
portfolios need a shareable, recruiter-friendly web URL. A native-only app can't
serve public web pages; a web-only app isn't an APK.

## Decision
A monorepo with two standalone apps:
- `apps/mobile` — Expo / React Native = the builder, shipped as an APK via EAS.
- `apps/web` — Next.js 16 on Vercel = the typed API **and** the public
  `/u/[handle]` pages, CV export, and OG images.

The apps are installed independently (no workspace hoisting) for build
reliability with Metro; they share contracts by convention (OpenAPI + mirrored
types) rather than a shared npm package.

## Consequences
- One repo, one Vercel pipeline; the hardened backend is reused by both clients.
- Recruiters open a fast web page; the user edits in a native app.
- Slight type duplication across the API boundary (mitigated by `openapi.yaml`).
