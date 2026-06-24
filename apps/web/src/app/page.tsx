import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Download,
  Smartphone,
  Wand2,
  FileText,
  Share2,
  ShieldCheck,
  LayoutGrid,
  Check,
} from "lucide-react";

const features = [
  { icon: LayoutGrid, title: "Live native builder", body: "Compose your profile, projects, experience and skills in a fast mobile app with an instant preview." },
  { icon: Wand2, title: "AI that writes with you", body: "Gemini polishes your bio and project write-ups and tailors your CV to any job — using only your real experience." },
  { icon: FileText, title: "Modern + Harvard résumés", body: "Export a clean, recruiter-ready PDF — including an exact Harvard-format résumé — from the same structured data." },
  { icon: Share2, title: "A shareable web home", body: "Publish to folio.app/u/you — a fast, accessible page you can put on every application." },
  { icon: ShieldCheck, title: "Private by design", body: "Row-level data isolation, full export, and one-click account deletion. Your data is yours." },
  { icon: Smartphone, title: "Real Android app", body: "Not a wrapper — a native Expo build you install as an APK, backed by a typed, hardened API." },
];

const steps = [
  { n: "01", t: "Install the app", b: "Download the APK and sign in. Pick your handle — that's your public URL." },
  { n: "02", t: "Build & polish", b: "Add your work, then let AI sharpen the words. Watch the preview update live." },
  { n: "03", t: "Share & tailor", b: "Publish your page, export a Modern or Harvard CV, and re-tailor for each role." },
];

function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-block h-[18px] w-[18px] rounded-[5px] bg-accent" />
      <span className="font-mono text-[15px] font-bold tracking-[0.22em] text-ink">FOLIO</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative overflow-clip">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Wordmark />
          <div className="flex items-center gap-2">
            <Link href="/u/basel" className="hidden rounded-[8px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">
              Live example
            </Link>
            <a href="https://github.com/basel-mahmoud/folio" className="hidden rounded-[8px] px-3 py-2 text-sm text-ink-dim transition-colors hover:text-ink sm:block">
              GitHub
            </a>
            <a href="/download" className="inline-flex items-center gap-1.5 rounded-[8px] bg-accent px-3.5 py-2 text-sm font-medium text-[#fff]">
              <Download size={15} /> Download
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28">
        <div className="rise mx-auto max-w-3xl text-center">
          <span className="font-mono inline-flex items-center gap-2 rounded-full border border-border-strong px-3 py-1 text-xs uppercase tracking-[0.16em] text-ink-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> AI portfolio &amp; CV builder
          </span>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Your work, presented
            <br className="hidden sm:block" /> with intent.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ink-dim sm:text-lg">
            Build a live portfolio in a native app, let AI polish every word, and
            tailor your CV — Modern or Harvard — to any job. Publish a fast page
            recruiters can open anywhere.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/download" className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-6 py-3 text-[15px] font-medium text-[#fff] sm:w-auto">
              <Download size={17} /> Download the app
            </a>
            <Link href="/u/basel" className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-border-strong px-6 py-3 text-[15px] text-ink transition-colors hover:bg-surface-2 sm:w-auto">
              See a live example <ArrowRight size={16} />
            </Link>
          </div>
          <p className="font-mono mt-4 text-xs text-faint">Android APK · free · export anytime</p>
        </div>

        {/* Preview mock */}
        <div className="rise mx-auto mt-16 max-w-2xl" style={{ animationDelay: "0.15s" }}>
          <div className="overflow-hidden rounded-[16px] border border-border-strong bg-surface">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="font-mono text-xs text-muted">folio.app/u/basel</span>
            </div>
            <div className="p-7">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Full-stack engineer</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Basel Mahmoud</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                I build production-grade web and mobile apps — secure, tested and
                fast. Recently shipped multi-tenant SaaS with AI integrations.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Next.js", "React Native", "Postgres", "AI"].map((t) => (
                  <span key={t} className="font-mono rounded-[6px] border border-border-strong px-2 py-0.5 text-[11px] text-ink-dim">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Everything you need to stand out.</h2>
        <p className="mt-3 text-ink-dim">A portfolio, a CV, and an AI writing partner — in one calm, fast place.</p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[16px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article key={f.title} className="bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-border-strong">
                <f.icon size={18} className="text-accent" />
              </div>
              <h3 className="mt-4 font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Live in three steps.</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-[16px] border border-border bg-surface p-6">
              <span className="font-mono text-sm text-accent">{s.n}</span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Résumé templates */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Résumé templates</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">One profile. Two recruiter-ready CVs.</h2>
            <p className="mt-4 text-ink-dim">
              Export a clean modern résumé or an exact, ATS-friendly Harvard-format
              résumé — both generated from the same data and downloadable as PDF.
            </p>
            <ul className="mt-6 space-y-3">
              {["Exact Harvard one-page layout", "Modern editorial layout", "Save-as-PDF from any browser", "Always in sync with your portfolio"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <Check size={17} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-ink-dim">{t}</span>
                </li>
              ))}
            </ul>
            <Link href="/u/basel/cv?template=harvard" className="font-mono mt-7 inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-accent">
              View a Harvard CV <ArrowUpRight size={14} className="text-faint" />
            </Link>
          </div>
          <div className="rounded-[16px] border border-border bg-surface p-5">
            <div className="rounded-[10px] bg-[#fff] p-6 text-[#111]">
              <p className="text-center text-lg font-semibold">Basel Mahmoud</p>
              <p className="text-center text-[11px] text-[#555]">Amman, Jordan · github.com/basel-mahmoud · hello@basel.dev</p>
              <div className="mt-3 border-t border-[#222] pt-2 text-[10px] uppercase tracking-widest text-[#666]">Education</div>
              <p className="mt-1 text-[11px]"><b>University of Jordan</b> — B.Sc. Computer Science</p>
              <div className="mt-2 border-t border-[#ddd] pt-2 text-[10px] uppercase tracking-widest text-[#666]">Experience</div>
              <p className="mt-1 text-[11px]"><b>Full-stack engineer</b> · Independent</p>
              <p className="text-[10px] text-[#555]">Design, build and ship end-to-end products with tests and CI/CD.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-[20px] border border-border-strong bg-surface p-10 text-center sm:p-16">
          <h2 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Make the page that gets you hired.</h2>
          <p className="mx-auto mt-3 max-w-md text-ink-dim">Install the app, build your portfolio, share it anywhere.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/download" className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent px-6 py-3 text-[15px] font-medium text-[#fff]">
              <Download size={17} /> Download the APK
            </a>
            <Link href="/u/basel" className="font-mono text-sm text-ink-dim transition-colors hover:text-ink">or see a live example →</Link>
          </div>
        </div>
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
