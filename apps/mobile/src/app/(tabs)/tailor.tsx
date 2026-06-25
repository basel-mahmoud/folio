import { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Sparkles,
  ArrowRight,
  Check,
  Target,
  AlertTriangle,
  ClipboardList,
  Gauge,
  PenLine,
} from "lucide-react-native";
import { Screen, Text, Surface, Row, Button, Field, Tag, Divider } from "@/ui";
import { Appear, PressScale } from "@/ui/motion";
import { haptics } from "@/lib/haptics";
import { useTheme } from "@/theme";
import { usePortfolio, type TailorResult } from "@/data/portfolio-context";

const SAMPLES: { label: string; jd: string }[] = [
  {
    label: "Senior Frontend Engineer",
    jd: "We're hiring a Senior Frontend Engineer to own our React + TypeScript web app. You'll ship accessible, performant UI, lead design-system work, mentor engineers, and partner closely with design. Requirements: 5+ years React, deep TypeScript, testing, Core Web Vitals, and a strong eye for craft.",
  },
  {
    label: "Product Designer",
    jd: "Product Designer to drive end-to-end design for a B2B SaaS platform. Own discovery, prototyping, and high-fidelity UI in Figma. Run usability tests, build and maintain a design system, and collaborate daily with PM and engineering. Requirements: strong portfolio, systems thinking, interaction and visual design.",
  },
  {
    label: "ML Engineer",
    jd: "ML Engineer to build and ship production machine-learning systems. Train, evaluate, and serve models; own data pipelines and MLOps; optimize latency and cost. Requirements: Python, PyTorch or TensorFlow, cloud (AWS/GCP), strong software engineering, and experience deploying models to production.",
  },
];

const STEPS = [
  { icon: ClipboardList, title: "Paste a job description", body: "Drop in the role's responsibilities and requirements." },
  { icon: Gauge, title: "Folio scores your fit", body: "Gemini weighs the role against your real experience — never invented claims." },
  { icon: PenLine, title: "Get tailored bullets", body: "Rewritten résumé bullets, plus the keywords you're missing." },
];

