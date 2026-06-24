import { describe, it, expect } from "vitest";
import { newId, slugify, RESERVED_USERNAMES } from "./ids";

describe("newId", () => {
  it("prefixes and stays url-safe", () => {
    const id = newId("prj");
    expect(id.startsWith("prj_")).toBe(true);
    expect(id).toMatch(/^prj_[0-9a-z]{20}$/);
  });
  it("is unique across calls", () => {
    const set = new Set(Array.from({ length: 500 }, () => newId("p")));
    expect(set.size).toBe(500);
  });
});

describe("slugify", () => {
  it("normalises to a url-safe handle", () => {
    expect(slugify("Basel Mahmoud!")).toBe("basel-mahmoud");
    expect(slugify("  Multiple   Spaces  ")).toBe("multiple-spaces");
  });
});

describe("reserved usernames", () => {
  it("includes route collisions", () => {
    for (const r of ["admin", "api", "u", "sign-in"]) {
      expect(RESERVED_USERNAMES.has(r)).toBe(true);
    }
  });
});
