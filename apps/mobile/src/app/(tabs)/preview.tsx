import { View, StyleSheet, Linking, ActivityIndicator } from "react-native";
import { Share2, ArrowUpRight, FileDown, FileText } from "lucide-react-native";
import { Screen, Text, Row, Tag, Divider, Button } from "@/ui";
import { Appear, PressScale } from "@/ui/motion";
import { useTheme } from "@/theme";
import { usePortfolio } from "@/data/portfolio-context";
import { config } from "@/lib/config";
import type { Project, Experience } from "@/data/demo";

function monthYear(v: string | null): string {
  if (!v) return "Present";
  const [y, m] = v.split("-");
  if (!m) return y;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[Number(m) - 1]} ${y}`;
}

function Marker({ index, label }: { index: string; label: string }) {
  const t = useTheme();
  return (
    <Row gap={t.space[2]} style={{ marginBottom: t.space[5] }}>
      <Text style={{ fontFamily: t.font.mono.medium, fontSize: 11, color: t.colors.accent, letterSpacing: 0.5 }}>{index}</Text>
      <Text variant="label">{label}</Text>
      <View style={{ flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: t.colors.border, marginLeft: t.space[1] }} />
    </Row>
  );
}

export default function PreviewScreen() {
  const t = useTheme();
  const { data, loading } = usePortfolio();

  if (loading || !data) {
    return (
      <Screen scroll={false} contentStyle={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={t.colors.accent} />
      </Screen>
    );
  }

  let idx = 1;
  const next = () => String(++idx).padStart(2, "0");
  const openCv = (q = "") =>
    Linking.openURL(`${config.apiUrl}/u/${data.handle}/cv${q}`);

  return (
    <Screen contentStyle={{ paddingTop: t.space[4] }}>
      <Appear index={0}>
        <Row
          justify="space-between"
          style={{ borderColor: t.colors.border, borderWidth: StyleSheet.hairlineWidth, borderRadius: t.radius.full, paddingHorizontal: t.space[4], paddingVertical: t.space[2.5] }}
        >
          <Row gap={t.space[2]}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: data.published ? t.colors.success : t.colors.warning }} />
            <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted }}>folio.app/u/{data.handle}</Text>
          </Row>
          <PressScale hitSlop={8}>
            <Share2 size={16} color={t.colors.inkDim} strokeWidth={1.75} />
          </PressScale>
        </Row>
      </Appear>

      {/* Identity */}
      <Appear index={1} style={{ marginTop: t.space[9] }}>
        {!!data.headline && <Text variant="label" color="accent">{data.headline}</Text>}
        <Text variant="display" style={{ marginTop: t.space[3], fontSize: 40, lineHeight: 46 }}>
          {data.name || "Your name"}
        </Text>
        <Row gap={t.space[4]} wrap style={{ marginTop: t.space[4] }}>
          {!!data.location && (
            <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted }}>{data.location}</Text>
          )}
          {data.links.map((l) => (
            <PressScale key={l.label} onPress={() => Linking.openURL(l.url.startsWith("http") ? l.url : `https://${l.url}`)}>
              <Row gap={4}>
                <Text style={{ fontFamily: t.font.mono.medium, fontSize: 12, color: t.colors.ink }}>{l.label}</Text>
                <ArrowUpRight size={12} color={t.colors.faint} strokeWidth={2} />
              </Row>
            </PressScale>
          ))}
        </Row>
        {!!data.bio && (
          <Text variant="body" style={{ marginTop: t.space[6], fontSize: 16, lineHeight: 25 }}>{data.bio}</Text>
        )}
      </Appear>

      {data.projects.length > 0 && (
        <View style={{ marginTop: t.space[14] }}>
          <Appear index={2}><Marker index="02" label="Selected work" /></Appear>
          <View style={{ gap: t.space[7] }}>
            {data.projects.map((proj, i) => (
              <Appear key={proj.id} index={3 + i}><ProjectBlock proj={proj} /></Appear>
            ))}
          </View>
        </View>
      )}

      {data.experiences.length > 0 && (
        <View style={{ marginTop: t.space[14] }}>
          <Appear index={0}><Marker index={next()} label="Experience" /></Appear>
          {data.experiences.map((e, i) => (
            <Appear key={e.id} index={i}>
              {i > 0 && <Divider />}
              <ExperienceBlock e={e} fmt={monthYear} />
            </Appear>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View style={{ marginTop: t.space[14] }}>
          <Appear index={0}><Marker index={next()} label="Skills" /></Appear>
          <View style={{ gap: t.space[5] }}>
            {data.skills.map((g, i) => (
              <Appear key={g.id} index={i}>
                <View style={{ gap: t.space[2.5] }}>
                  <Text variant="caption">{g.label}</Text>
                  <Row gap={t.space[2]} wrap>{g.items.map((s) => <Tag key={s} label={s} />)}</Row>
                </View>
              </Appear>
            ))}
          </View>
        </View>
      )}

      {data.education.length > 0 && (
        <View style={{ marginTop: t.space[14] }}>
          <Appear index={0}><Marker index={next()} label="Education" /></Appear>
          <View style={{ gap: t.space[4] }}>
            {data.education.map((ed) => (
              <Row key={ed.id} justify="space-between" align="flex-start">
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">{ed.school}</Text>
                  <Text variant="small" style={{ marginTop: 1 }}>{ed.degree}</Text>
                </View>
                <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted }}>{ed.start}—{ed.end}</Text>
              </Row>
            ))}
          </View>
        </View>
      )}

      <View style={{ marginTop: t.space[14] }}>
        <Appear index={0}>
          <Marker index={next()} label="Résumé" />
        </Appear>
        <View style={{ gap: t.space[3] }}>
          <Button
            label="Modern CV (PDF)"
            variant="secondary"
            full
            icon={<FileDown size={17} color={t.colors.ink} strokeWidth={1.75} />}
            onPress={() => openCv("")}
          />
          <Button
            label="Harvard CV (PDF)"
            variant="secondary"
            full
            icon={<FileText size={17} color={t.colors.ink} strokeWidth={1.75} />}
            onPress={() => openCv("?template=harvard")}
          />
        </View>
      </View>
    </Screen>
  );
}

