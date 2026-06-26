import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  Smartphone,
  Wand2,
  Share2,
  ShieldCheck,
  LayoutGrid,
  RefreshCw,
  Check,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { Hero } from "@/components/hero";
import { Device } from "@/components/device";
import { CtaButton } from "@/components/cta-button";

const capabilities = [
  {
    icon: LayoutGrid,
    title: "Live native builder",
    body: "Compose profile, projects, experience and skills in a fast mobile app with an instant preview.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Row-level data isolation, full export, and one-click account deletion. Your data is yours.",
  },
  {
    icon: Smartphone,
    title: "A real Android app",
    body: "Not a wrapper — a native Expo build you install as an APK, backed by a typed, hardened API.",
  },
  {
    icon: RefreshCw,
    title: "Always in sync",
    body: "Your web page and both résumé formats regenerate from one source of truth, instantly.",
  },
];

const steps = [
  { n: "1", t: "Install the app", b: "Download the APK and sign in. Pick your handle — that becomes your public URL." },
  { n: "2", t: "Build & polish", b: "Add your work, then let AI sharpen the words. The preview updates live." },
  { n: "3", t: "Share & tailor", b: "Publish your page, export a Modern or Harvard CV, and re-tailor for each role." },
];

const TECH = ["Next.js 16", "React Native", "Expo", "Neon Postgres", "Drizzle ORM", "Clerk", "Gemini", "TypeScript", "Reanimated", "Row-level security", "Vercel"];

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo size={22} />
      <span className="font-mono text-[15px] font-bold tracking-[0.22em] text-ink">FOLIO</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-clip">
      <div className="grad-hairline" />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Wordmark />
          <div className="flex items-center gap-1">
            <Link href="/u/basel" className="hidden rounded-[8px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">Live example</Link>
            <a href="https://github.com/basel-mahmoud/folio" className="hidden rounded-[8px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">GitHub</a>
            <a href="/download" className="btn-grad ml-1 inline-flex items-center gap-1.5 rounded-[9px] px-3.5 py-2 text-sm font-medium">
              <Download size={15} /> Download
            </a>
          </div>
        </nav>
      </header>

      {/* Hero (orchestrated motion + real app screenshot) */}
      <Hero />

      {/* Tech marquee */}
      <div
        className="overflow-hidden border-y border-border py-4"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
      >
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center gap-7 pr-7" aria-hidden={k === 1}>
              {TECH.map((t) => (
                <span key={t} className="flex items-center gap-7">
                  <span className="font-mono text-sm whitespace-nowrap text-muted">{t}</span>
                  <span className="text-faint">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Section lead */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-4">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.6rem] sm:leading-[1.1]">
            Not a description of an app. The app itself.
          </h2>
          <p className="mt-4 max-w-lg text-pretty text-ink-dim">
            Every screen below is the real product — the same build you install. Here&apos;s what it does.
          </p>
        </Reveal>
      </section>

      {/* Feature row 1 — AI (text / device) */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="tile-accent inline-flex h-11 w-11 items-center justify-center rounded-[12px]">
              <Wand2 size={20} className="text-accent" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">AI that writes with you.</h3>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-ink-dim">
              Gemini polishes your bio and project write-ups, scores your fit against a job, and rewrites
              your bullets to match — using only your real experience. Never invented claims.
            </p>
            <ul className="mt-5 space-y-2.5">
              {["Tailor your CV to any role in seconds", "A match score with concrete gaps to close", "Before → after rewrites you can accept or skip"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-dim">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <Device src="/app/tailor.png" alt="Folio's Tailor screen — paste a job description, pick a sample role, and see how AI tailors the CV" parallax maxWidth={272} />
          </Reveal>
        </div>
      </section>

      {/* Feature row 2 — Web page (device / text) */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <Device src="/app/preview.png" alt="Folio's portfolio preview — name, headline, bio, and selected work with tech tags" parallax maxWidth={272} />
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="tile-accent inline-flex h-11 w-11 items-center justify-center rounded-[12px]">
              <Share2 size={20} className="text-accent" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">A web home you can share anywhere.</h3>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-ink-dim">
              Publish to a fast, accessible page at your own handle. Drop it on every application, in your
              email signature, on LinkedIn.
            </p>
            <div className="font-mono mt-5 inline-flex items-center gap-2 rounded-[9px] border border-border-strong bg-surface px-3 py-2 text-sm text-ink-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> folio.app/u/<span className="text-ink">you</span>
            </div>
            <div className="mt-6">
              <Link href="/u/basel" className="font-mono inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
                Open a live example <ArrowUpRight size={14} className="text-faint" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feature row 3 — Résumés (text / CV asset) */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="tile-accent inline-flex h-11 w-11 items-center justify-center rounded-[12px]">
              <Download size={20} className="text-accent" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">One profile. Two recruiter-ready CVs.</h3>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-ink-dim">
              Export a clean modern résumé or an exact, ATS-friendly Harvard-format résumé — both generated
              from the same data and downloadable as PDF.
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {["Exact Harvard one-page layout", "Modern editorial layout", "Save-as-PDF anywhere", "Always in sync"].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-ink-dim">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/u/basel/cv?template=harvard" className="font-mono mt-6 inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
              View a Harvard CV <ArrowUpRight size={14} className="text-faint" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lift rounded-[16px] border border-border bg-surface p-5">
              <div className="rounded-[10px] bg-[#fff] p-7 text-[#111] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.7)]">
                <p className="text-center text-lg font-semibold tracking-tight">Basel Mahmoud</p>
                <p className="text-center text-[11px] text-[#555]">Amman, Jordan · github.com/basel-mahmoud · hello@basel.dev</p>
                <div className="mt-4 border-t border-[#222] pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444]">Education</div>
                <p className="mt-1.5 text-[11px]"><b>University of Jordan</b> — B.Sc. Computer Science</p>
                <div className="mt-3 border-t border-[#222] pt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#444]">Experience</div>
                <p className="mt-1.5 text-[11px]"><b>Full-stack engineer</b> · Independent</p>
                <p className="text-[10px] leading-relaxed text-[#555]">Design, build and ship end-to-end products with tests and CI/CD.</p>
                <p className="text-[10px] leading-relaxed text-[#555]">Multi-tenant SaaS with row-level security and AI integrations.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Capabilities — typographic spec list, not cards */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-[2.6rem] sm:leading-[1.1]">Built like production software.</h2>
          <p className="mt-4 max-w-lg text-pretty text-ink-dim">Because it is. The same hardening that ships in real products — applied to your portfolio.</p>
        </Reveal>
        <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.08}>
              <div className="flex gap-4 border-t border-border pt-6">
                <c.icon size={20} className="mt-0.5 shrink-0 text-accent" strokeWidth={1.75} />
                <div>
                  <h3 className="font-semibold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works — sequenced timeline (numbers earn their place) */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Reveal><h2 className="text-center text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">Live in three steps.</h2></Reveal>
        <div className="relative mt-14">
          <div className="grad-hairline absolute left-0 right-0 top-5 hidden opacity-30 md:block" />
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="tile-accent relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg font-mono text-sm font-semibold text-ink">{s.n}</div>
                <h3 className="mt-5 text-xl font-semibold text-ink">{s.t}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-dim">{s.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[22px] border border-border-strong bg-surface p-10 text-center sm:p-16">
            <div className="grad-hairline absolute inset-x-0 top-0" />
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">Make the page that gets you hired.</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-dim">Install the app, build your portfolio, share it anywhere.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CtaButton href="/download"><Download size={17} /> Download the APK</CtaButton>
              <Link href="/u/basel" className="font-mono text-sm text-ink-dim transition-colors hover:text-ink">or see a live example →</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Wordmark />
          <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} Folio · Built by Basel Mahmoud</p>
          <div className="flex gap-4 text-xs text-muted">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <a href="https://github.com/basel-mahmoud/folio" className="hover:text-ink">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
