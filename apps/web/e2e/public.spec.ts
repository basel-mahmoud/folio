import { test, expect } from "@playwright/test";

/**
 * Smoke test for the public surface. Run against a server that has the demo
 * portfolio seeded (npm run db:seed): E2E_BASE_URL=... npm run test:e2e
 */
test("public portfolio renders for the seeded handle", async ({ page }) => {
  await page.goto("/u/basel");
  await expect(page.getByRole("heading", { name: "Basel Mahmoud" })).toBeVisible();
  await expect(page.getByText("Selected work")).toBeVisible();
  await expect(page.getByRole("link", { name: /Download CV/i })).toBeVisible();
});

test("printable CV renders", async ({ page }) => {
  await page.goto("/u/basel/cv");
  await expect(page.getByRole("heading", { name: "Basel Mahmoud" })).toBeVisible();
  await expect(page.getByText("Experience")).toBeVisible();
});

test("unknown handle 404s", async ({ page }) => {
  const res = await page.goto("/u/this-handle-does-not-exist-xyz");
  expect(res?.status()).toBe(404);
});

test("marketing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("FOLIO")).toBeVisible();
});
