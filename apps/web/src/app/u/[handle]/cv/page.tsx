import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicByHandle } from "@/lib/services/portfolio";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

function monthYear(v: string | null): string {
  if (!v) return "Present";
  const [y, m] = v.split("-");
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(m) - 1]} ${y}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${handle} — CV` };
}

const PRINT_CSS = `
  @page { margin: 18mm 16mm; }
  @media print {
    .no-print { display: none !important; }
    html, body { background: #fff !important; }
  }
`;

export default async function CvPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) notFound();
  const { portfolio: p, projects, experiences, education, skills } = bundle;

  const ink = "#111114";
  const dim = "#3a3a40";
  const muted = "#6b6b73";
  const line = "#e3e3e6";

  return (
    <div style={{ background: "#fff", minHeight: "100dvh" }}>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 32px", color: ink, fontFamily: "var(--font-sans)" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <PrintButton />
        </div>

        {/* Header */}
        <header style={{ borderBottom: `2px solid ${ink}`, paddingBottom: 16 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{p.name || handle}</h1>
          {!!p.headline && <p style={{ margin: "4px 0 0", fontSize: 15, color: dim }}>{p.headline}</p>}
          <p style={{ margin: "10px 0 0", fontSize: 12.5, color: muted, fontFamily: "var(--font-mono)" }}>
            {[p.location, ...p.links.map((l) => `${l.label}: ${l.url}`)].filter(Boolean).join("   ·   ")}
          </p>
        </header>

        {!!p.bio && (
          <p style={{ marginTop: 18, fontSize: 13.5, lineHeight: 1.6, color: dim }}>{p.bio}</p>
        )}

        {experiences.length > 0 && (
          <Section title="Experience" line={line} muted={muted}>
            {experiences.map((e) => (
              <div key={e.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <strong style={{ fontSize: 14 }}>{e.role} · <span style={{ fontWeight: 400, color: dim }}>{e.company}</span></strong>
                  <span style={{ fontSize: 11.5, color: muted, fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                    {monthYear(e.start)} — {monthYear(e.end)}
                  </span>
                </div>
                {!!e.summary && <p style={{ margin: "3px 0 0", fontSize: 13, lineHeight: 1.55, color: dim }}>{e.summary}</p>}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Selected work" line={line} muted={muted}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <strong style={{ fontSize: 14 }}>{proj.title}{proj.role ? <span style={{ fontWeight: 400, color: dim }}> · {proj.role}</span> : null}</strong>
                  {!!proj.year && <span style={{ fontSize: 11.5, color: muted, fontFamily: "var(--font-mono)" }}>{proj.year}</span>}
                </div>
                {!!proj.summary && <p style={{ margin: "3px 0 0", fontSize: 13, lineHeight: 1.55, color: dim }}>{proj.summary}</p>}
                {proj.tags.length > 0 && (
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: muted, fontFamily: "var(--font-mono)" }}>{proj.tags.join(" · ")}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" line={line} muted={muted}>
            {skills.map((g) => (
              <p key={g.id} style={{ margin: "0 0 6px", fontSize: 13 }}>
                <strong>{g.label}:</strong> <span style={{ color: dim }}>{g.items.join(", ")}</span>
              </p>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" line={line} muted={muted}>
            {education.map((ed) => (
              <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
                <strong style={{ fontSize: 14 }}>{ed.school} <span style={{ fontWeight: 400, color: dim }}>· {ed.degree}</span></strong>
                <span style={{ fontSize: 11.5, color: muted, fontFamily: "var(--font-mono)" }}>{ed.start}—{ed.end}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  line,
  muted,
  children,
}: {
  title: string;
  line: string;
  muted: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2
        style={{
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: muted,
          fontFamily: "var(--font-mono)",
          borderBottom: `1px solid ${line}`,
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