export default function TailorScreen() {
  const t = useTheme();
  const { tailor } = usePortfolio();
  const [jd, setJd] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResult | null>(null);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      setResult(await tailor(jd));
    } catch (e) {
      setError(
        e instanceof Error && "status" in e && (e as { status?: number }).status === 503
          ? "AI is busy right now — try again in a moment."
          : "Couldn't tailor your CV. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const tone = (s: number) => (s >= 80 ? t.colors.success : s >= 55 ? t.colors.warning : t.colors.danger);

  return (
    <Screen contentStyle={{ paddingTop: t.space[4] }}>
      <Appear index={0}>
        <Row gap={t.space[2]} style={{ marginBottom: t.space[2] }}>
          <Sparkles size={16} color={t.colors.accent} strokeWidth={1.75} />
          <Text variant="label" color="accent">AI · powered by Gemini</Text>
        </Row>
        <Text variant="display">Tailor to a role</Text>
        <Text variant="body" style={{ marginTop: t.space[3] }}>
          Paste a job description. Folio scores your fit and rewrites your bullets
          to match — using only your real experience.
        </Text>
      </Appear>

      <Appear index={1} style={{ marginTop: t.space[6] }}>
        <View style={{ gap: t.space[4] }}>
          <Field
            label="Job description"
            placeholder="Paste the role's responsibilities and requirements…"
            multiline
            value={jd}
            onChangeText={setJd}
            style={{ minHeight: 150 }}
          />
          <Button
            label="Tailor my CV"
            full
            size="lg"
            loading={busy}
            disabled={jd.trim().length < 40}
            icon={<ArrowRight size={18} color={t.colors.accentInk} strokeWidth={2} />}
            onPress={run}
          />
          {error ? (
            <Row gap={t.space[2]}>
              <AlertTriangle size={15} color={t.colors.danger} strokeWidth={2} />
              <Text variant="small" style={{ color: t.colors.danger }}>{error}</Text>
            </Row>
          ) : null}
        </View>
      </Appear>

      {!result && !busy && (
        <>
          <Appear index={2} style={{ marginTop: t.space[8] }}>
            <Text variant="label" style={{ marginBottom: t.space[3] }}>Or start from a sample</Text>
            <Row gap={t.space[2]} wrap>
              {SAMPLES.map((s) => (
                <PressScale
                  key={s.label}
                  onPress={() => {
                    haptics.tap();
                    setError(null);
                    setJd(s.jd);
                  }}
                >
                  <Row
                    gap={6}
                    style={{
                      borderColor: t.colors.border,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderRadius: t.radius.full,
                      paddingHorizontal: t.space[3],
                      paddingVertical: 8,
                      backgroundColor: t.colors.surfaceAlt,
                    }}
                  >
                    <Sparkles size={13} color={t.colors.accent} strokeWidth={2} />
                    <Text variant="small" style={{ color: t.colors.ink }}>{s.label}</Text>
                  </Row>
                </PressScale>
              ))}
            </Row>
          </Appear>

          <Appear index={3} style={{ marginTop: t.space[10] }}>
            <Text variant="label" style={{ marginBottom: t.space[4] }}>How it works</Text>
            <View>
              {STEPS.map((step, i) => (
                <View key={step.title}>
                  {i > 0 && <Divider inset={52} />}
                  <Row gap={t.space[4]} align="flex-start" style={{ paddingVertical: t.space[3] }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: t.radius.md,
                        backgroundColor: t.colors.accentSoft,
                        borderColor: t.colors.accentBorder,
                        borderWidth: StyleSheet.hairlineWidth,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <step.icon size={16} color={t.colors.accent} strokeWidth={1.75} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="bodyStrong">{step.title}</Text>
                      <Text variant="caption" style={{ marginTop: 2 }}>{step.body}</Text>
                    </View>
                  </Row>
                </View>
              ))}
            </View>
          </Appear>
        </>
      )}

      {result && (
        <View style={{ marginTop: t.space[10], gap: t.space[5] }}>
          <Appear index={0}>
            <Surface raised padded>
              <Row justify="space-between" align="center">
                <View>
                  <Text variant="label">Match score</Text>
                  <Row align="flex-end" gap={2} style={{ marginTop: t.space[2] }}>
                    <Text style={{ fontFamily: t.font.mono.bold, fontSize: 40, color: tone(result.matchScore) }}>
                      {result.matchScore}
                    </Text>
                    <Text style={{ fontFamily: t.font.mono.regular, fontSize: 20, color: t.colors.muted, marginBottom: 5 }}>%</Text>
                  </Row>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6, flex: 1, paddingLeft: t.space[4] }}>
                  <Text variant="small" style={{ textAlign: "right" }}>{result.summary}</Text>
                </View>
              </Row>
              <View style={{ height: 5, borderRadius: 999, backgroundColor: t.colors.surfaceHi, overflow: "hidden", marginTop: t.space[4] }}>
                <View style={{ width: `${result.matchScore}%`, height: "100%", backgroundColor: tone(result.matchScore) }} />
              </View>
            </Surface>
          </Appear>

          {result.strengths.length > 0 && (
            <Appear index={1}>
              <Text variant="label" style={{ marginBottom: t.space[3] }}>Strengths</Text>
              <View style={{ gap: t.space[2] }}>
                {result.strengths.map((s, i) => (
                  <Row key={i} gap={t.space[2]} align="flex-start">
                    <Check size={15} color={t.colors.success} strokeWidth={2.5} style={{ marginTop: 3 }} />
                    <Text variant="body" style={{ flex: 1 }}>{s}</Text>
                  </Row>
                ))}
              </View>
            </Appear>
          )}

          {result.gaps.length > 0 && (
            <Appear index={2}>
              <Text variant="label" style={{ marginBottom: t.space[3] }}>Gaps to close</Text>
              <View style={{ gap: t.space[2] }}>
                {result.gaps.map((g, i) => (
                  <Row key={i} gap={t.space[2]} align="flex-start">
                    <Target size={15} color={t.colors.warning} strokeWidth={2} style={{ marginTop: 3 }} />
                    <Text variant="body" style={{ flex: 1 }}>{g}</Text>
                  </Row>
                ))}
              </View>
            </Appear>
          )}

          {result.rewrittenBullets.length > 0 && (
            <Appear index={3}>
              <Text variant="label" style={{ marginBottom: t.space[3] }}>Rewritten bullets</Text>
              <View style={{ gap: t.space[3] }}>
                {result.rewrittenBullets.map((b, i) => (
                  <Surface key={i} padded style={{ gap: t.space[3] }}>
                    <View style={{ gap: 4 }}>
                      <Text variant="caption">Before</Text>
                      <Text variant="body" style={{ color: t.colors.faint, textDecorationLine: "line-through" }}>{b.before}</Text>
                    </View>
                    <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border }} />
                    <View style={{ gap: 4 }}>
                      <Row gap={6}><Check size={13} color={t.colors.accent} strokeWidth={2.5} /><Text variant="caption" color="accent">After · tailored</Text></Row>
                      <Text variant="bodyStrong">{b.after}</Text>
                    </View>
                  </Surface>
                ))}
              </View>
            </Appear>
          )}

          {result.missingKeywords.length > 0 && (
            <Appear index={4}>
              <Text variant="label" style={{ marginBottom: t.space[3] }}>Missing keywords</Text>
              <Row gap={t.space[2]} wrap>
                {result.missingKeywords.map((k) => <Tag key={k} label={k} tone="danger" />)}
              </Row>
            </Appear>
          )}
        </View>
      )}
    </Screen>
  );
}
