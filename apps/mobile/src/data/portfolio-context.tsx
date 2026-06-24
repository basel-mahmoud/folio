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
    }),
    [data],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export { Ctx as PortfolioContext };
export type { Project, Experience, Education, SkillGroup, Link };
