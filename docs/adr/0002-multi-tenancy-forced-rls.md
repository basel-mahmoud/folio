# ADR-0002: Multi-tenancy via forced row-level security

## Status
Accepted (2026-06-24)

## Context
Every user's portfolio data must be isolated from every other user's. Relying
only on application-level `where userId = …` filters is one bug away from a
cross-tenant leak.

## Decision
Defence in depth:
1. The data layer always scopes by `userId`.
2. Postgres **RLS is ENABLED and FORCED** on every owned table, with policies
   keyed on `current_setting('app.user_id')`. The runtime role `folio_app` is
   `LOGIN, NOBYPASSRLS`, so policies always apply. Migrations use the owner role.
3. `withUser(userId, fn)` opens a transaction and sets `app.user_id`;
   `withSystem(fn)` sets a bypass GUC for legitimate cross-user reads (public
   pages, seed) and only ever returns `published` data.
4. Child tables denormalise `userId` so policies stay simple and fast.
5. `audit_logs` has only SELECT/INSERT policies under FORCE → append-only.

## Consequences
- A missing app-level filter cannot leak another tenant's rows.
- Verified by `npm run test:rls` (cross-tenant read and write blocked).
- Cross-user features must go through the audited `withSystem` path deliberately.
