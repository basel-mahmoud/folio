/**
 * Folio data model.
 *
 * Tenant = user. Every owned row carries `userId`, and Postgres row-level
 * security (FORCED) restricts rows to `current_setting('app.user_id')` — see
 * scripts/apply-rls.ts. Child rows denormalise `userId` so policies stay simple
 * and fast. Public portfolio pages read through the system (bypass) path and
 * filter `published = true` in code.
 */
import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  serial,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/** Local mirror of the Clerk user (id = Clerk user id). */
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type SocialLink = { label: string; url: string };

/** One portfolio per user. `handle` is the public username (folio.app/u/<handle>). */
export const portfolios = pgTable(
  "portfolios",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    handle: text("handle").notNull(),
    name: text("name").notNull().default(""),
    headline: text("headline").notNull().default(""),
    location: text("location").notNull().default(""),
    bio: text("bio").notNull().default(""),
    links: jsonb("links").$type<SocialLink[]>().notNull().default([]),
    theme: text("theme").notNull().default("system"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("portfolios_user_id_key").on(t.userId),
    uniqueIndex("portfolios_handle_key").on(t.handle),
  ],
);

export const projects = pgTable(
  "projects",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    role: text("role").notNull().default(""),
    year: text("year").notNull().default(""),
    summary: text("summary").notNull().default(""),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    link: text("link"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("projects_portfolio_idx").on(t.portfolioId)],
);

export const experiences = pgTable(
  "experiences",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    company: text("company").notNull(),
    role: text("role").notNull().default(""),
    start: text("start").notNull().default(""), // YYYY-MM
    end: text("end"), // null = present
    summary: text("summary").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("experiences_portfolio_idx").on(t.portfolioId)],
);

export const education = pgTable(
  "education",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    school: text("school").notNull(),
    degree: text("degree").notNull().default(""),
    start: text("start").notNull().default(""),
    end: text("end").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("education_portfolio_idx").on(t.portfolioId)],
);

export const skillGroups = pgTable(
  "skill_groups",
  {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
      .notNull()
      .references(() => portfolios.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    label: text("label").notNull(),
    items: jsonb("items").$type<string[]>().notNull().default([]),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("skill_groups_portfolio_idx").on(t.portfolioId)],
);

export type AiKind = "bio" | "project" | "tailor" | "headline";

/** Record of every AI generation — usage trail + cache key for replays. */
export const aiGenerations = pgTable(
  "ai_generations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    portfolioId: text("portfolio_id"),
    kind: text("kind").$type<AiKind>().notNull(),
    inputHash: text("input_hash").notNull(),
    input: jsonb("input").$type<Record<string, unknown>>(),
    output: jsonb("output").$type<Record<string, unknown>>(),
    model: text("model").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("ai_generations_user_kind_hash_idx").on(t.userId, t.kind, t.inputHash)],
);

export type ActorType = "user" | "system";

/** Per-user tamper-evident hash chain. Append-only (SELECT/INSERT policies only). */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    actorId: text("actor_id"),
    actorType: text("actor_type").$type<ActorType>().notNull().default("user"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    prevHash: text("prev_hash"),
    hash: text("hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("audit_logs_user_idx").on(t.userId, t.id)],
);

/** Idempotency keys for mutating API calls. */
export const idempotencyKeys = pgTable("idempotency_keys", {
  key: text("key").primaryKey(),
  userId: text("user_id"),
  requestHash: text("request_hash").notNull(),
  statusCode: integer("status_code"),
  response: jsonb("response").$type<unknown>(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/** DB-backed fixed-window rate limiter buckets. */
export const rateLimits = pgTable("rate_limits", {
  bucket: text("bucket").primaryKey(),
  count: integer("count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export type Portfolio = typeof portfolios.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type SkillGroup = typeof skillGroups.$inferSelect;
export type User = typeof users.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
