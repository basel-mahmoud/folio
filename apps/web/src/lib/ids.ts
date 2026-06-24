import { customAlphabet } from "nanoid";

// URL-safe, unambiguous alphabet for human-adjacent ids.
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const nano = customAlphabet(alphabet, 20);

export const newId = (prefix: string) => `${prefix}_${nano()}`;

/** Slugify free text into a URL-safe handle. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

const tokenAlphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export const newToken = customAlphabet(tokenAlphabet, 40);

/**
 * Reserved handles that must never be claimed as a public username, because they
 * collide with app routes or would be confusing/abusive on a public profile URL.
 */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "settings",
  "sign-in",
  "sign-up",
  "onboarding",
  "u",
  "p",
  "about",
  "pricing",
  "privacy",
  "terms",
  "support",
  "help",
  "blog",
  "docs",
  "folio",
  "www",
  "root",
  "me",
  "new",
  "edit",
  "explore",
]);
