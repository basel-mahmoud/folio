/**
 * Neon-backed Drizzle client with row-level-security context helpers.
 *
 * Tenant isolation is defence-in-depth:
 *   1. The data layer always scopes by userId.
 *   2. Postgres RLS (FORCED) restricts rows to the acting user, read from
 *      `current_setting('app.user_id')`.
 *
 * `withUser` runs work inside a transaction that pins the acting Clerk user id,
 * so RLS policies evaluate against the real owner. `withSystem` sets a bypass
 * GUC for legitimately cross-user work (public pages, webhooks, schedulers).
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import ws from "ws";
import * as schema from "./schema";
import { serverEnv } from "@/lib/env";

if (typeof globalThis.WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws as unknown as typeof WebSocket;
}

export type Db = NeonDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  _folioPool?: Pool;
  _folioDb?: Db;
};

function getDb(): Db {
  if (globalForDb._folioDb) return globalForDb._folioDb;
  const pool =
    globalForDb._folioPool ??
    new Pool({
      // Prefer the non-bypassing runtime role so RLS is enforced; fall back to
      // the default connection where the app role isn't provisioned.
      connectionString: serverEnv().APP_DATABASE_URL ?? serverEnv().DATABASE_URL,
    });
  globalForDb._folioPool = pool;
  globalForDb._folioDb = drizzle(pool, { schema });
  return globalForDb._folioDb;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb() as unknown as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

/** Run `fn` as the given Clerk user, with RLS enforcing ownership. */
export async function withUser<T>(
  userId: string,
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.user_id', ${userId}, true)`);
    await tx.execute(sql`select set_config('app.bypass_rls', 'off', true)`);
    return fn(tx);
  });
}

/** Run `fn` with RLS bypassed — public read paths / webhooks only. */
export async function withSystem<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.bypass_rls', 'on', true)`);
    return fn(tx);
  });
}

export { schema };
