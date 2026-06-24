import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicByHandle, type PortfolioBundle } from "@/lib/services/portfolio";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "var(--font-sans)";
const MONO = "var(--font-mono)";
const INK = "#111114";
const DIM = "#3a3a40";
const MUTED = "#6b6b73";
const LINE = "#e3e3e6";

function monthYear(v: string | null): string {
  if (!v) return "Present";
  const [y, m] = v.split("-");
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(m) - 1]} ${y}`;
}
const sentences = (s: string) =>
  s.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${handle} — CV` };
}

const PRINT_CSS = `
  @page { margin: 16mm 16mm; }
  @media print { .no-print { display: none !important; } html, body { background:#fff !important; } }
`;

export default async function CvPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ template?: string }>;
}) {
  const { handle } = await params;
  const { template } = await searchParams;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) notFound();
  const harvard = template === "harvard";

  return (
    <div style={{ background: "#fff", minHeight: "100dvh" }}>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "36px 32px" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 12 }}>
          <div style={{ display: "flex", gap: 8, fontFamily: MONO, fontSize: 12 }}>
            <a href={`/u/${handle}/cv`} style={{ color: harvard ? "#888" : "#111", fontWeight: harvard ? 400 : 700 }}>Modern</a>
            <span style={{ color: "#ccc" }}>/</span>
            <a href={`/u/${handle}/cv?template=harvard`} style={{ color: harvard ? "#111" : "#888", fontWeight: harvard ? 700 : 400 }}>Harvard</a>
          </div>
          <PrintButton />
        </div>
        {harvard ? <HarvardBody b={bundle} /> : <ModernBody b={bundle} handle={handle} />}
      </div>
    </div>
  );
}

/* ----------------------------- Harvard layout ---------------------------- */

function HHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: SERIF, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #000", paddingBottom: 2, marginTop: 16, marginBottom: 6 }}>
      {children}
    </div>
  );
}
function HRow({ left, right }: { left: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, fontFamily: SERIF, fontSize: 12.5 }}>
      <span>{left}</span>
      {right ? <span style={{ whiteSpace: "nowrap" }}>{right}</span> : null}
    </div>
  );
}
function HBullets({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul style={{ margin: "2px 0 0", paddingLeft: 18, fontFamily: SERIF, fontSize: 12, lineHeight: 1.4 }}>
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}

function HarvardBody({ b }: { b: PortfolioBundle }) {
  const { portfolio: p, projects, experiences, education, skills } = b;
  const contact = [p.location, ...p.links.map((l) => l.url)].filter(Boolean).join("  •  ");
  return (
    <div style={{ color: "#000", fontFamily: SERIF }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{p.name || "Your Name"}</div>
        <div style={{ fontSize: 11, marginTop: 2 }}>{contact}</div>
      </div>

      {education.length > 0 && (
        <section>
          <HHead>Education</HHead>
          {education.map((ed) => (
            <div key={ed.id} style={{ marginBottom: 6 }}>
              <HRow left={<b>{ed.school}</b>} right={`${ed.start}–${ed.end}`} />
              <div style={{ fontStyle: "italic", fontSize: 12 }}>{ed.degree}</div>
            </div>
          ))}
        </section>
      )}

      {experiences.length > 0 && (
        <section>
          <HHead>Experience</HHead>
          {experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 8 }}>
              <HRow left={<b>{e.company}</b>} right={`${monthYear(e.start)} – ${monthYear(e.end)}`} />
              <div style={{ fontStyle: "italic", fontSize: 12 }}>{e.role}</div>
              <HBullets items={sentences(e.summary)} />
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section>
          <HHead>Projects</HHead>
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 8 }}>
              <HRow left={<b>{pr.title}</b>} right={pr.year} />
              {!!pr.role && <div style={{ fontStyle: "italic", fontSize: 12 }}>{pr.role}</div>}
              <HBullets items={sentences(pr.summary)} />
              {pr.tags.length > 0 && <div style={{ fontSize: 11.5 }}>{pr.tags.join(" · ")}</div>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <HHead>Skills &amp; Interests</HHead>
          {skills.map((g) => (
            <div key={g.id} style={{ fontSize: 12, marginBottom: 2 }}>
              <b>{g.label}:</b> {g.items.join(", ")}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

/* ------------------------------ Modern layout ---------------------------- */

function ModSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 22 }}>
      <h2 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.16em", color: MUTED, fontFamily: MONO, borderBottom: `1px solid ${LINE}`, paddingBottom: 6, marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

function ModernBody({ b, handle }: { b: PortfolioBundle; handle: string }) {
  const { portfolio: p, projects, experiences, education, skills } = b;
  return (
    <div style={{ color: INK, fontFamily: SANS }}>
      <header style={{ borderBottom: `2px solid ${INK}`, paddingBottom: 16 }}>
        <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>{p.name || handle}</h1>
        {!!p.headline && <p style={{ margin: "4px 0 0", fontSize: 15, color: DIM }}>{p.headline}</p>}
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: MUTED, fontFamily: MONO }}>
          {[p.location, ...p.links.map((l) => `${l.label}: ${l.url}`)].filter(Boolean).join("   ·   ")}
        </p>
      </header>
      {!!p.bio && <p style={{ marginTop: 18, fontSize: 13.5, lineHeight: 1.6, color: DIM }}>{p.bio}</p>}

      {experiences.length > 0 && (
        <ModSection title="Experience">
          {experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <strong style={{ fontSize: 14 }}>{e.role} · <span style={{ fontWeight: 400, color: DIM }}>{e.company}</span></strong>
                <span style={{ fontSize: 11.5, color: MUTED, fontFamily: MONO, whiteSpace: "nowrap" }}>{monthYear(e.start)} — {monthYear(e.end)}</span>
              </div>
              {!!e.summary && <p style={{ margin: "3px 0 0", fontSize: 13, lineHeight: 1.55, color: DIM }}>{e.summary}</p>}
            </div>
          ))}
        </ModSection>
      )}

      {projects.length > 0 && (
        <ModSection title="Selected work">
          {projects.map((pr) => (
            <div key={pr.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <strong style={{ fontSize: 14 }}>{pr.title}{pr.role ? <span style={{ fontWeight: 400, color: DIM }}> · {pr.role}</span> : null}</strong>
                {!!pr.year && <span style={{ fontSize: 11.5, color: MUTED, fontFamily: MONO }}>{pr.year}</span>}
              </div>
              {!!pr.summary && <p style={{ margin: "3px 0 0", fontSize: 13, lineHeight: 1.55, color: DIM }}>{pr.summary}</p>}
              {pr.tags.length > 0 && <p style={{ margin: "4px 0 0", fontSize: 11.5, color: MUTED, fontFamily: MONO }}>{pr.tags.join(" · ")}</p>}
            </div>
          ))}
        </ModSection>
      )}

      {skills.length > 0 && (
        <ModSection title="Skills">
          {skills.map((g) => (
            <p key={g.id} style={{ margin: "0 0 6px", fontSize: 13 }}><strong>{g.label}:</strong> <span style={{ color: DIM }}>{g.items.join(", ")}</span></p>
          ))}
        </ModSection>
      )}

      {education.length > 0 && (
        <ModSection title="Education">
          {education.map((ed) => (
            <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
              <strong style={{ fontSize: 14 }}>{ed.school} <span style={{ fontWeight: 400, color: DIM }}>· {ed.degree}</span></strong>
              <span style={{ fontSize: 11.5, color: MUTED, fontFamily: MONO }}>{ed.start}—{ed.end}</span>
            </div>
          ))}
        </ModSection>
      )}
    </div>
  );
}
