import { describe, it, expect } from "vitest";
import { hashEntry, verifyChain, type AuditEntry } from "./audit";

const entry = (action: string): AuditEntry => ({
  userId: "user_1",
  actorId: "user_1",
  actorType: "user",
  action,
});

describe("audit hash chain", () => {
  it("is deterministic for the same entry + prev", () => {
    const a = hashEntry(entry("a"), null);
    const b = hashEntry(entry("a"), null);
    expect(a).toBe(b);
  });

  it("changes when the previous hash changes", () => {
    const a = hashEntry(entry("a"), null);
    const b = hashEntry(entry("a"), "deadbeef");
    expect(a).not.toBe(b);
  });

  it("verifies an intact chain and detects tampering", () => {
    const rows: Parameters<typeof verifyChain>[0] = [];
    let prev: string | null = null;
    for (const action of ["create", "update", "publish"]) {
      const e = entry(action);
      const hash = hashEntry(e, prev);
      rows.push({
        userId: e.userId,
        actorId: e.actorId ?? null,
        actorType: e.actorType ?? "user",
        action: e.action,
        targetType: null,
        targetId: null,
        metadata: null,
        prevHash: prev,
        hash,
      });
      prev = hash;
    }
    expect(verifyChain(rows).ok).toBe(true);

    rows[1].action = "tampered";
    const result = verifyChain(rows);
    expect(result.ok).toBe(false);
    expect(result.brokenAt).toBe(1);
  });
});
