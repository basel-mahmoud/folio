/**
 * AI features (Gemini). Each call is cached by a hash of its inputs in
 * ai_generations (so repeats are free + fast), recorded to the audit chain, and
 * degrades gracefully — callers get a typed AiUnavailableError on failure.
 *
 * Guardrail: prompts instruct the model to use ONLY the candidate's real data
 * and never fabricate experience.
 */
import "server-only";
import { createHash } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { withUser } from "@/lib/db/client";
import { aiGenerations } from "@/lib/db/schema";
import { appendAudit } from "@/lib/services/audit";
import { generateJson } from "@/lib/services/gemini";
import { getBundle } from "@/lib/services/portfolio";
import { serverEnv } from "@/lib/env";
import { newId } from "@/lib/ids";
import type { AiKind } from "@/lib/db/schema";

const hash = (parts: unknown) =>
  createHash("sha256").update(JSON.stringify(parts)).digest("hex");

async function cached<T>(userId: string, kind: AiKind, inputHash: string): Promise<T | null> {
  const rows = await withUser(userId, (tx) =>
    tx
      .select({ output: aiGenerations.output })
      .from(aiGenerations)
      .where(and(eq(aiGenerations.userId, userId), eq(aiGenerations.kind, kind), eq(aiGenerations.inputHash, inputHash)))
      .orderBy(desc(aiGenerations.createdAt))
      .limit(1),
  );
  return (rows[0]?.output as T) ?? null;
}

async function store(userId: string, kind: AiKind, inputHash: string, input: Record<string, unknown>, output: Record<string, unknown>) {
  const model = serverEnv().GEMINI_MODEL;
  await withUser(userId, async (tx) => {
    await tx.insert(aiGenerations).values({ id: newId("ai"), userId, kind, inputHash, input, output, model });
    await appendAudit(tx, { userId, actorId: userId, action: "ai.generate", targetType: "ai", metadata: { kind } });
  });
}

/* ------------------------------- text gen -------------------------------- */

export type TextResult = { text: string };

const TONE_HINT: Record<string, string> = {
  professional: "polished and professional",
  concise: "tight and concise",
  confident: "confident and impactful",
  friendly: "warm and approachable",
};

export async function generateText(
  userId: string,
  input: { kind: "bio" | "project" | "headline"; notes: string; tone: string },
): Promise<TextResult> {
  const inputHash = hash({ ...input, m: serverEnv().GEMINI_MODEL });
  const hit = await cached<TextResult>(userId, input.kind, inputHash);
  if (hit) return hit;

  const tone = TONE_HINT[input.tone] ?? TONE_HINT.professional;
  const shape =
    input.kind === "bio"
      ? "a first-person professional bio of 2-3 sentences"
      : input.kind === "headline"
        ? "a single punchy professional headline (max 8 words)"
        : "a crisp project description of 2-3 sentences focused on impact";

  const prompt = [
    `You are an expert career writer. Write ${shape}.`,
    `Tone: ${tone}.`,
    `Use ONLY the facts in the notes below — never invent roles, employers, metrics or technologies.`,
    `Do not use buzzword filler. Return strictly JSON: {"text": "..."}.`,
    ``,
    `Notes:\n${input.notes}`,
  ].join("\n");

  const result = await generateJson<TextResult>(prompt);
  const out: TextResult = { text: (result.text ?? "").trim() };
  await store(userId, input.kind, inputHash, input, out);
  return out;
}

/* -------------------------------- tailor --------------------------------- */

export type TailorResult = {
  matchScore: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  rewrittenBullets: { before: string; after: string }[];
  missingKeywords: string[];
};

export async function tailorToJob(
  userId: string,
  input: { jobDescription: string },
): Promise<TailorResult> {
  const bundle = await getBundle(userId);
  const profile = {
    headline: bundle.portfolio.headline,
    bio: bundle.portfolio.bio,
    projects: bundle.projects.map((p) => ({ title: p.title, role: p.role, summary: p.summary, tags: p.tags })),
    experience: bundle.experiences.map((e) => ({ company: e.company, role: e.role, summary: e.summary })),
    skills: bundle.skills.flatMap((s) => s.items),
  };

  const inputHash = hash({ jd: input.jobDescription, profile, m: serverEnv().GEMINI_MODEL });
  const hit = await cached<TailorResult>(userId, "tailor", inputHash);
  if (hit) return hit;

  const prompt = [
    `You are an expert technical recruiter and CV editor.`,
    `Given a candidate's real portfolio and a job description, assess fit and tailor their CV.`,
    `CRITICAL: use ONLY the candidate's real experience below. Never invent experience, employers, metrics or skills they don't have. If something is missing, list it as a gap — do not fabricate it.`,
    ``,
    `Return strictly JSON with this shape:`,
    `{"matchScore": <0-100 integer>, "summary": "<2-sentence fit summary>", "strengths": ["..."], "gaps": ["..."], "rewrittenBullets": [{"before":"<an existing bullet>","after":"<tailored rewrite using only real facts>"}], "missingKeywords": ["..."]}`,
    ``,
    `Candidate portfolio (JSON):\n${JSON.stringify(profile)}`,
    ``,
    `Job description:\n${input.jobDescription}`,
  ].join("\n");

  const raw = await generateJson<Partial<TailorResult>>(prompt);
  const out: TailorResult = {
    matchScore: Math.max(0, Math.min(100, Math.round(Number(raw.matchScore) || 0))),
    summary: String(raw.summary ?? ""),
    strengths: (raw.strengths ?? []).slice(0, 6).map(String),
    gaps: (raw.gaps ?? []).slice(0, 6).map(String),
    rewrittenBullets: (raw.rewrittenBullets ?? [])
      .slice(0, 6)
      .map((b) => ({ before: String(b?.before ?? ""), after: String(b?.after ?? "") })),
    missingKeywords: (raw.missingKeywords ?? []).slice(0, 12).map(String),
  };
  await store(userId, "tailor", inputHash, { jobDescription: input.jobDescription }, out);
  return out;
}
