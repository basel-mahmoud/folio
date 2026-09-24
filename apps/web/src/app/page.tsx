import Link from "next/link";
import QRCode from "qrcode";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { LogoMarquee } from "@/components/logo-marquee";
import { Story } from "@/components/story";
import { TailorDemo } from "@/components/tailor-demo";
import { Outputs } from "@/components/outputs";
import { Bento } from "@/components/bento";
import { Cta } from "@/components/cta";
import { SplitText } from "@/components/motion/split-text";

/** Public origin for the install QR. Falls back to production when unset/local. */
function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  const base = env && !env.includes("localhost") ? env : "https://folio-fawn-nu.vercel.app";
  return base.replace(/\/$/, "");
}

function SectionHead({ title, body, className = "" }: { title: string; body: string; className?: string }) {
  return (
    <div className={className}>
      <SplitText as="h2" text={title} className="display text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.04] text-ink" />
      <Reveal delay={0.15}>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-ink-dim">{body}</p>
      </Reveal>
    </div>
  );
}

export default async function Home() {
  const qrSvg = await QRCode.toString(`${siteUrl()}/download`, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#09090b", light: "#ffffff" },
  });

  return (
    <main className="relative overflow-clip">
      <Nav />
      <Hero />
      <LogoMarquee />

      <Story />

      {/* AI tailoring: a worked example */}
      <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-6 sm:pt-24">
        <SectionHead
          className="mx-auto max-w-2xl text-center [&_p]:mx-auto"
          title="AI that only uses what's true."
          body="Paste a job description. Folio scores your fit, names the gaps and rewrites your bullets from your real experience."
        />
        <Reveal className="mt-14">
          <TailorDemo />
        </Reveal>
      </section>

      {/* One source, three outputs */}
      <section className="mx-auto max-w-6xl px-5 pt-28 sm:px-6 sm:pt-40">
        <SectionHead
          className="max-w-2xl"
          title="One profile. A page and two CVs."
          body="Edit once in the app. Your public page and both résumés regenerate from the same source, instantly."
        />
        <div className="mt-16">
          <Outputs />
        </div>
      </section>

      {/* Hardening */}
      <section className="mx-auto max-w-6xl px-5 pt-28 sm:px-6 sm:pt-40">
        <SectionHead
          className="max-w-2xl"
          title="Built like production software."
          body="Because it is. The hardening that ships in real products, applied to your portfolio."
        />
        <div className="mt-14">
          <Bento />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pt-28 pb-24 sm:px-6 sm:pt-40 sm:pb-32">
        <Reveal>
          <Cta qrSvg={qrSvg} />
        </Reveal>
      </section>

      <footer className="border-t border-border px-5 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Folio home">
            <Logo size={20} />
            <span className="font-mono text-[14px] font-bold tracking-[0.22em] text-ink">FOLIO</span>
          </Link>
          <p className="text-[13px] text-muted">© {new Date().getFullYear()} Folio. Built by Basel Mahmoud.</p>
          <div className="flex gap-5 text-[13px] text-muted">
            <Link href="/privacy" className="transition-colors hover:text-ink">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-ink">Terms</Link>
            <a href="https://github.com/basel-mahmoud/folio" className="transition-colors hover:text-ink">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
