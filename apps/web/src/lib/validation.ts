/**
 * Input contracts. Every mutating endpoint validates against these Zod schemas
 * before touching the database — combined with Drizzle's parameterised queries,
 * this is the injection/abuse boundary. `clean` strips control characters,
 * collapses whitespace and enforces length.
 */
import { z } from "zod";
import { RESERVED_USERNAMES } from "@/lib/ids";

/** Drop ASCII/Unicode control chars, collapse runs of whitespace, trim. */
const stripControl = (s: string) =>
  Array.from(s)
    .filter((ch) => {
      const c = ch.charCodeAt(0);
      return c >= 32 && c !== 127;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

const clean = (max: number) =>
  z.string().transform(stripControl).pipe(z.string().min(1).max(max));

const cleanOptional = (max: number) =>
  z
    .string()
    .transform(stripControl)
    .pipe(z.string().max(max))
    .optional()
    .default("");

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Handle must be at least 3 characters")
  .max(30, "Handle must be at most 30 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/,
    "Use lowercase letters, numbers and hyphens (no leading/trailing hyphen)",
  )
  .refine((h) => !RESERVED_USERNAMES.has(h), "That handle is reserved");

export const linkSchema = z.object({
  label: clean(40),
  url: clean(200),
});

export const profileSchema = z.object({
  name: cleanOptional(80),
  headline: cleanOptional(120),
  location: cleanOptional(80),
  bio: cleanOptional(600),
  links: z.array(linkSchema).max(8).optional().default([]),
  theme: z.enum(["system", "light", "dark"]).optional().default("system"),
});

export const projectSchema = z.object({
  title: clean(80),
  role: cleanOptional(80),
  year: cleanOptional(12),
  summary: cleanOptional(600),
  tags: z.array(clean(24)).max(12).optional().default([]),
  link: cleanOptional(200),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
});

export const experienceSchema = z.object({
  company: clean(80),
  role: cleanOptional(80),
  start: cleanOptional(7), // YYYY-MM
  end: z.string().max(7).nullable().optional(),
  summary: cleanOptional(600),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
});

export const educationSchema = z.object({
  school: clean(120),
  degree: cleanOptional(120),
  start: cleanOptional(7),
  end: cleanOptional(7),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
});

export const skillGroupSchema = z.object({
  label: clean(40),
  items: z.array(clean(40)).max(40).optional().default([]),
  sortOrder: z.number().int().min(0).max(9999).optional().default(0),
});

export const tailorInputSchema = z.object({
  jobDescription: clean(8000).pipe(
    z.string().min(40, "Paste a fuller job description"),
  ),
});

export const aiTextInputSchema = z.object({
  kind: z.enum(["bio", "project", "headline"]),
  notes: clean(2000),
  tone: z
    .enum(["professional", "concise", "confident", "friendly"])
    .optional()
    .default("professional"),
});

export type ProfileInput = z.infer<typeof profileSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
