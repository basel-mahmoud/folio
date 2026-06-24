/**
 * Portfolio data access. Every function runs under withUser() so RLS enforces
 * ownership; the public read path runs under withSystem() and only returns
 * published portfolios. Writes append to the audit chain.
 */
import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { withSystem, withUser, type Tx } from "@/lib/db/client";
import {
  portfolios,
  projects,
  experiences,
  education,
  skillGroups,
  users,
  type Portfolio,
} from "@/lib/db/schema";
import { appendAudit } from "@/lib/services/audit";
import { newId, slugify, RESERVED_USERNAMES } from "@/lib/ids";
import type {
  ProfileInput,
  ProjectInput,
  ExperienceInput,
  EducationInput,
  SkillGroupInput,
} from "@/lib/validation";

export type PortfolioBundle = {
  portfolio: Portfolio;
  projects: (typeof projects.$inferSelect)[];
  experiences: (typeof experiences.$inferSelect)[];
  education: (typeof education.$inferSelect)[];
  skills: (typeof skillGroups.$inferSelect)[];
};

async function uniqueHandle(tx: Tx, base: string): Promise<string> {
  let root = slugify(base) || "user";
  if (root.length < 3) root = `${root}-folio`;
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    if (RESERVED_USERNAMES.has(candidate)) continue;
    const existing = await tx
      .select({ id: portfolios.id })
      .from(portfolios)
      .where(eq(portfolios.handle, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
  }
  return `${root}-${newId("").slice(1, 7)}`;
}

/** Get the user's portfolio, creating an empty one (with a unique handle) on first use. */
export async function getOrCreatePortfolio(userId: string): Promise<Portfolio> {
  return withUser(userId, async (tx) => {
    const existing = await tx
      .select()
      .from(portfolios)
      .where(eq(portfolios.userId, userId))
      .limit(1);
    if (existing[0]) return existing[0];

    const me = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
    const seed = me[0]?.name || me[0]?.email?.split("@")[0] || "user";
    const handle = await uniqueHandle(tx, seed);
    const id = newId("pf");
    const inserted = await tx
      .insert(portfolios)
      .values({ id, userId, handle, name: me[0]?.name ?? "" })
      .returning();
    await appendAudit(tx, {
      userId,
      actorId: userId,
      action: "portfolio.create",
      targetType: "portfolio",
      targetId: id,
      metadata: { handle },
    });
    return inserted[0];
  });
}

export async function getBundle(userId: string): Promise<PortfolioBundle> {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const [prj, exp, edu, sk] = await Promise.all([
      tx.select().from(projects).where(eq(projects.portfolioId, pf.id)).orderBy(asc(projects.sortOrder), asc(projects.createdAt)),
      tx.select().from(experiences).where(eq(experiences.portfolioId, pf.id)).orderBy(asc(experiences.sortOrder), asc(experiences.createdAt)),
      tx.select().from(education).where(eq(education.portfolioId, pf.id)).orderBy(asc(education.sortOrder)),
      tx.select().from(skillGroups).where(eq(skillGroups.portfolioId, pf.id)).orderBy(asc(skillGroups.sortOrder)),
    ]);
    return { portfolio: pf, projects: prj, experiences: exp, education: edu, skills: sk };
  });
}

export async function updateProfile(userId: string, input: ProfileInput) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const updated = await tx
      .update(portfolios)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(portfolios.id, pf.id))
      .returning();
    await appendAudit(tx, { userId, actorId: userId, action: "portfolio.update_profile", targetType: "portfolio", targetId: pf.id });
    return updated[0];
  });
}

/** Claim/change the public handle. Throws "handle_taken" on conflict. */
export async function setHandle(userId: string, handle: string) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const clash = await tx
      .select({ id: portfolios.id })
      .from(portfolios)
      .where(and(eq(portfolios.handle, handle)))
      .limit(1);
    if (clash[0] && clash[0].id !== pf.id) throw new Error("handle_taken");
    const updated = await tx
      .update(portfolios)
      .set({ handle, updatedAt: new Date() })
      .where(eq(portfolios.id, pf.id))
      .returning();
    await appendAudit(tx, { userId, actorId: userId, action: "portfolio.set_handle", targetType: "portfolio", targetId: pf.id, metadata: { handle } });
    return updated[0];
  });
}

