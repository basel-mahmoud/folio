/**
 * Creates the non-privileged `folio_app` runtime role (NOBYPASSRLS) so that RLS
 * is actually enforced at runtime. Uses the owner connection (DIRECT_URL).
 * Password is supplied via APP_DB_PASSWORD (hex) and never logged. Idempotent.
 *
 * Run: npm run db:app-role   (with APP_DB_PASSWORD set in .env.local)
 */
import { Client } from "pg";

async function main() {
  const owner = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  const pw = process.env.APP_DB_PASSWORD;
  if (!owner) throw new Error("DIRECT_URL not set");
  if (!pw) throw new Error("APP_DB_PASSWORD not set");
  if (!/^[0-9a-f]+$/.test(pw)) throw new Error("APP_DB_PASSWORD must be hex");

  const c = new Client({ connectionString: owner });
  await c.connect();
  const exists = await c.query(`select 1 from pg_roles where rolname = 'folio_app'`);
  const verb = exists.rowCount ? "alter" : "create";
  await c.query(`${verb} role folio_app login password '${pw}' nobypassrls`);
  await c.query(`grant usage on schema public to folio_app`);
  await c.query(
    `grant select, insert, update, delete on all tables in schema public to folio_app`,
  );
  await c.query(`grant usage, select on all sequences in schema public to folio_app`);
  await c.query(
    `alter default privileges in schema public grant select, insert, update, delete on tables to folio_app`,
  );
  await c.query(
    `alter default privileges in schema public grant usage, select on sequences to folio_app`,
  );
  await c.end();
  console.log("folio_app role ready (NOBYPASSRLS, DML granted)");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
