/**
 * Tamper-evident audit log. Each user has their own hash chain:
 *   hash_n = sha256(prev_hash || canonical(entry))
 * Appends are serialised per user with a transaction-scoped advisory lock, so
 * concurrent writers cannot fork the chain. The audit_logs table has only
 * SELECT/INSERT RLS policies under FORCE, so rows can never be updated/deleted.
 */
import { createHash } from "node:crypto";
import { desc, eq, sql } from "drizzle-orm";
import { auditLogs } from "@/lib/db/schema";
import type { Tx } from "@/lib/db/client";

export type AuditEntry = {
  userId: string;
  actorId?: string | null;
  actorType?: "user" | "system";
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
};

function canonical(e: AuditEntry, prevHash: string | null): string {
  return JSON.stringify({
    u: e.userId,
    a: e.actorId ?? null,
    at: e.actorType ?? "user",
    ac: e.action,
    tt: e.targetType ?? null,
    ti: e.targetId ?? null,
    m: e.metadata ?? null,
    p: prevHash,
  });
}

/** Pure hash of an entry given the previous hash. Exported for testing. */
export function hashEntry(e: AuditEntry, prevHash: string | null): string {
  return createHash("sha256").update(canonical(e, prevHash)).digest("hex");
}

export async function appendAudit(tx: Tx, entry: AuditEntry): Promise<string> {
  await tx.execute(
    sql`select pg_advisory_xact_lock(hashtext(${"audit:" + entry.userId}))`,
  );

  const prev = await tx
    .select({ hash: auditLogs.hash })
    .from(auditLogs)
    .where(eq(auditLogs.userId, entry.userId))
    .orderBy(desc(auditLogs.id))
    .limit(1);
  const prevHash = prev[0]?.hash ?? null;

  const hash = hashEntry(entry, prevHash);

  await tx.insert(auditLogs).values({
    userId: entry.userId,
    actorId: entry.actorId ?? null,
    actorType: entry.actorType ?? "user",
    action: entry.action,
    targetType: entry.targetType,
    targetId: entry.targetId,
    metadata: entry.metadata,
    prevHash,
    hash,
  });

  return hash;
}

/** Verify a user's chain is intact. Used by tests and an admin endpoint. */
export function verifyChain(
  rows: {
    userId: string;
    actorId: string | null;
    actorType: string;
    action: string;
    targetType: string | null;
    targetId: string | null;
    metadata: Record<string, unknown> | null;
    prevHash: string | null;
    hash: string;
  }[],
): { ok: boolean; brokenAt?: number } {
  let prevHash: string | null = null;
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const expected = hashEntry(
      {
        userId: r.userId,
        actorId: r.actorId,
        actorType: r.actorType as AuditEntry["actorType"],
        action: r.action,
        targetType: r.targetType ?? undefined,
        targetId: r.targetId ?? undefined,
        metadata: r.metadata ?? undefined,
      },
      prevHash,
    );
    if (r.prevHash !== prevHash || r.hash !== expected) {
      return { ok: false, brokenAt: i };
    }
    prevHash = r.hash;
  }
  return { ok: true };
}
