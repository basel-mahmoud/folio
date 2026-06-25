import { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Tags,
  UserRound,
  ArrowRight,
  Globe,
  Lock,
  Check,
} from "lucide-react-native";
import { Screen, Text, Row, Button, Divider } from "@/ui";
import { Avatar, initialsOf } from "@/ui/Avatar";
import { Logo } from "@/ui/Logo";
import { ProgressRing } from "@/ui/ProgressRing";
import { Appear, PressScale, AnimatedNumber, PulseDot } from "@/ui/motion";
import { useTheme } from "@/theme";
import { useToast } from "@/ui/Toast";
import { haptics } from "@/lib/haptics";
import { usePortfolio } from "@/data/portfolio-context";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function BuildScreen() {
  const t = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { data, loading, setPublished, refresh } = usePortfolio();
  const [refreshing, setRefreshing] = useState(false);

  if (loading || !data) {
    return (
      <Screen scroll={false} contentStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={t.colors.accent} />
      </Screen>
    );
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try { await refresh(); } finally { setRefreshing(false); }
  };
  const onPublish = async () => {
    haptics.tap();
    try {
      await setPublished(!data.published);
      haptics.success();
      toast.show(data.published ? "Set to private" : "Published to web");
    } catch {
      haptics.warn();
      toast.show("Couldn't update");
    }
  };

  const skillCount = data.skills.reduce((n, g) => n + g.items.length, 0);
  const sections = [
    { key: "profile", icon: UserRound, label: "Profile", meta: data.bio ? "Complete" : "Add a bio", done: !!data.bio && !!data.headline, route: "/edit/profile" },
    { key: "projects", icon: FolderGit2, label: "Projects", meta: `${data.projects.length} ${data.projects.length === 1 ? "item" : "items"}`, done: data.projects.length > 0, route: "/edit/projects" },
    { key: "experiences", icon: Briefcase, label: "Experience", meta: `${data.experiences.length} ${data.experiences.length === 1 ? "role" : "roles"}`, done: data.experiences.length > 0, route: "/edit/experiences" },
    { key: "education", icon: GraduationCap, label: "Education", meta: `${data.education.length} ${data.education.length === 1 ? "entry" : "entries"}`, done: data.education.length > 0, route: "/edit/education" },
    { key: "skills", icon: Tags, label: "Skills", meta: `${skillCount} skills`, done: data.skills.length > 0, route: "/edit/skills" },
  ] as const;

  const checks = [!!data.name, !!data.headline, !!data.bio, data.projects.length > 0, data.experiences.length > 0, data.education.length > 0, data.skills.length > 0];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const entries = data.projects.length + data.experiences.length + data.education.length;
  const doneCount = sections.filter((s) => s.done).length;

  return (
    <Screen contentStyle={{ paddingTop: t.space[4] }} refreshing={refreshing} onRefresh={onRefresh}>
      {/* Top bar */}
      <Appear index={0}>
        <Row justify="space-between">
          <Row gap={t.space[2.5]}>
            <Logo size={20} />
            <Text style={{ fontFamily: t.font.mono.bold, fontSize: 15, lineHeight: 20, includeFontPadding: false, letterSpacing: 2.5, color: t.colors.ink, marginTop: 3 }}>
              FOLIO
            </Text>
          </Row>
          <Row gap={6} style={{ borderColor: t.colors.border, borderWidth: StyleSheet.hairlineWidth, borderRadius: t.radius.full, paddingHorizontal: t.space[3], paddingVertical: 5 }}>
            <PulseDot color={data.published ? t.colors.success : t.colors.warning} size={6} />
            <Text style={{ fontFamily: t.font.mono.medium, fontSize: 11, letterSpacing: 0.8, color: t.colors.muted }}>
              {data.published ? "LIVE" : "DRAFT"}
            </Text>
          </Row>
        </Row>
      </Appear>

      {/* Greeting + identity */}
      <Appear index={1} style={{ marginTop: t.space[8] }}>
        <Text style={{ fontFamily: t.font.mono.regular, fontSize: 13, color: t.colors.muted }}>
          {greeting()},
        </Text>
        <Row gap={t.space[4]} align="center" style={{ marginTop: t.space[3] }}>
          <Avatar initials={initialsOf(data.name || "You")} size={52} />
          <View style={{ flex: 1 }}>
            <Text variant="display" style={{ fontSize: 28, lineHeight: 32 }}>{data.name || "Your name"}</Text>
            <Text variant="small" style={{ marginTop: 2 }}>{data.headline || "Add a headline"} · @{data.handle}</Text>
          </View>
        </Row>
      </Appear>

      {/* Ring hero — completeness as the focal point */}
      <Appear index={2} style={{ marginTop: t.space[10] }}>
        <Row gap={t.space[7]} align="center">
          <ProgressRing pct={completeness} size={128} stroke={11}>
            <View style={{ alignItems: "center" }}>
              <Row align="flex-start" gap={1}>
                <AnimatedNumber value={completeness} style={{ fontFamily: t.font.mono.bold, fontSize: 32, color: t.colors.ink }} />
                <Text style={{ fontFamily: t.font.mono.regular, fontSize: 15, color: t.colors.muted, marginTop: 4 }}>%</Text>
              </Row>
              <Text style={{ fontFamily: t.font.mono.medium, fontSize: 10, letterSpacing: 1.4, textTransform: "uppercase", color: t.colors.faint, marginTop: 2 }}>
                Ready
              </Text>
            </View>
          </ProgressRing>

          <View style={{ flex: 1, gap: t.space[4] }}>
            <Stat n={entries} label="entries" t={t} />
            <Stat n={`${doneCount}/5`} label="sections done" t={t} />
            <Stat n={skillCount} label="skills" t={t} />
          </View>
        </Row>
      </Appear>

      {/* Sections */}
      <Appear index={3} style={{ marginTop: t.space[12] }}>
        <Text variant="label" style={{ marginBottom: t.space[4] }}>Continue building</Text>
      </Appear>
      <View>
        {sections.map((s, i) => (
          <Appear key={s.key} index={4 + i}>
            {i > 0 && <Divider inset={56} />}
            <PressScale onPress={() => router.push(s.route)} style={{ paddingVertical: t.space[4] }}>
              <Row gap={t.space[4]}>
                <View
                  style={{
                    width: 40, height: 40, borderRadius: t.radius.md,
                    backgroundColor: s.done ? t.colors.accentSoft : t.colors.surfaceAlt,
                    borderColor: s.done ? t.colors.accentBorder : t.colors.border,
                    borderWidth: StyleSheet.hairlineWidth,
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <s.icon size={18} color={s.done ? t.colors.accent : t.colors.muted} strokeWidth={1.75} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">{s.label}</Text>
                  <Text variant="caption" style={{ marginTop: 1 }}>{s.meta}</Text>
                </View>
                {s.done ? (
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: t.colors.accentSoft, alignItems: "center", justifyContent: "center" }}>
                    <Check size={12} color={t.colors.accent} strokeWidth={3} />
                  </View>
                ) : (
                  <ChevronRight size={18} color={t.colors.faint} strokeWidth={1.75} />
                )}
              </Row>
            </PressScale>
          </Appear>
        ))}
      </View>

      {/* Actions */}
      <Appear index={10} style={{ marginTop: t.space[9] }}>
        <View style={{ gap: t.space[3] }}>
          <Button label="Preview portfolio" full size="lg" icon={<ArrowRight size={18} color={t.colors.accentInk} strokeWidth={2} />} onPress={() => router.push("/preview")} />
          <Button
            label={data.published ? "Switch to private" : "Publish to web"}
            variant="secondary" size="lg" full
            icon={data.published ? <Lock size={17} color={t.colors.ink} strokeWidth={1.75} /> : <Globe size={17} color={t.colors.ink} strokeWidth={1.75} />}
            onPress={onPublish}
          />
        </View>
      </Appear>
    </Screen>
  );
}

function Stat({ n, label, t }: { n: number | string; label: string; t: ReturnType<typeof useTheme> }) {
  return (
    <Row justify="space-between" align="flex-end">
      <Text variant="small" style={{ color: t.colors.muted }}>{label}</Text>
      <Text style={{ fontFamily: t.font.mono.semibold, fontSize: 18, color: t.colors.ink }}>{n}</Text>
    </Row>
  );
}
