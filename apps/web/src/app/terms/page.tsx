import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms" };

export default function Terms() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-accent">← Folio</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Terms</h1>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-dim">
        <p>
          Folio is provided as-is for building and sharing your professional
          portfolio. You own the content you create and are responsible for its
          accuracy. Don&apos;t use Folio to post unlawful content or to impersonate
          others.
        </p>
        <p>
          AI suggestions are drafts to assist you — review them before publishing.
          The service may change or pause; you can export or delete your data at
          any time.
        </p>
        <p className="text-sm text-muted">A personal project by Basel Mahmoud.</p>
      </div>
    </main>
  );
}
