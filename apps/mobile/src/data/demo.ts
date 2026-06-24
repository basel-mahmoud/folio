/**
 * Local demo portfolio used to render the builder + preview before the API is
 * wired (M2/M4). Shapes mirror the planned API contract.
 */
export type Link = { label: string; url: string };
export type Project = {
  id: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  tags: string[];
  link?: string;
};
export type Experience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string | null; // null = present
  summary: string;
};
export type Education = {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
};
export type SkillGroup = { id: string; label: string; items: string[] };

export type Portfolio = {
  name: string;
  handle: string;
  headline: string;
  location: string;
  bio: string;
  links: Link[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
};

export const demoPortfolio: Portfolio = {
  name: "Basel Mahmoud",
  handle: "basel",
  headline: "Full-stack engineer",
  location: "Amman, Jordan",
  bio: "I build production-grade web and mobile apps — secure, tested and fast. Recently shipped multi-tenant SaaS with AI integrations end to end.",
  links: [
    { label: "GitHub", url: "github.com/basel-mahmoud" },
    { label: "Email", url: "hello@basel.dev" },
  ],
  projects: [
    {
      id: "p1",
      title: "DeskHive",
      role: "Solo engineer",
      year: "2026",
      summary:
        "Multi-tenant AI help desk with SLA tracking, RBAC and Stripe seat billing. Postgres row-level security for tenant isolation; Gemini triage.",
      tags: ["Next.js", "Neon", "Clerk", "Stripe"],
      link: "deskhive.site",
    },
    {
      id: "p2",
      title: "CivicSnap",
      role: "Solo engineer",
      year: "2026",
      summary:
        "AI civic-issue reporter — snap a photo, auto-classify the problem and route it to the right department with a public status feed.",
      tags: ["Next.js", "Supabase", "AI"],
      link: "civicsnap.app",
    },
    {
      id: "p3",
      title: "QueueUp",
      role: "Solo engineer",
      year: "2025",
      summary:
        "Real-time waitlist app with live position updates and SMS notifications. Optimistic UI and conflict-safe ordering.",
      tags: ["React", "Realtime", "Twilio"],
      link: "queueup.app",
    },
  ],
  experience: [
    {
      id: "e1",
      company: "Independent",
      role: "Full-stack engineer",
      start: "2024-06",
      end: null,
      summary:
        "Design, build and ship end-to-end products: typed APIs, Postgres data models, auth, payments and CI/CD on Vercel.",
    },
    {
      id: "e2",
      company: "Freelance",
      role: "Frontend developer",
      start: "2023-01",
      end: "2024-05",
      summary:
        "Built responsive, accessible interfaces for small businesses; improved Core Web Vitals and conversion.",
    },
  ],
  education: [
    {
      id: "ed1",
      school: "University of Jordan",
      degree: "B.Sc. Computer Science",
      start: "2020",
      end: "2024",
    },
  ],
  skills: [
    {
      id: "s1",
      label: "Languages",
      items: ["TypeScript", "JavaScript", "SQL", "Python"],
    },
    {
      id: "s2",
      label: "Frameworks",
      items: ["Next.js", "React", "React Native", "Expo", "Node"],
    },
    {
      id: "s3",
      label: "Infrastructure",
      items: ["Postgres / Neon", "Vercel", "Clerk", "Drizzle"],
    },
  ],
};
