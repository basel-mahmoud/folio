/**
 * Portfolio data layer. Screens consume `usePortfolio()` and never care whether
 * data comes from the API or the local demo — the root layout picks the provider
 * based on whether Clerk is configured. Both expose the same CRUD interface, so
 * the builder is fully interactive even in offline demo mode.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { demoPortfolio } from "./demo";
import type {
  Project,
  Experience,
  Education,
  SkillGroup,
  Link,
} from "./demo";

export type PortfolioData = {
  handle: string;
  name: string;
  headline: string;
  location: string;
  bio: string;
  links: Link[];
  published: boolean;
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  skills: SkillGroup[];
};

export type Section = "projects" | "experiences" | "education" | "skills";

export type TailorResult = {
  matchScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  rewrittenBullets: { before: string; after: string }[];
  missingKeywords: string[];
};

export type PortfolioContextValue = {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  mode: "demo" | "api";
  refresh: () => Promise<void>;
  updateProfile: (p: Partial<PortfolioData>) => Promise<void>;
  setHandle: (handle: string) => Promise<void>;
  setPublished: (published: boolean) => Promise<void>;
  addProject: (p: Omit<Project, "id">) => Promise<void>;
  addExperience: (e: Omit<Experience, "id">) => Promise<void>;
  addEducation: (e: Omit<Education, "id">) => Promise<void>;
  addSkillGroup: (g: Omit<SkillGroup, "id">) => Promise<void>;
  remove: (section: Section, id: string) => Promise<void>;
  tailor: (jobDescription: string) => Promise<TailorResult>;
  generateText: (
    kind: "bio" | "project" | "headline",
    notes: string,
    tone?: string,
  ) => Promise<string>;
};

const Ctx = createContext<PortfolioContextValue | null>(null);

export function usePortfolio(): PortfolioContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePortfolio must be used within a PortfolioProvider");
  return v;
}

const rid = () => Math.random().toString(36).slice(2, 12);

const demoData = (): PortfolioData => ({
  handle: demoPortfolio.handle,
  name: demoPortfolio.name,
  headline: demoPortfolio.headline,
  location: demoPortfolio.location,
  bio: demoPortfolio.bio,
  links: demoPortfolio.links,
  published: false,
  projects: demoPortfolio.projects,
  experiences: demoPortfolio.experience,
  education: demoPortfolio.education,
  skills: demoPortfolio.skills,
});

/** Local, in-memory provider — no backend. Mutations update local state. */
export function DemoPortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PortfolioData>(demoData);

  const value: PortfolioContextValue = useMemo(
    () => ({
      data,
      loading: false,
      error: null,
      mode: "demo",
      refresh: async () => {},
      updateProfile: async (p) => setData((d) => ({ ...d, ...p })),
      setHandle: async (handle) => setData((d) => ({ ...d, handle })),
      setPublished: async (published) => setData((d) => ({ ...d, published })),
      addProject: async (p) =>
        setData((d) => ({ ...d, projects: [...d.projects, { ...p, id: rid() }] })),
      addExperience: async (e) =>
        setData((d) => ({ ...d, experiences: [...d.experiences, { ...e, id: rid() }] })),
      addEducation: async (e) =>
        setData((d) => ({ ...d, education: [...d.education, { ...e, id: rid() }] })),
      addSkillGroup: async (g) =>
        setData((d) => ({ ...d, skills: [...d.skills, { ...g, id: rid() }] })),
      remove: async (section, id) =>
        setData((d) => ({ ...d, [section]: d[section].filter((x) => x.id !== id) })),
      tailor: async () => {
        await new Promise((r) => setTimeout(r, 900));
        const skills = data.skills.flatMap((s) => s.items);
        return {
          matchScore: 88,
          summary:
            "Strong fit — your full-stack and AI project work maps well to this role.",
          strengths: [
            "Production multi-tenant SaaS experience",
            "End-to-end product ownership",
            skills.slice(0, 2).join(" & ") || "Relevant tech stack",
          ],
          gaps: ["Add a quantified metric to a recent role", "Mention team collaboration"],
          rewrittenBullets: [
            {
              before: "Worked on the frontend and helped with the backend.",
              after:
                "Built and shipped a React + Next.js dashboard and the Node APIs behind it, cutting page loads 40%.",
            },
          ],
          missingKeywords: ["CI/CD", "unit testing"],
        };
      },
      generateText: async (_kind, notes) => {
        await new Promise((r) => setTimeout(r, 700));
        return notes?.trim()
          ? `${notes.trim()} — refined for impact.`
          : "Your polished text will appear here.";
      },
    }),
    [data],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { Ctx as PortfolioContext };
export type { Project, Experience, Education, SkillGroup, Link };
