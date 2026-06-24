import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Sparkles, ArrowRight, Check } from "lucide-react-native";
import { Screen, Text, Surface, Row, Button, Field, Tag, SectionHeader } from "@/ui";
import { useTheme } from "@/theme";

export default function TailorScreen() {
  const t = useTheme();
  const [jd, setJd] = useState("");

  return (
    <Screen>
      <Row gap={t.space[2]} style={{ marginBottom: t.space[2] }}>
        <Sparkles size={16} color={t.colors.accent} strokeWidth={1.75} />
        <Text variant="label" color="accent">
          AI · powered by Gemini
        </Text>
      </Row>
      <Text variant="display">Tailor to a role</Text>
      <Text variant="body" style={{ marginTop: t.space[2] }}>
        Paste a job description. Folio rewrites your bullets to match it, scores
        the fit, and flags the gaps — it never invents experience you don&apos;t
        have.
      </Text>

      <View style={{ marginTop: t.space[6], gap: t.space[4] }}>
        <Field
          label="Job description"
          placeholder="Paste the role's responsibilities and requirements…"
          multiline
          value={jd}
          onChangeText={setJd}
          style={{ minHeight: 140 }}
        />
        <Button
          label="Tailor my CV"
          full
          icon={<ArrowRight size={17} color={t.colors.accentInk} strokeWidth={2} />}
          disabled={jd.trim().length < 20}
        />
      </View>

      {/* Example output */}
      <View style={{ marginTop: t.space[10] }}>
        <SectionHeader label="Example output" />

        <Surface padded>
          <Row justify="space-between" align="center">
            <View>
              <Text variant="label">Match score</Text>
              <Text
                style={{
                  fontFamily: t.font.mono.bold,
                  fontSize: 40,
                  color: t.colors.ink,
                  marginTop: 2,
                }}
              >
                92<Text style={{ fontFamily: t.font.mono.regular, fontSize: 20, color: t.colors.muted }}>%</Text>
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 6 }}>
              <Tag label="Strong fit" tone="success" />
              <Text variant="caption">3 gaps to close</Text>
            </View>
          </Row>
          <View
            style={{
              height: 4,
              borderRadius: 999,
              backgroundColor: t.colors.surfaceAlt,
              overflow: "hidden",
              marginTop: t.space[3],
            }}
          >
            <View style={{ width: "92%", height: "100%", backgroundColor: t.colors.success }} />
          </View>
        </Surface>

        <View style={{ height: t.space[4] }} />

        <Text variant="label" style={{ marginBottom: t.space[2] }}>
          Rewritten bullet
        </Text>
        <Surface padded style={{ gap: t.space[3] }}>
          <View style={{ gap: 4 }}>
            <Text variant="caption">Before</Text>
            <Text
              variant="body"
              style={{ textDecorationLine: "line-through", color: t.colors.faint }}
            >
              Worked on the frontend and helped with the backend.
            </Text>
          </View>
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: t.colors.border,
            }}
          />
          <View style={{ gap: 4 }}>
            <Row gap={6}>
              <Check size={13} color={t.colors.accent} strokeWidth={2.5} />
              <Text variant="caption" color="accent">
                After · tailored
              </Text>
            </Row>
            <Text variant="bodyStrong">
              Built and shipped a React + Next.js dashboard and the Node APIs
              behind it, cutting page loads 40%.
            </Text>
          </View>
        </Surface>
      </View>
    </Screen>
  );
}
