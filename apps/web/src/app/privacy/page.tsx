import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <Link href="/" className="font-mono text-xs uppercase tracking-[0.18em] text-accent">← Folio</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink">Privacy</h1>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink-dim">
        <p>
          Folio stores only what you put into your portfolio (name, headline, bio,
          links, projects, experience, education, skills) and the email tied to
          your account. We use it solely to render your portfolio and power the AI
          features you trigger.
        </p>
        <div>
          <h2 className="text-lg font-semibold text-ink">Your data, your control</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>Export everything at any time (in-app, or <code className="font-mono">GET /api/me/export</code>).</li>
            <li>Delete your account and all associated data permanently (in-app, or <code className="font-mono">DELETE /api/me</code>).</li>
            <li>Your portfolio is private until you choose to publish it.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">Processors</h2>
          <p className="mt-3">
            Identity is handled by Clerk, the database by Neon, hosting by Vercel,
            and AI generation by Google Gemini — each receiving only the data
            needed for that function. Data is encrypted in transit and at rest.
          </p>
        </div>
        <p className="text-sm text-muted">Folio is a personal project by Basel Mahmoud. Questions: hello@basel.dev.</p>
      </div>
    </main>
  );
}
