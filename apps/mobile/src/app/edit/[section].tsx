import { useState } from "react";
import { View, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { X, Plus, Trash2 } from "lucide-react-native";
import { Screen, Text, Field, Button, Row, Surface, Divider } from "@/ui";
import { useTheme } from "@/theme";
import { usePortfolio, type Section } from "@/data/portfolio-context";

type FieldDef = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
};

export default function SectionEditor() {
  const t = useTheme();
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section: string }>();
  const pf = usePortfolio();
  const [form, setForm] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spec = getSpec(section ?? "projects");
  const items = (pf.data?.[spec.sectionKey] ?? []) as { id: string }[];

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function add() {
    const missing = spec.fields.find((f) => f.required && !form[f.key]?.trim());
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await spec.add(pf, form);
      setForm({});
    } catch {
      setError("Couldn't add that. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll={false} contentStyle={{ flex: 1, paddingTop: t.space[3] }}>
      <Row justify="space-between" style={{ marginBottom: t.space[6] }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <X size={22} color={t.colors.inkDim} strokeWidth={1.75} />
        </Pressable>
        <Text variant="label">{spec.title}</Text>
        <View style={{ width: 22 }} />
      </Row>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: t.space[16] }}>
        {/* Existing items */}
        {items.length > 0 && (
          <Surface raised style={{ marginBottom: t.space[6] }}>
            {items.map((it, i) => (
              <View key={it.id}>
                {i > 0 && <Divider inset={t.space[5]} />}
                <Row justify="space-between" style={{ paddingVertical: t.space[4], paddingHorizontal: t.space[5] }}>
                  <View style={{ flex: 1, paddingRight: t.space[3] }}>
                    <Text variant="bodyStrong" numberOfLines={1}>{spec.primary(it)}</Text>
                    {!!spec.secondary(it) && <Text variant="caption" numberOfLines={1} style={{ marginTop: 1 }}>{spec.secondary(it)}</Text>}
                  </View>
                  <Pressable onPress={() => pf.remove(spec.sectionKey, it.id)} hitSlop={8}>
                    <Trash2 size={16} color={t.colors.danger} strokeWidth={1.75} />
                  </Pressable>
                </Row>
              </View>
            ))}
          </Surface>
        )}

        {/* Add form */}
        <Text variant="label" style={{ marginBottom: t.space[3] }}>Add {spec.singular}</Text>
        <View style={{ gap: t.space[4] }}>
          {spec.fields.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              placeholder={f.placeholder}
              multiline={f.multiline}
              value={form[f.key] ?? ""}
              onChangeText={(v) => set(f.key, v)}
              autoCapitalize={f.key === "link" ? "none" : "sentences"}
            />
          ))}
          <Button label={`Add ${spec.singular}`} size="lg" full loading={busy} icon={<Plus size={18} color={t.colors.accentInk} strokeWidth={2} />} onPress={add} />
          {error ? <Text variant="small" style={{ color: t.colors.danger }}>{error}</Text> : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

type Spec = {
  title: string;
  singular: string;
  sectionKey: Section;
  fields: FieldDef[];
  primary: (x: any) => string;
  secondary: (x: any) => string;
  add: (pf: ReturnType<typeof usePortfolio>, f: Record<string, string>) => Promise<void>;
};

const splitList = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

function getSpec(section: string): Spec {
  switch (section) {
    case "experiences":
      return {
        title: "Experience",
        singular: "role",
        sectionKey: "experiences",
        fields: [
          { key: "company", label: "Company", required: true },
          { key: "role", label: "Role" },
          { key: "start", label: "Start (YYYY-MM)", placeholder: "2024-06" },
          { key: "end", label: "End (YYYY-MM, blank = present)", placeholder: "" },
          { key: "summary", label: "Summary", multiline: true },
        ],
        primary: (x) => x.role || x.company,
        secondary: (x) => x.company,
        add: (pf, f) =>
          pf.addExperience({ company: f.company, role: f.role ?? "", start: f.start ?? "", end: f.end ? f.end : null, summary: f.summary ?? "", sortOrder: 0 } as any),
      };
    case "education":
      return {
        title: "Education",
        singular: "entry",
        sectionKey: "education",
        fields: [
          { key: "school", label: "School", required: true },
          { key: "degree", label: "Degree" },
          { key: "start", label: "Start year", placeholder: "2020" },
          { key: "end", label: "End year", placeholder: "2024" },
        ],
        primary: (x) => x.school,
        secondary: (x) => x.degree,
        add: (pf, f) =>
          pf.addEducation({ school: f.school, degree: f.degree ?? "", start: f.start ?? "", end: f.end ?? "", sortOrder: 0 } as any),
      };
    case "skills":
      return {
        title: "Skills",
        singular: "group",
        sectionKey: "skills",
        fields: [
          { key: "label", label: "Group label", placeholder: "e.g. Languages", required: true },
          { key: "items", label: "Skills (comma-separated)", placeholder: "TypeScript, SQL, Python" },
        ],
        primary: (x) => x.label,
        secondary: (x) => (x.items ?? []).join(", "),
        add: (pf, f) => pf.addSkillGroup({ label: f.label, items: splitList(f.items), sortOrder: 0 } as any),
      };
    default:
      return {
        title: "Projects",
        singular: "project",
        sectionKey: "projects",
        fields: [
          { key: "title", label: "Title", required: true },
          { key: "role", label: "Your role" },
          { key: "year", label: "Year", placeholder: "2026" },
          { key: "summary", label: "Summary", multiline: true },
          { key: "tags", label: "Tags (comma-separated)", placeholder: "Next.js, Postgres" },
          { key: "link", label: "Link" },
        ],
        primary: (x) => x.title,
        secondary: (x) => x.role,
        add: (pf, f) =>
          pf.addProject({ title: f.title, role: f.role ?? "", year: f.year ?? "", summary: f.summary ?? "", tags: splitList(f.tags), link: f.link || undefined, sortOrder: 0 } as any),
      };
  }
}
