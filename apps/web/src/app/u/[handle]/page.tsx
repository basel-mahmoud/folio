import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileDown } from "lucide-react";
import { getPublicByHandle } from "@/lib/services/portfolio";

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
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) return { title: "Not found" };
  const { portfolio: p } = bundle;
  const title = `${p.name || handle} — ${p.headline || "Portfolio"}`;
  const description = p.bio || `${p.name}'s portfolio on Folio.`;
  return {
    title,
    description,
    openGraph: { title, description, type: "profile" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function Marker({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-xs text-accent">{index}</span>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export default async function PublicPortfolio({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  if (!bundle) notFound();
  const { portfolio: p, projects, experiences, education, skills } = bundle;

  let n = 1;
  const next = () => String(++n).padStart(2, "0");

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      {/* Identity */}
      <header className="rise">
        {!!p.headline && (
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{p.headline}</p>
        )}
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {p.name || handle}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px]">
          {!!p.location && <span className="text-muted">{p.location}</span>}
          {p.links.map((l) => (
            <a
              key={l.label}
              href={l.url.startsWith("http") ? l.url : `https://${l.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-ink transition-colors hover:text-accent"
            >
              {l.label}
              <ArrowUpRight size={12} className="text-faint" />
            </a>
          ))}
        </div>
        {!!p.bio && <p className="mt-6 text-[15px] leading-relaxed text-ink-dim">{p.bio}</p>}

        <a
          href={`/u/${p.handle}/cv`}
          className="font-mono mt-7 inline-flex items-center gap-2 rounded-[var(--border-radius-md,10px)] border border-border-strong px-3.5 py-2 text-[13px] text-ink transition-colors hover:bg-surface-2"
          style={{ borderRadius: 10 }}
        >
          <FileDown size={14} />
          Download CV
        </a>
      </header>

      {projects.length > 0 && (
        <section className="mt-20 rise">
          <Marker index="02" label="Selected work" />
          <div className="space-y-8">
            {projects.map((proj) => (
              <article key={proj.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{proj.title}</h3>
                    {!!proj.role && <p className="font-mono text-xs text-muted">{proj.role}</p>}
                  </div>
                  {!!proj.year && <span className="font-mono text-xs text-faint">{proj.year}</span>}
                </div>
                {!!proj.summary && <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{proj.summary}</p>}
                {proj.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {proj.tags.map((t) => (
                      <span key={t} className="font-mono rounded-[6px] border border-border-strong px-2 py-0.5 text-[11px] text-ink-dim">{t}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mt-20 rise">
          <Marker index={next()} label="Experience" />
          <div className="divide-y divide-[var(--border)]">
            {experiences.map((e) => (
              <div key={e.id} className="py-5 first:pt-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-ink">{e.role}</h3>
                    <p className="text-sm text-muted">{e.company}</p>
                  </div>
                  <span className="font-mono text-[11px] text-muted">{monthYear(e.start)} — {monthYear(e.end)}</span>
                </div>
                {!!e.summary && <p className="mt-2 text-[15px] leading-relaxed text-ink-dim">{e.summary}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-20 rise">
          <Marker index={next()} label="Skills" />
          <div className="space-y-4">
            {skills.map((g) => (
              <div key={g.id}>
                <p className="text-xs text-faint">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <span key={s} className="font-mono rounded-[6px] border border-border-strong px-2 py-0.5 text-[11px] text-ink-dim">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-20 rise">
          <Marker index={next()} label="Education" />
          <div className="space-y-3">
            {education.map((ed) => (
              <div key={ed.id} className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-ink">{ed.school}</h3>
                  <p className="text-sm text-muted">{ed.degree}</p>
                </div>
                <span className="font-mono text-xs text-muted">{ed.start}—{ed.end}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-24 border-t border-border pt-6">
        <a href="/" className="font-mono text-xs text-faint transition-colors hover:text-ink">
          Built with Folio ↗
        </a>
      </footer>
    </main>
  );
}
