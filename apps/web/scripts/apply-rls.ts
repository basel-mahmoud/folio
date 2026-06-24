/**
 * Enables + FORCES row-level security and (re)creates policies. Idempotent.
 * Run after migrations: npm run db:policies
 *
 * Model: every owned table is restricted to the acting user
 *   (current_setting('app.user_id')), with a system bypass GUC for public
 *   read paths / webhooks. audit_logs is append-only (SELECT + INSERT only).
 *   idempotency_keys + rate_limits are app-internal infra → no RLS.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { Client } from "pg";

const OWNED = [
  { table: "portfolios", col: "user_id" },
  { table: "projects", col: "user_id" },
  { table: "experiences", col: "user_id" },
  { table: "education", col: "user_id" },
  { table: "skill_groups", col: "user_id" },
  { table: "ai_generations", col: "user_id" },
  { table: "users", col: "id" },
];

const BYPASS = `current_setting('app.bypass_rls', true) = 'on'`;
const own = (col: string) =>
  `${BYPASS} or ${col} = current_setting('app.user_id', true)`;

async function main() {
  const owner = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!owner) throw new Error("DIRECT_URL not set");
  const c = new Client({ connectionString: owner });
  await c.connect();

  for (const { table, col } of OWNED) {
    await c.query(`alter table ${table} enable row level security`);
    await c.query(`alter table ${table} force row level security`);
    await c.query(`drop policy if exists ${table}_rls on ${table}`);
    await c.query(
      `create policy ${table}_rls on ${table} using (${own(col)}) with check (${own(col)})`,
    );
  }

  // Append-only audit chain: SELECT + INSERT only (no update/delete policies).
  await c.query(`alter table audit_logs enable row level security`);
  await c.query(`alter table audit_logs force row level security`);
  await c.query(`drop policy if exists audit_logs_select on audit_logs`);
  await c.query(`drop policy if exists audit_logs_insert on audit_logs`);
  await c.query(
    `create policy audit_logs_select on audit_logs for select using (${own("user_id")})`,
  );
  await c.query(
    `create policy audit_logs_insert on audit_logs for insert with check (${own("user_id")})`,
  );

  await c.end();
  console.log("RLS enabled + forced; policies applied on", OWNED.length + 1, "tables");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
