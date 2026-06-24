import { ArrowUpRight } from "lucide-react";

/**
 * Marketing/landing placeholder. The real surface here is the public portfolio
 * pages at /u/[handle] (built in M5). The portfolio is authored in the native
 * Folio app; this page is the web front door + where public profiles live.
 */
export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-20">
      <div className="rise">
        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <span className="inline-block h-4 w-4 rounded-[5px] bg-accent" />
          <span className="font-mono text-[15px] font-bold tracking-[0.25em] text-ink">
            FOLIO
          </span>
        </div>

        <p className="font-mono mt-12 text-xs uppercase tracking-[0.2em] text-accent">
          AI portfolio &amp; CV builder
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
          Your work, presented
          <br />
          with intent.
        </h1>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-dim">
          Build a live, shareable portfolio in the Folio app. AI polishes every
          word and tailors your CV to any role in seconds — then publishes a
          fast, clean page recruiters can open anywhere.
        </p>

        {/* Public URL pattern */}
        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="font-mono text-[13px] text-muted">
            folio.app/u/&lt;handle&gt;
          </span>
        </div>

        <div className="mt-12 flex items-center gap-6 border-t border-border pt-6">
          <a
            href="https://github.com/basel-mahmoud/folio"
            className="font-mono inline-flex items-center gap-1.5 text-[13px] text-ink-dim transition-colors hover:text-ink"
          >
            GitHub
            <ArrowUpRight size={13} strokeWidth={2} className="text-faint" />
          </a>
          <span className="font-mono text-[13px] text-faint">
            Built by Basel Mahmoud
          </span>
        </div>
      </div>
    </main>
  );
}
