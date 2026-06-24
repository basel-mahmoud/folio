/**
 * RLS isolation smoke test. Creates two users + portfolios and asserts that a
 * user scoped via withUser() can only see their own data, and that cross-tenant
 * writes are rejected by the WITH CHECK policy.
 * Run: npm run test:rls
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { withSystem, withUser } from "../src/lib/db/client";
import { users, portfolios, projects } from "../src/lib/db/schema";
import { newId } from "../src/lib/ids";

const rid = () => "test_" + Math.random().toString(36).slice(2, 10);

async function main() {
  const u1 = rid(),
    u2 = rid();
  const pf1 = newId("pf"),
    pf2 = newId("pf");

  await withSystem(async (tx) => {
    await tx.insert(users).values([
      { id: u1, email: `${u1}@t.dev`, name: "U1" },
      { id: u2, email: `${u2}@t.dev`, name: "U2" },
    ]);
    await tx.insert(portfolios).values([
      { id: pf1, userId: u1, handle: u1, name: "U1" },
      { id: pf2, userId: u2, handle: u2, name: "U2" },
    ]);
    await tx.insert(projects).values([
      { id: newId("prj"), portfolioId: pf1, userId: u1, title: "U1 project" },
      { id: newId("prj"), portfolioId: pf2, userId: u2, title: "U2 project" },
    ]);
  });

  const u1Pf = await withUser(u1, (tx) => tx.select().from(portfolios));
  const u1Prj = await withUser(u1, (tx) => tx.select().from(projects));

  const okPf = u1Pf.length === 1 && u1Pf[0].userId === u1;
  const okPrj = u1Prj.length === 1 && u1Prj[0].userId === u1;

  // Cross-tenant write must be blocked by WITH CHECK.
  let writeBlocked = false;
  try {
    await withUser(u1, (tx) =>
      tx.insert(projects).values({
        id: newId("prj"),
        portfolioId: pf2, // not u1's
        userId: u2, // not u1
        title: "should fail",
      }),
    );
  } catch {
    writeBlocked = true;
  }

  console.log("u1 sees only own portfolio:", okPf, `(${u1Pf.length} rows)`);
  console.log("u1 sees only own projects:", okPrj, `(${u1Prj.length} rows)`);
  console.log("cross-tenant write blocked:", writeBlocked);

  await withSystem(async (tx) => {
    await tx.delete(users).where(eq(users.id, u1));
    await tx.delete(users).where(eq(users.id, u2));
  });

  const pass = okPf && okPrj && writeBlocked;
  console.log(pass ? "\n✅ RLS isolation verified" : "\n❌ RLS check FAILED");
  process.exit(pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