export async function setPublished(userId: string, published: boolean) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const updated = await tx
      .update(portfolios)
      .set({ published, updatedAt: new Date() })
      .where(eq(portfolios.id, pf.id))
      .returning();
    await appendAudit(tx, { userId, actorId: userId, action: published ? "portfolio.publish" : "portfolio.unpublish", targetType: "portfolio", targetId: pf.id });
    return updated[0];
  });
}

/* ----------------------------- section CRUD ------------------------------ */

const sections = { projects, experiences, education, skillGroups } as const;

export async function addProject(userId: string, input: ProjectInput) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const id = newId("prj");
    const row = await tx.insert(projects).values({ id, portfolioId: pf.id, userId, ...input }).returning();
    await appendAudit(tx, { userId, actorId: userId, action: "project.create", targetType: "project", targetId: id });
    return row[0];
  });
}

export async function updateProject(userId: string, id: string, input: ProjectInput) {
  return withUser(userId, async (tx) => {
    const row = await tx.update(projects).set(input).where(eq(projects.id, id)).returning();
    if (!row[0]) throw new Error("not_found");
    await appendAudit(tx, { userId, actorId: userId, action: "project.update", targetType: "project", targetId: id });
    return row[0];
  });
}

export async function addExperience(userId: string, input: ExperienceInput) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const id = newId("exp");
    const row = await tx.insert(experiences).values({ id, portfolioId: pf.id, userId, ...input }).returning();
    await appendAudit(tx, { userId, actorId: userId, action: "experience.create", targetType: "experience", targetId: id });
    return row[0];
  });
}

export async function addEducation(userId: string, input: EducationInput) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const id = newId("edu");
    const row = await tx.insert(education).values({ id, portfolioId: pf.id, userId, ...input }).returning();
    await appendAudit(tx, { userId, actorId: userId, action: "education.create", targetType: "education", targetId: id });
    return row[0];
  });
}

export async function addSkillGroup(userId: string, input: SkillGroupInput) {
  const pf = await getOrCreatePortfolio(userId);
  return withUser(userId, async (tx) => {
    const id = newId("skl");
    const row = await tx.insert(skillGroups).values({ id, portfolioId: pf.id, userId, ...input }).returning();
    await appendAudit(tx, { userId, actorId: userId, action: "skillgroup.create", targetType: "skill_group", targetId: id });
    return row[0];
  });
}

type SectionName = keyof typeof sections;

/** Delete a row from a section the user owns (RLS double-guards ownership). */
export async function deleteSectionRow(userId: string, section: SectionName, id: string) {
  const table = sections[section];
  return withUser(userId, async (tx) => {
    const row = await tx.delete(table).where(eq(table.id, id)).returning({ id: table.id });
    if (!row[0]) throw new Error("not_found");
    await appendAudit(tx, { userId, actorId: userId, action: `${section}.delete`, targetType: section, targetId: id });
    return { id };
  });
}

/* ------------------------------ public read ------------------------------ */

/** Public portfolio by handle — only if published. Runs under system bypass. */
export async function getPublicByHandle(handle: string): Promise<PortfolioBundle | null> {
  return withSystem(async (tx) => {
    const pf = await tx.select().from(portfolios).where(eq(portfolios.handle, handle)).limit(1);
    if (!pf[0] || !pf[0].published) return null;
    const id = pf[0].id;
    const [prj, exp, edu, sk] = await Promise.all([
      tx.select().from(projects).where(eq(projects.portfolioId, id)).orderBy(asc(projects.sortOrder), asc(projects.createdAt)),
      tx.select().from(experiences).where(eq(experiences.portfolioId, id)).orderBy(asc(experiences.sortOrder)),
      tx.select().from(education).where(eq(education.portfolioId, id)).orderBy(asc(education.sortOrder)),
      tx.select().from(skillGroups).where(eq(skillGroups.portfolioId, id)).orderBy(asc(skillGroups.sortOrder)),
    ]);
    return { portfolio: pf[0], projects: prj, experiences: exp, education: edu, skills: sk };
  });
}

/* --------------------------- GDPR export / erase -------------------------- */

export async function exportUserData(userId: string) {
  const bundle = await getBundle(userId);
  return { exportedAt: new Date().toISOString(), ...bundle };
}

/** Hard-delete the user and all owned data (cascades). Audit kept until last. */
export async function deleteAccount(userId: string) {
  await withSystem(async (tx) => {
    await tx.delete(users).where(eq(users.id, userId));
  });
}
