import { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Pencil,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Tags,
  UserRound,
  ArrowRight,
  Globe,
  Lock,
} from "lucide-react-native";
import { Screen, Text, Surface, Row, Button, Divider } from "@/ui";
import { Avatar, initialsOf } from "@/ui/Avatar";
import { Logo } from "@/ui/Logo";
import { Appear, PressScale, AnimatedProgress } from "@/ui/motion";
import { useTheme } from "@/theme";
import { useToast } from "@/ui/Toast";
import { haptics } from "@/lib/haptics";
import { usePortfolio } from "@/data/portfolio-context";

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
    { key: "profile", icon: UserRound, label: "Profile", meta: "Name, headline, bio", route: "/edit/profile" },
    { key: "projects", icon: FolderGit2, label: "Projects", meta: `${data.projects.length} items`, route: "/edit/projects" },
    { key: "experiences", icon: Briefcase, label: "Experience", meta: `${data.experiences.length} roles`, route: "/edit/experiences" },
    { key: "education", icon: GraduationCap, label: "Education", meta: `${data.education.length} entries`, route: "/edit/education" },
    { key: "skills", icon: Tags, label: "Skills", meta: `${skillCount} skills`, route: "/edit/skills" },
  ] as const;

  const checks = [
    !!data.name,
    !!data.headline,
    !!data.bio,
    data.projects.length > 0,
    data.experiences.length > 0,
    data.education.length > 0,
    data.skills.length > 0,
  ];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const entries = data.projects.length + data.experiences.length + data.education.length;

  return (
    <Screen contentStyle={{ paddingTop: t.space[4] }} refreshing={refreshing} onRefresh={onRefresh}>
      {/* Header */}
      <Appear index={0}>
        <Row justify="space-between">
          <Row gap={t.space[2.5]}>
            <Logo size={20} />
            <Text style={{ fontFamily: t.font.mono.bold, fontSize: 15, letterSpacing: 2.5, color: t.colors.ink }}>
              FOLIO
            </Text>
          </Row>
          <Row
            gap={6}
            style={{
              borderColor: t.colors.border,
              borderWidth: StyleSheet.hairlineWidth,
              borderRadius: t.radius.full,
              paddingHorizontal: t.space[3],
              paddingVertical: 5,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: data.published ? t.colors.success : t.colors.warning }} />
            <Text style={{ fontFamily: t.font.mono.medium, fontSize: 11, letterSpacing: 0.8, color: t.colors.muted }}>
              {data.published ? "LIVE" : "DRAFT"}
            </Text>
          </Row>
        </Row>
      </Appear>

      {/* Hero */}
      <Appear index={1} style={{ marginTop: t.space[9] }}>
        <Text variant="label" color="accent">Portfolio</Text>
        <Text variant="display" style={{ fontSize: 38, lineHeight: 44, marginTop: t.space[2] }}>
          Your portfolio
        </Text>
        <Text variant="body" style={{ marginTop: t.space[3], maxWidth: 320 }}>
          Build it once. Share it everywhere. Tailor it to any role.
        </Text>
      </Appear>

      {/* Completeness */}
      <Appear index={2} style={{ marginTop: t.space[8] }}>
        <Surface raised padded>
          <Row justify="space-between" align="flex-end">
            <View>
              <Text variant="label">Completeness</Text>
              <Row align="flex-end" gap={4} style={{ marginTop: t.space[2] }}>
                <Text style={{ fontFamily: t.font.mono.bold, fontSize: 34, color: t.colors.ink }}>{completeness}</Text>
                <Text style={{ fontFamily: t.font.mono.regular, fontSize: 18, color: t.colors.muted, marginBottom: 5 }}>%</Text>
              </Row>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontFamily: t.font.mono.medium, fontSize: 13, color: t.colors.ink }}>{entries} entries</Text>
              <Text variant="caption" style={{ marginTop: 2 }}>across 5 sections</Text>
            </View>
          </Row>
          <View style={{ marginTop: t.space[4] }}>
            <AnimatedProgress pct={completeness} />
          </View>
        </Surface>
      </Appear>

      {/* Profile card */}
      <Appear index={3} style={{ marginTop: t.space[5] }}>
        <Surface raised padded>
          <Row gap={t.space[4]} align="center">
            <Avatar initials={initialsOf(data.name || "You")} size={60} />
            <View style={{ flex: 1 }}>
              <Text variant="title">{data.name || "Add your name"}</Text>
              <Text variant="small" style={{ marginTop: 2 }}>{data.headline || "Add a headline"}</Text>
              <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.faint, marginTop: 5 }}>
                @{data.handle}
              </Text>
            </View>
            <PressScale
              onPress={() => router.push("/edit/profile")}
              style={{ borderColor: t.colors.borderStrong, borderWidth: StyleSheet.hairlineWidth, borderRadius: t.radius.sm, padding: t.space[2.5] }}
            >
              <Pencil size={16} color={t.colors.inkDim} strokeWidth={1.75} />
            </PressScale>
          </Row>
        </Surface>
      </Appear>

      {/* Sections */}
      <View style={{ marginTop: t.space[10] }}>
        <Appear index={4}>
          <Row justify="space-between" style={{ marginBottom: t.space[4] }}>
            <Text variant="label">Sections</Text>
            <Text style={{ fontFamily: t.font.mono.regular, fontSize: 11, color: t.colors.faint }}>5 total</Text>
          </Row>
        </Appear>
        <Appear index={5}>
          <Surface raised>
            {sections.map((s, i) => (
              <View key={s.key}>
                {i > 0 && <Divider inset={t.space[5] + 38} />}
                <PressScale
                  onPress={() => router.push(s.route)}
                  style={{ paddingVertical: t.space[4], paddingHorizontal: t.space[5] }}
                >
                  <Row justify="space-between">
                    <Row gap={t.space[3]} style={{ flex: 1 }}>
                      <View style={{ width: 38, height: 38, borderRadius: t.radius.sm, backgroundColor: t.colors.surfaceHi, borderColor: t.colors.border, borderWidth: StyleSheet.hairlineWidth, alignItems: "center", justifyContent: "center" }}>
                        <s.icon size={17} color={t.colors.inkDim} strokeWidth={1.75} />
                      </View>
                      <View>
                        <Text variant="bodyStrong">{s.label}</Text>
                        <Text variant="caption" style={{ marginTop: 2 }}>{s.meta}</Text>
                      </View>
                    </Row>
                    <ChevronRight size={18} color={t.colors.faint} strokeWidth={1.75} />
                  </Row>
                </PressScale>
              </View>
            ))}
          </Surface>
        </Appear>
      </View>

      {/* Actions */}
      <Appear index={6} style={{ marginTop: t.space[8] }}>
        <View style={{ gap: t.space[3] }}>
          <Button label="Preview portfolio" full size="lg" icon={<ArrowRight size={18} color={t.colors.accentInk} strokeWidth={2} />} onPress={() => router.push("/preview")} />
          <Button
            label={data.published ? "Switch to private" : "Publish to web"}
            variant="secondary"
            size="lg"
            full
            icon={data.published ? <Lock size={17} color={t.colors.ink} strokeWidth={1.75} /> : <Globe size={17} color={t.colors.ink} strokeWidth={1.75} />}
            onPress={onPublish}
          />
        </View>
      </Appear>
    </Screen>
  );
}
