import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { X, Plus, Trash2 } from "lucide-react-native";
import { Screen, Text, Field, Button, Row, Surface } from "@/ui";
import { useTheme } from "@/theme";
import { usePortfolio } from "@/data/portfolio-context";
import type { Link } from "@/data/demo";

export default function EditProfile() {
  const t = useTheme();
  const router = useRouter();
  const { data, updateProfile, setHandle } = usePortfolio();

  const [name, setName] = useState(data?.name ?? "");
  const [headline, setHeadline] = useState(data?.headline ?? "");
  const [location, setLocation] = useState(data?.location ?? "");
  const [bio, setBio] = useState(data?.bio ?? "");
  const [handle, setHandleVal] = useState(data?.handle ?? "");
  const [links, setLinks] = useState<Link[]>(data?.links ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await updateProfile({
        name,
        headline,
        location,
        bio,
        links: links.filter((l) => l.label && l.url),
      });
      if (handle && handle !== data?.handle) await setHandle(handle);
      router.back();
    } catch (e) {
      setError(e instanceof Error && e.message === "handle_taken" ? "That handle is taken." : "Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen contentStyle={{ paddingTop: t.space[3] }}>
      <Row justify="space-between" style={{ marginBottom: t.space[6] }}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <X size={22} color={t.colors.inkDim} strokeWidth={1.75} />
        </Pressable>
        <Text variant="label">Edit profile</Text>
        <Button label="Save" size="sm" loading={busy} onPress={save} />
      </Row>

      <View style={{ gap: t.space[5] }}>
        <Field label="Name" value={name} onChangeText={setName} placeholder="Your full name" />
        <Field label="Headline" value={headline} onChangeText={setHeadline} placeholder="e.g. Full-stack engineer" />
        <Field label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />
        <Field label="Handle" value={handle} onChangeText={(v) => setHandleVal(v.toLowerCase())} autoCapitalize="none" placeholder="username" hint={`folio.app/u/${handle || "username"}`} />
        <Field label="Bio" value={bio} onChangeText={setBio} placeholder="A short, sharp summary of what you do." multiline />

        <View style={{ gap: t.space[2.5] }}>
          <Text variant="label">Links</Text>
          {links.map((l, i) => (
            <Surface key={i} padded style={{ gap: t.space[3] }}>
              <Row justify="space-between">
                <Text variant="caption">Link {i + 1}</Text>
                <Pressable onPress={() => setLinks(links.filter((_, j) => j !== i))} hitSlop={8}>
                  <Trash2 size={15} color={t.colors.danger} strokeWidth={1.75} />
                </Pressable>
              </Row>
              <Field placeholder="Label (e.g. GitHub)" value={l.label} onChangeText={(v) => setLinks(links.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
              <Field placeholder="URL" autoCapitalize="none" value={l.url} onChangeText={(v) => setLinks(links.map((x, j) => (j === i ? { ...x, url: v } : x)))} />
            </Surface>
          ))}
          {links.length < 6 && (
            <Button label="Add link" variant="ghost" icon={<Plus size={16} color={t.colors.inkDim} strokeWidth={2} />} onPress={() => setLinks([...links, { label: "", url: "" }])} />
          )}
        </View>
      </View>

      {error ? <Text variant="small" style={{ color: t.colors.danger, marginTop: t.space[5] }}>{error}</Text> : null}
    </Screen>
  );
}
