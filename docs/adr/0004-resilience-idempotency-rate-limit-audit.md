# ADR-0004: Resilience — idempotency, rate limiting, audit, DR

## Status
Accepted (2026-06-24)

## Decision
- **Idempotency:** mutating API calls accept an `Idempotency-Key`; the first run
  is stored and replays return the stored response (different body = 409). The
  mobile client sends a key on every mutation, so retries are safe.
- **Retry + backoff:** the client retries transient failures (network, 429, 5xx)
  with exponential backoff + jitter, honouring `Retry-After`.
- **Circuit breaker:** a process-local breaker trips after consecutive Gemini
  failures and fails fast for a cooldown, then half-opens.
- **Rate limiting:** DB-backed fixed-window counters per user (atomic upsert),
  stricter on AI endpoints.
- **Concurrency:** atomic upserts; `onConflictDoNothing` idempotency claims;
  `pg_advisory_xact_lock` serialises audit-chain appends.
- **Audit:** per-user SHA-256 hash chain, append-only via RLS.
- **DR / RTO / RPO:** Neon point-in-time restore + branching (RPO ≈ minutes);
  Vercel immutable deployments give instant rollback (RTO ≈ minutes). Restore
  drills are a documented follow-up.

## Consequences
Failures degrade gracefully and retries don't double-write; the audit log is
tamper-evident; recovery leans on platform capabilities (documented, not bespoke).
