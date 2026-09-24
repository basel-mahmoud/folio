import {
  siClerk,
  siDrizzle,
  siExpo,
  siGooglegemini,
  siNeon,
  siNextdotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { MarqueeShell } from "@/components/marquee-shell";

const STACK: { icon: SimpleIcon; label: string }[] = [
  { icon: siNextdotjs, label: "Next.js 16" },
  { icon: siReact, label: "React Native" },
  { icon: siExpo, label: "Expo" },
  { icon: siNeon, label: "Neon Postgres" },
  { icon: siDrizzle, label: "Drizzle ORM" },
  { icon: siClerk, label: "Clerk" },
  { icon: siGooglegemini, label: "Gemini" },
  { icon: siTypescript, label: "TypeScript" },
  { icon: siTailwindcss, label: "Tailwind CSS" },
  { icon: siVercel, label: "Vercel" },
];

/** The real stack, as real marks (Simple Icons). One marquee on the page; pauses on hover or via its toggle. */
export function LogoMarquee() {
  return (
    <MarqueeShell>
      <p className="sr-only">Built with {STACK.map((s) => s.label).join(", ")}.</p>
      <div className="marquee-track" aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center gap-12 pr-12">
            {STACK.map(({ icon, label }) => (
              <span key={label} className="flex items-center gap-2.5 text-muted transition-colors duration-200 hover:text-ink">
                <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor" aria-hidden>
                  <path d={icon.path} />
                </svg>
                <span className="font-mono text-[13px] whitespace-nowrap">{label}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </MarqueeShell>
  );
}
