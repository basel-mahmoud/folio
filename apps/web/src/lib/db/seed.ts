/**
 * Seeds a published demo portfolio at /u/basel so the public page, CV export and
 * OG image are demoable without signing in. Idempotent. Run: npm run db:seed
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { withSystem } from "./client";
import { users, portfolios, projects, experiences, education, skillGroups } from "./schema";
import { newId } from "@/lib/ids";

const DEMO_USER = "user_demo_basel";

async function main() {
  await withSystem(async (tx) => {
    await tx.delete(users).where(eq(users.id, DEMO_USER)); // cascade clears the rest
    await tx.insert(users).values({ id: DEMO_USER, email: "demo@folio.app", name: "Basel Mahmoud" });

    const pfId = newId("pf");
    await tx.insert(portfolios).values({
      id: pfId,
      userId: DEMO_USER,
      handle: "basel",
      name: "Basel Mahmoud",
      headline: "Full-stack engineer",
      location: "Amman, Jordan",
      bio: "I build production-grade web and mobile apps — secure, tested and fast. Recently shipped multi-tenant SaaS with AI integrations end to end.",
      links: [
        { label: "GitHub", url: "github.com/basel-mahmoud" },
        { label: "Email", url: "hello@basel.dev" },
      ],
      published: true,
    });

    await tx.insert(projects).values([
      { id: newId("prj"), portfolioId: pfId, userId: DEMO_USER, title: "DeskHive", role: "Solo engineer", year: "2026", summary: "Multi-tenant AI help desk with SLA tracking, RBAC and Stripe seat billing. Postgres row-level security for tenant isolation; Gemini triage.", tags: ["Next.js", "Neon", "Clerk", "Stripe"], link: "deskhive.site", sortOrder: 0 },
      { id: newId("prj"), portfolioId: pfId, userId: DEMO_USER, title: "CivicSnap", role: "Solo engineer", year: "2026", summary: "AI civic-issue reporter — snap a photo, auto-classify the problem and route it to the right department with a public status feed.", tags: ["Next.js", "Supabase", "AI"], link: "civicsnap.app", sortOrder: 1 },
      { id: newId("prj"), portfolioId: pfId, userId: DEMO_USER, title: "QueueUp", role: "Solo engineer", year: "2025", summary: "Real-time waitlist app with live position updates and SMS notifications. Optimistic UI and conflict-safe ordering.", tags: ["React", "Realtime", "Twilio"], link: "queueup.app", sortOrder: 2 },
    ]);

    await tx.insert(experiences).values([
      { id: newId("exp"), portfolioId: pfId, userId: DEMO_USER, company: "Independent", role: "Full-stack engineer", start: "2024-06", end: null, summary: "Design, build and ship end-to-end products: typed APIs, Postgres data models, auth, payments and CI/CD on Vercel.", sortOrder: 0 },
      { id: newId("exp"), portfolioId: pfId, userId: DEMO_USER, company: "Freelance", role: "Frontend developer", start: "2023-01", end: "2024-05", summary: "Built responsive, accessible interfaces for small businesses; improved Core Web Vitals and conversion.", sortOrder: 1 },
    ]);

    await tx.insert(education).values([
      { id: newId("edu"), portfolioId: pfId, userId: DEMO_USER, school: "University of Jordan", degree: "B.Sc. Computer Science", start: "2020", end: "2024", sortOrder: 0 },
    ]);

    await tx.insert(skillGroups).values([
      { id: newId("skl"), portfolioId: pfId, userId: DEMO_USER, label: "Languages", items: ["TypeScript", "JavaScript", "SQL", "Python"], sortOrder: 0 },
      { id: newId("skl"), portfolioId: pfId, userId: DEMO_USER, label: "Frameworks", items: ["Next.js", "React", "React Native", "Expo", "Node"], sortOrder: 1 },
      { id: newId("skl"), portfolioId: pfId, userId: DEMO_USER, label: "Infrastructure", items: ["Postgres / Neon", "Vercel", "Clerk", "Drizzle"], sortOrder: 2 },
    ]);
  });
  console.log("Seeded published demo portfolio at /u/basel");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
