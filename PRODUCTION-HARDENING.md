# Production hardening — Folio

Status of every production-readiness item. Honest about what is **code**,
**platform-provided**, **docs/process**, or **not-yet-complete**.

Legend: ✅ done · 🟡 partial / documented · ⬜ planned

## Security

| Item | Status | Notes |
| --- | --- | --- |
| Input sanitization & injection prevention | ✅ | All mutations validated with Zod (`lib/validation.ts`), control-chars stripped + whitespace collapsed; Drizzle uses parameterized queries everywhere. |
| Authentication | ✅ | Clerk (email code + Google). Web = cookie session; mobile = `Authorization: Bearer <session jwt>`. |
| Authorization, roles & permissions | ✅ | Tenant = user. Ownership enforced by Postgres **forced RLS** on `app.user_id`; runtime DB role `folio_app` is `LOGIN, NOBYPASSRLS` (least privilege). |
| Session management & token expiry | ✅ | Clerk short-lived session JWTs with refresh + revoke; device tokens in OS secure store (Keychain/Keystore). |
| Secrets management | ✅ | Secrets in env only; `.env*` gitignored; Vercel encrypted env vars; no secrets in client bundle or repo. |
| HTTPS / TLS / encryption in transit & at rest | ✅ | TLS on Vercel + Neon (`sslmode=require`); Neon encrypts at rest; device secure store encrypts tokens at rest. |
| Rate limiting & abuse prevention | ✅ | DB-backed fixed-window limiter per user; stricter windows on AI routes. |
| Dependency scanning & patching | ✅ | CI runs `npm audit --omit=dev --audit-level=high` (blocks); Dependabot weekly (npm + actions). |
| Multi-tenancy & data isolation | ✅ | Forced RLS + scoped queries; proven by `npm run test:rls` (cross-tenant read **and** write blocked). |
| PII handling, retention & deletion | ✅ | Minimal PII (name/headline/bio/links/email). Self-serve export (`GET /api/me/export`) + account erase (`DELETE /api/me`, cascades + deletes Clerk identity). Retention: kept until the user deletes. |
| Regulatory compliance (GDPR-style) | 🟡 | Export + erase + privacy/terms pages shipped. Formal DPA/record-of-processing is out of scope for a personal project. |
| Audit trails & tamper-evident logging | ✅ | Per-user SHA-256 **hash chain** (`services/audit.ts`), append-only (RLS allows only SELECT/INSERT under FORCE); advisory lock serializes appends. `verifyChain()` detects tampering. |
| Security headers (CSP/HSTS/etc.) | ✅ | Set in `next.config.ts` (CSP, HSTS preload, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy). |

## Testing & CI

| Item | Status | Notes |
| --- | --- | --- |
| Unit tests | ✅ | Vitest: validation, ids, audit hash-chain. |
| Integration tests | 🟡 | `verify-rls` exercises the DB + RLS end-to-end; broader API integration tests are planned. |
| End-to-end tests | 🟡 | Playwright smoke on the public page + CV (`e2e/`). Mobile e2e (Maestro/Detox) planned. |
| Regression tests | ✅ | The full suite runs in CI on every push/PR, guarding regressions. |
| Load & stress testing | ✅ | `npm run loadtest` drives concurrent requests at the public API and reports latency percentiles. Not wired into CI. |
| Chaos / resilience testing | 🟡 | Retry/backoff + circuit breaker implemented and unit-reasoned; formal fault injection planned. |
| Test discovery, schedule, CI enforcement | ✅ | GitHub Actions: lint → typecheck → unit/integration → audit → build for both apps; failures block merge. |
| Code review process & standards | ✅ | ESLint + `tsc` strict + conventions; `AGENTS.md` documents framework rules; PR-based review. |

## Reliability & resilience

| Item | Status | Notes |
| --- | --- | --- |
| Error handling & graceful degradation | ✅ | Central API error→status mapping; AI failures return 503 and the UI degrades; loading/empty states throughout. |
| Retry with backoff + idempotency | ✅ | Mobile client retries idempotent failures (backoff + jitter, honours `Retry-After`) and sends an `Idempotency-Key` on every mutation; server stores + replays via `withIdempotency`. |
| Circuit breakers & fallback | ✅ | Process-local breaker around Gemini; demo provider is the fallback when AI/auth unconfigured. |
| Concurrency & race-condition prevention | ✅ | Atomic upsert for rate limits; `onConflictDoNothing` idempotency claim; `pg_advisory_xact_lock` serialises audit appends. |
| Caching strategy & invalidation | ✅ | AI generations cached by SHA-256 of inputs in `ai_generations`; a changed input is a new key (natural invalidation). |
| RTO / RPO, DR, backups | 🟡 | Neon provides PITR + branching (RPO ≈ minutes); Vercel immutable deploys enable instant rollback (RTO ≈ minutes). See ADR-0004. Periodic restore drills planned. |

## Architecture & docs

| Item | Status | Notes |
| --- | --- | --- |
| Accessibility (WCAG) | 🟡 | Semantic HTML, visible focus, `prefers-reduced-motion`, AA-targeted contrast, labelled controls. A formal WCAG 2.1 AA audit is planned. |
| ADRs | ✅ | `docs/adr/`. |
| Architecture diagrams | ✅ | `docs/ARCHITECTURE.md`. |
| API contracts | ✅ | `docs/openapi.yaml` (OpenAPI 3.1). |

## Known gaps / next

- Broader API integration + mobile e2e coverage.
- Formal WCAG audit and chaos/fault-injection drills.
- Nonce-based CSP (currently allows `'unsafe-inline'`/`https:` so Clerk + image CDNs work).
- `middleware.ts` kept (Next 16 prefers `proxy.ts`) because Clerk's middleware integration targets that filename; tracked upstream.
