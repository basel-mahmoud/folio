import Image from "next/image";
import { Logo } from "@/components/logo";
import { hashEntry } from "@/lib/services/audit";
import { CodeReveal, type Token } from "@/components/code-reveal";
import { AuditChain, type ChainEntry } from "@/components/audit-chain";
import { Spotlight } from "@/components/motion/spotlight";
import { Tilt } from "@/components/motion/tilt";

/* The policy shape from scripts/apply-rls.ts (the system-bypass clause trimmed for reading). */
const SQL: Token[][] = [
  [{ t: "-- every owned table, enforced by Postgres", c: "cm" }],
  [{ t: "alter table ", c: "kw" }, { t: "portfolios", c: "id" }, { t: " force row level security", c: "kw" }, { t: ";", c: "op" }],
  [],
  [{ t: "create policy ", c: "kw" }, { t: "portfolios_rls", c: "id" }, { t: " on ", c: "kw" }, { t: "portfolios", c: "id" }],
  [{ t: "  using ", c: "kw" }, { t: "(user_id = ", c: "op" }, { t: "current_setting", c: "fn" }, { t: "(", c: "op" }, { t: "'app.user_id'", c: "str" }, { t: ", true))", c: "op" }],
  [{ t: "  with check ", c: "kw" }, { t: "(user_id = ", c: "op" }, { t: "current_setting", c: "fn" }, { t: "(", c: "op" }, { t: "'app.user_id'", c: "str" }, { t: ", true));", c: "op" }],
];

/** Real hashes: the app's own hashEntry over a plausible first session. */
function chain(): ChainEntry[] {
  const steps = [
    { action: "portfolio.create", targetType: "portfolio", targetId: "pf_demo" },
    { action: "project.create", targetType: "project", targetId: "prj_deskhive" },
    { action: "ai.generate", targetType: "ai" },
    { action: "portfolio.publish", targetType: "portfolio", targetId: "pf_demo" },
  ];
  let prev: string | null = null;
  return steps.map((s) => {
    const hash: string = hashEntry({ userId: "user_demo", actorId: "user_demo", ...s }, prev);
    prev = hash;
    return { action: s.action, hash };
  });
}

function Cell({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <Spotlight className={`overflow-hidden rounded-[20px] border border-border bg-surface/50 ${className}`}>
      <div className="relative z-[1] h-full">{children}</div>
    </Spotlight>
  );
}

function CellText({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="display text-xl leading-tight text-ink sm:text-[1.4rem]">{title}</h3>
      <p className="mt-2 max-w-sm text-pretty text-[15px] leading-relaxed text-ink-dim">{body}</p>
    </div>
  );
}

export function Bento() {
  const entries = chain();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* RLS — wide */}
      <Cell className="lg:col-span-2">
        <div className="flex h-full min-w-0 flex-col justify-between gap-8 p-6 sm:p-8">
          <CellText title="Row-level security, forced." body="Every table is locked to its owner inside Postgres itself, not just in app code." />
          <div className="min-w-0 border-t border-border pt-5">
            <CodeReveal lines={SQL} label="SQL: force row level security on portfolios and create a policy that only matches the current user's id" />
          </div>
        </div>
      </Cell>

      {/* Native app — tall-ish */}
      <Cell>
        <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
          <CellText title="A real Android app." body="A native Expo build you install as an APK. Not a web page in a wrapper." />
          <Tilt className="mx-auto w-[148px]" max={16}>
            <div className="rounded-[30px] drop-shadow-[0_22px_22px_rgb(0_0_0/0.75)]" role="img" aria-label="The Folio app icon: a folded-page F on cobalt">
              <Logo size={148} className="block" />
            </div>
          </Tilt>
        </div>
      </Cell>

      {/* Audit chain */}
      <Cell>
        <div className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
          <CellText title="Tamper-evident history." body="Each change is hash-chained to the one before it, so the record can't be quietly rewritten." />
          <AuditChain entries={entries} />
        </div>
      </Cell>

      {/* Data ownership — wide, real screenshot */}
      <Cell className="lg:col-span-2">
        <div className="grid h-full gap-6 p-6 sm:p-8 md:grid-cols-[1fr_minmax(0,300px)] md:items-center md:gap-10">
          <div className="min-w-0">
            <CellText title="Your data leaves when you do." body="Export everything as JSON, or delete your account and every row with it. Both live one tap from the profile screen." />
            <p className="font-mono mt-6 text-[12px] text-muted">
              GET <span className="text-ink-dim">/api/me/export</span>
              <span className="mx-2 text-faint">/</span>
              DELETE <span className="text-ink-dim">/api/me</span>
            </p>
          </div>
          <div className="relative mx-auto aspect-[804/770] w-full max-w-[300px] overflow-hidden rounded-[16px] border border-border-strong bg-black [mask-image:linear-gradient(180deg,transparent,#000_14%,#000_86%,transparent)]">
            <Image
              src="/app/profile.png"
              alt="Folio's profile screen: public URL, appearance, export my data, privacy and data, delete account"
              width={804}
              height={1748}
              sizes="300px"
              className="absolute left-0 w-full max-w-none"
              style={{ top: "-49.35%", height: "auto" }}
            />
          </div>
        </div>
      </Cell>
    </div>
  );
}
