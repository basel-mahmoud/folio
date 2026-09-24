import Link from "next/link";
import { Download } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { WordRotate } from "@/components/motion/word-rotate";
import { SplitText } from "@/components/motion/split-text";

/**
 * The close. One border beam travels the panel's hairline (on the card, never on
 * the button). Desktop visitors get a QR code: the install happens on a phone.
 */
export function Cta({ qrSvg }: { qrSvg: string }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-border-strong bg-surface/70 [--beam-radius:26px]">
      <span className="border-beam" aria-hidden />
      <div className="dot-field pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_80%_at_50%_0%,#000,transparent)]" aria-hidden />
      <div className="relative grid items-center gap-10 p-8 sm:p-14 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <SplitText as="h2" text="Make the page that gets you hired." className="display max-w-xl text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.04] text-ink" />
          <p className="mt-5 text-lg text-ink-dim">
            Made for <WordRotate className="text-ink" words={["software engineers", "designers", "new grads", "career switchers", "product managers", "you"]} />
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic className="w-full sm:w-auto">
              <a href="/download" className="btn-grad inline-flex w-full items-center justify-center gap-2 rounded-[12px] px-6 py-3.5 text-[15px] font-medium sm:w-auto">
                <Download size={17} /> Download for Android
              </a>
            </Magnetic>
            <Link href="/u/basel" className="font-mono text-center text-sm text-ink-dim transition-colors hover:text-ink">
              or see a live example
            </Link>
          </div>
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          <div
            className="h-[118px] w-[118px] rounded-[16px] bg-white p-2.5 shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)] [&_svg]:h-full [&_svg]:w-full"
            role="img"
            aria-label="QR code linking to the Folio APK download"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <p className="max-w-[9rem] text-sm leading-relaxed text-muted">Scan with your Android phone to install.</p>
        </div>
      </div>
    </div>
  );
}