function ProjectBlock({ proj }: { proj: Project }) {
  const t = useTheme();
  return (
    <View>
      <Row justify="space-between" align="flex-start">
        <View style={{ flex: 1, paddingRight: t.space[3] }}>
          <Text variant="subtitle">{proj.title}</Text>
          {!!proj.role && <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted, marginTop: 3 }}>{proj.role}</Text>}
        </View>
        {!!proj.year && <Text style={{ fontFamily: t.font.mono.medium, fontSize: 12, color: t.colors.faint }}>{proj.year}</Text>}
      </Row>
      {!!proj.summary && <Text variant="body" style={{ marginTop: t.space[3] }}>{proj.summary}</Text>}
      {proj.tags.length > 0 && (
        <Row gap={t.space[2]} wrap style={{ marginTop: t.space[4] }}>{proj.tags.map((tag) => <Tag key={tag} label={tag} />)}</Row>
      )}
    </View>
  );
}

function ExperienceBlock({ e, fmt }: { e: Experience; fmt: (v: string | null) => string }) {
  const t = useTheme();
  return (
    <View style={{ paddingVertical: t.space[5] }}>
      <Row justify="space-between" align="flex-start">
        <View style={{ flex: 1, paddingRight: t.space[3] }}>
          <Text variant="bodyStrong">{e.role}</Text>
          <Text variant="small" style={{ marginTop: 1 }}>{e.company}</Text>
        </View>
        <Text style={{ fontFamily: t.font.mono.regular, fontSize: 11, color: t.colors.muted }}>{fmt(e.start)} — {fmt(e.end)}</Text>
      </Row>
      {!!e.summary && <Text variant="body" style={{ marginTop: t.space[3] }}>{e.summary}</Text>}
    </View>
  );
}
