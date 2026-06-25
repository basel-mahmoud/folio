/**
 * API-backed portfolio provider. Uses the Clerk session token to call the
 * Next.js API and exposes the same interface as the demo provider.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { apiFetch } from "@/lib/api";
import {
  PortfolioContext,
  type PortfolioData,
  type PortfolioContextValue,
  type Section,
  type TailorResult,
} from "./portfolio-context";

type Bundle = {
  portfolio: {
    handle: string;
    name: string;
    headline: string;
    location: string;
    bio: string;
    links: PortfolioData["links"];
    published: boolean;
  };
  projects: PortfolioData["projects"];
  experiences: PortfolioData["experiences"];
  education: PortfolioData["education"];
  skills: PortfolioData["skills"];
};

function mapBundle(b: Bundle): PortfolioData {
  return {
    handle: b.portfolio.handle,
    name: b.portfolio.name,
    headline: b.portfolio.headline,
    location: b.portfolio.location,
    bio: b.portfolio.bio,
    links: b.portfolio.links ?? [],
    published: b.portfolio.published,
    projects: b.projects ?? [],
    experiences: b.experiences ?? [],
    education: b.education ?? [],
    skills: b.skills ?? [],
  };
}

const errMsg = (e: unknown) =>
  typeof e === "object" && e !== null && "message" in e
    ? String((e as { message: unknown }).message)
    : "Network error";

export function ApiPortfolioProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSignedIn) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const b = await apiFetch<Bundle>("/api/me", { token });
      setData(mapBundle(b));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (isLoaded) void refresh();
  }, [isLoaded, refresh]);

  const call = useCallback(
    async <T,>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) => {
      const token = await getToken();
      return apiFetch<T>(path, { method, body, token });
    },
    [getToken],
  );

  const value: PortfolioContextValue = useMemo(
    () => ({
      data,
      loading,
      error,
      mode: "api",
      refresh,
      updateProfile: async (p) => {
        await call("/api/me/profile", "PATCH", p);
        setData((d) => (d ? { ...d, ...p } : d));
      },
      setHandle: async (handle) => {
        await call("/api/me/handle", "POST", { handle });
        setData((d) => (d ? { ...d, handle } : d));
      },
      setPublished: async (published) => {
        await call("/api/me/publish", "POST", { published });
        setData((d) => (d ? { ...d, published } : d));
      },
      addProject: async (p) => {
        const row = await call<PortfolioData["projects"][number]>("/api/me/projects", "POST", p);
        setData((d) => (d ? { ...d, projects: [...d.projects, row] } : d));
      },
      addExperience: async (e) => {
        const row = await call<PortfolioData["experiences"][number]>("/api/me/experiences", "POST", e);
        setData((d) => (d ? { ...d, experiences: [...d.experiences, row] } : d));
      },
      addEducation: async (e) => {
        const row = await call<PortfolioData["education"][number]>("/api/me/education", "POST", e);
        setData((d) => (d ? { ...d, education: [...d.education, row] } : d));
      },
      addSkillGroup: async (g) => {
        const row = await call<PortfolioData["skills"][number]>("/api/me/skills", "POST", g);
        setData((d) => (d ? { ...d, skills: [...d.skills, row] } : d));
      },
      update: async (section: Section, id: string, input: Record<string, unknown>) => {
        await call(`/api/me/${section}/${id}`, "PATCH", input);
        setData((d) =>
          d
            ? { ...d, [section]: (d[section] as { id: string }[]).map((x) => (x.id === id ? { ...x, ...input } : x)) as never }
            : d,
        );
      },
      remove: async (section: Section, id: string) => {
        await call(`/api/me/${section}/${id}`, "DELETE");
        setData((d) => (d ? { ...d, [section]: d[section].filter((x) => x.id !== id) } : d));
      },
      tailor: (jobDescription: string) =>
        call<TailorResult>("/api/me/ai/tailor", "POST", { jobDescription }),
      generateText: async (kind, notes, tone) => {
        const r = await call<{ text: string }>("/api/me/ai/text", "POST", {
          kind,
          notes,
          tone: tone ?? "professional",
        });
        return r.text;
      },
      exportData: async () => {
        const token = await getToken();
        return apiFetch("/api/me/export", { token });
      },
      deleteAccount: async () => {
        await call("/api/me", "DELETE");
      },
    }),
    [data, loading, error, refresh, call],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}
