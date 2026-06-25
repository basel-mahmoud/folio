import { useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { X, Plus, Trash2, Sparkles, Check } from "lucide-react-native";
import { Screen, Text, Field, Button, Row, Surface, Divider } from "@/ui";
import { useTheme } from "@/theme";
import { useToast } from "@/ui/Toast";
import { haptics } from "@/lib/haptics";
import { usePortfolio, type Section } from "@/data/portfolio-context";

type FieldDef = { key: string; label: string; placeholder?: string; multiline?: boolean; required?: boolean };

export default function SectionEditor() {
  const t = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { section } = useLocalSearchParams<{ section: string }>();
  const pf = usePortfolio();
  const [form, setForm] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [polishing, setPolishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spec = getSpec(section ?? "projects");
  const items = (pf.data?.[spec.sectionKey] ?? []) as { id: string }[];
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const reset = () => { setForm({}); setEditingId(null); setError(null); };

  function startEdit(item: { id: string }) {
    haptics.tap();
    setForm(spec.toForm(item));
    setEditingId(item.id);
    setError(null);
  }

  async function submit() {
    const missing = spec.fields.find((f) => f.required && !form[f.key]?.trim());
    if (missing) { setError(`${missing.label} is required.`); return; }
    setBusy(true);
    setError(null);
    try {
      const obj = spec.build(form);
      if (editingId) await pf.update(spec.sectionKey, editingId, obj);
      else await spec.add(pf, obj);
      haptics.success();
      toast.show(editingId ? "Saved" : `${spec.singular} added`);
      reset();
    } catch {
      haptics.warn();
      setError("Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    haptics.light();
    try { await pf.remove(spec.sectionKey, id); toast.show("Removed"); if (editingId === id) reset(); }
    catch { toast.show("Couldn't remove"); }
  }

  async function polish() {
    setPolishing(true);
    try {
      const out = await pf.generateText("project", form.summary ?? "", "concise");
      if (out) { set("summary", out); haptics.success(); toast.show("Polished with AI"); }
    } catch {
      haptics.warn();
      toast.show("AI is busy — try again");
    } finally {
      setPolishing(false);
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
        {items.length > 0 && (
          <Surface raised style={{ marginBottom: t.space[6] }}>
            {items.map((it, i) => (
              <View key={it.id}>
                {i > 0 && <Divider inset={t.space[5]} />}
                <Pressable
                  onPress={() => startEdit(it)}
                  style={({ pressed }) => ({
                    paddingVertical: t.space[4],
                    paddingHorizontal: t.space[5],
                    backgroundColor: editingId === it.id ? t.colors.accentSoft : pressed ? t.colors.surfaceAlt : "transparent",
                  })}
                >
                  <Row justify="space-between">
                    <View style={{ flex: 1, paddingRight: t.space[3] }}>
                      <Text variant="bodyStrong" numberOfLines={1}>{spec.primary(it)}</Text>
                      {!!spec.secondary(it) && <Text variant="caption" numberOfLines={1} style={{ marginTop: 1 }}>{spec.secondary(it)}</Text>}
                    </View>
                    <Pressable onPress={() => remove(it.id)} hitSlop={10}>
                      <Trash2 size={16} color={t.colors.danger} strokeWidth={1.75} />
                    </Pressable>
                  </Row>
                </Pressable>
              </View>
            ))}
          </Surface>
        )}

        <Row justify="space-between" style={{ marginBottom: t.space[3] }}>
          <Text variant="label">{editingId ? `Edit ${spec.singular}` : `Add ${spec.singular}`}</Text>
          {editingId && (
            <Pressable onPress={reset}><Text variant="caption" color="accent">+ New instead</Text></Pressable>
          )}
        </Row>

        <View style={{ gap: t.space[4] }}>
          {spec.fields.map((f) => (
            <View key={f.key} style={{ gap: t.space[2] }}>
              <Field
                label={f.label}
                placeholder={f.placeholder}
                multiline={f.multiline}
                value={form[f.key] ?? ""}
                onChangeText={(v) => set(f.key, v)}
                autoCapitalize={f.key === "link" ? "none" : "sentences"}
              />
              {f.key === "summary" && (
                <Pressable
                  onPress={polish}
                  disabled={polishing}
                  style={{ alignSelf: "flex-start", opacity: polishing ? 0.5 : 1 }}
                >
                  <Row gap={6}>
                    <Sparkles size={13} color={t.colors.accent} strokeWidth={2} />
                    <Text variant="caption" color="accent">
                      {polishing ? "Polishing…" : "Polish with AI"}
                    </Text>
                  </Row>
                </Pressable>
              )}
            </View>
          ))}
          <Button
            label={editingId ? "Save changes" : `Add ${spec.singular}`}
            size="lg"
            full
            loading={busy}
            icon={editingId
              ? <Check size={18} color={t.colors.accentInk} strokeWidth={2.5} />
              : <Plus size={18} color={t.colors.accentInk} strokeWidth={2} />}
            onPress={submit}
          />
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
  primary: (x: Record<string, unknown>) => string;
  secondary: (x: Record<string, unknown>) => string;
  build: (f: Record<string, string>) => Record<string, unknown>;
  add: (pf: ReturnType<typeof usePortfolio>, obj: Record<string, unknown>) => Promise<void>;
  toForm: (x: Record<string, unknown>) => Record<string, string>;
};

const splitList = (s?: string) => (s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const S = (v: unknown) => (v == null ? "" : String(v));
const arr = (v: unknown) => (Array.isArray(v) ? (v as string[]).join(", ") : "");

function getSpec(section: string): Spec {
  switch (section) {
    case "experiences":
      return {
        title: "Experience", singular: "role", sectionKey: "experiences",
        fields: [
          { key: "company", label: "Company", required: true },
          { key: "role", label: "Role" },
          { key: "start", label: "Start (YYYY-MM)", placeholder: "2024-06" },
          { key: "end", label: "End (YYYY-MM, blank = present)" },
          { key: "summary", label: "Summary", multiline: true },
        ],
        primary: (x) => S(x.role) || S(x.company),
        secondary: (x) => S(x.company),
        build: (f) => ({ company: f.company, role: f.role ?? "", start: f.start ?? "", end: f.end ? f.end : null, summary: f.summary ?? "", sortOrder: 0 }),
        add: (pf, o) => pf.addExperience(o as never),
        toForm: (x) => ({ company: S(x.company), role: S(x.role), start: S(x.start), end: S(x.end), summary: S(x.summary) }),
      };
    case "education":
      return {
        title: "Education", singular: "entry", sectionKey: "education",
        fields: [
          { key: "school", label: "School", required: true },
          { key: "degree", label: "Degree" },
          { key: "start", label: "Start year", placeholder: "2020" },
          { key: "end", label: "End year", placeholder: "2024" },
        ],
        primary: (x) => S(x.school),
        secondary: (x) => S(x.degree),
        build: (f) => ({ school: f.school, degree: f.degree ?? "", start: f.start ?? "", end: f.end ?? "", sortOrder: 0 }),
        add: (pf, o) => pf.addEducation(o as never),
        toForm: (x) => ({ school: S(x.school), degree: S(x.degree), start: S(x.start), end: S(x.end) }),
      };
    case "skills":
      return {
        title: "Skills", singular: "group", sectionKey: "skills",
        fields: [
          { key: "label", label: "Group label", placeholder: "e.g. Languages", required: true },
          { key: "items", label: "Skills (comma-separated)", placeholder: "TypeScript, SQL, Python" },
        ],
        primary: (x) => S(x.label),
        secondary: (x) => arr(x.items),
        build: (f) => ({ label: f.label, items: splitList(f.items), sortOrder: 0 }),
        add: (pf, o) => pf.addSkillGroup(o as never),
        toForm: (x) => ({ label: S(x.label), items: arr(x.items) }),
      };
    default:
      return {
        title: "Projects", singular: "project", sectionKey: "projects",
        fields: [
          { key: "title", label: "Title", required: true },
          { key: "role", label: "Your role" },
          { key: "year", label: "Year", placeholder: "2026" },
          { key: "summary", label: "Summary", multiline: true },
          { key: "tags", label: "Tags (comma-separated)", placeholder: "Next.js, Postgres" },
          { key: "link", label: "Link" },
        ],
        primary: (x) => S(x.title),
        secondary: (x) => S(x.role),
        build: (f) => ({ title: f.title, role: f.role ?? "", year: f.year ?? "", summary: f.summary ?? "", tags: splitList(f.tags), link: f.link || undefined, sortOrder: 0 }),
        add: (pf, o) => pf.addProject(o as never),
        toForm: (x) => ({ title: S(x.title), role: S(x.role), year: S(x.year), summary: S(x.summary), tags: arr(x.tags), link: S(x.link) }),
      };
  }
}
