import Link from "next/link";
import { ArrowUpRight, FileDown } from "lucide-react";
import type { PortfolioBundle } from "@/lib/services/portfolio";
import { Reveal } from "@/components/reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { SplitText } from "@/components/motion/split-text";

function monthYear(v: string | null): string {
  if (!v) return "Present";
  const [y, m] = v.split("-");
  if (!m) return y;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[Number(m) - 1]} ${y}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name.slice(0, 2) || "··").toUpperCase();
}

const href = (url: string) => (url.startsWith("http") ? url : `https://${url}`);

/** Plain section heading + trailing hairline. No numbered scaffolding. */
function SectionHead({ label }: { label: string }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <h2 className="display text-xl text-ink">{label}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="font-mono rounded-[6px] border border-border-strong px-2 py-0.5 text-[11px] text-ink-dim">{children}</span>;
}

/**
 * The public portfolio (brand surface, "experience" mode): the person's work
 * leads, the interface recedes. Identity enters on first paint; sections
 * settle in as they scroll into view.
 */
export function PortfolioView({ bundle, handle }: { bundle: PortfolioBundle; handle: string }) {
  const { portfolio: p, projects, experiences, education, skills } = bundle;
  const name = p.name || handle;

  return (
    <main className="relative mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="grad-hairline fixed inset-x-0 top-0 z-10" />
      <div aria-hidden className="dot-field pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 [mask-image:radial-gradient(60%_100%_at_30%_0%,#000,transparent)]" />

      {/* Identity */}
      <header>
        <div className="flex items-center gap-4">
          <div className="enter tile-accent flex h-14 w-14 shrink-0 items-center justify-center rounded-[15px]">
            <span className="font-mono text-base font-semibold text-ink">{initials(name)}</span>
          </div>
          <div className="min-w-0">
            <SplitText as="h1" trigger="mount" text={name} delay={0.05} className="display text-[clamp(2rem,6vw,2.75rem)] leading-[1.05] text-ink" />
            {!!p.headline && (
              <p className="enter mt-1 text-[15px] text-ink-dim" style={{ "--d": "0.2s" } as React.CSSProperties}>
                {p.headline}
              </p>
            )}
          </div>
        </div>

        <div className="enter mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px]" style={{ "--d": "0.28s" } as React.CSSProperties}>
          {!!p.location && <span className="text-muted">{p.location}</span>}
          {p.links.map((l) => (
            <a
              key={l.label}
              href={href(l.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-ink transition-colors hover:text-accent"
            >
              {l.label}
              <ArrowUpRight size={12} className="text-faint transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-px" />
            </a>
          ))}
        </div>

        {!!p.bio && (
          <p className="enter mt-6 max-w-prose text-pretty text-[15.5px] leading-relaxed text-ink-dim" style={{ "--d": "0.36s" } as React.CSSProperties}>
            {p.bio}
          </p>
        )}

        <div className="enter mt-8 flex flex-wrap items-center gap-4" style={{ "--d": "0.44s" } as React.CSSProperties}>
          <a href={`/u/${p.handle}/cv`} className="btn-grad inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-medium">
            <FileDown size={14} />
            Download CV
          </a>
          <a href={`/u/${p.handle}/cv?template=harvard`} className="font-mono text-[12px] text-muted transition-colors hover:text-ink">
            Harvard format
          </a>
        </div>
      </header>

      {projects.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <SectionHead label="Selected work" />
          </Reveal>
          <div className="-mx-4 space-y-3">
            {projects.map((proj, i) => (
              <Reveal key={proj.id} delay={Math.min(i, 4) * 0.06}>
                <Spotlight className="rounded-[16px] border border-transparent px-4 py-4 transition-colors duration-300 hover:border-border hover:bg-surface/40">
                  <article className="relative z-[1]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-ink">
                          {proj.link ? (
                            <a href={href(proj.link)} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent">
                              {proj.title}
                              <ArrowUpRight size={14} className="text-faint transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-px group-hover:translate-x-px" />
                            </a>
                          ) : (
                            proj.title
                          )}
                        </h3>
                        {!!proj.role && <p className="font-mono text-xs text-muted">{proj.role}</p>}
                      </div>
                      {!!proj.year && <span className="font-mono shrink-0 text-xs text-muted">{proj.year}</span>}
                    </div>
                    {!!proj.summary && <p className="mt-2 text-pretty text-[15px] leading-relaxed text-ink-dim">{proj.summary}</p>}
                    {proj.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {proj.tags.map((t) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </div>
                    )}
                  </article>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <SectionHead label="Experience" />
          </Reveal>
          <ol className="relative ml-1 border-l border-border">
            {experiences.map((e, i) => (
              <li key={e.id} className="relative pb-9 pl-6 last:pb-0">
                <Reveal delay={Math.min(i, 4) * 0.06}>
                  <span
                    aria-hidden
                    className={`absolute -left-[4.5px] top-2 h-2 w-2 rounded-full ${e.end ? "bg-border-strong" : "tile-accent"}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="font-medium text-ink">
                      {e.role} <span className="font-normal text-muted">· {e.company}</span>
                    </h3>
                    <span className="font-mono text-[11px] text-muted">
                      {monthYear(e.start)} - {monthYear(e.end)}
                    </span>
                  </div>
                  {!!e.summary && <p className="mt-2 text-pretty text-[15px] leading-relaxed text-ink-dim">{e.summary}</p>}
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      )}

      {skills.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <SectionHead label="Skills" />
          </Reveal>
          <div className="space-y-4">
            {skills.map((g, i) => (
              <Reveal key={g.id} delay={Math.min(i, 4) * 0.05}>
                <div className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:gap-5">
                  <p className="text-sm text-muted sm:pt-0.5">{g.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <SectionHead label="Education" />
          </Reveal>
          <div className="space-y-4">
            {education.map((ed) => (
              <Reveal key={ed.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-ink">{ed.school}</h3>
                    <p className="text-sm text-muted">{ed.degree}</p>
                  </div>
                  <span className="font-mono shrink-0 text-xs text-muted">
                    {ed.start} - {ed.end}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-24 flex items-center justify-between border-t border-border pt-6">
        <Link href="/" className="group font-mono inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-ink">
          Built with Folio
          <ArrowUpRight size={12} className="text-faint transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
        <a href={`/u/${p.handle}/cv`} className="font-mono text-xs text-muted transition-colors hover:text-ink">
          CV
        </a>
      </footer>
    </main>
  );
}
