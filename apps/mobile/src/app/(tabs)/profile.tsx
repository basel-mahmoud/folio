import { View, Pressable, StyleSheet, Alert } from "react-native";
import {
  ChevronRight,
  Link2,
  SunMoon,
  Download,
  ShieldCheck,
  LogOut,
  Trash2,
} from "lucide-react-native";
import { Screen, Text, Surface, Row, Divider } from "@/ui";
import { Avatar, initialsOf } from "@/ui/Avatar";
import { useTheme } from "@/theme";
import { usePortfolio } from "@/data/portfolio-context";
import { isAuthConfigured } from "@/lib/config";
import { SignOutRow } from "@/components/auth/SignOutRow";

export default function ProfileScreen() {
  const t = useTheme();
  const { data, mode } = usePortfolio();

  const rows = [
    { key: "url", icon: Link2, label: "Public URL", value: `folio.app/u/${data?.handle ?? ""}` },
    { key: "theme", icon: SunMoon, label: "Appearance", value: "System" },
    { key: "export", icon: Download, label: "Export my data", value: "" },
    { key: "privacy", icon: ShieldCheck, label: "Privacy & data", value: "" },
  ];

  return (
    <Screen>
      <Text variant="display" style={{ marginBottom: t.space[6] }}>Profile</Text>

      <Surface raised padded>
        <Row gap={t.space[3]}>
          <Avatar initials={initialsOf(data?.name || "You")} size={52} />
          <View style={{ flex: 1 }}>
            <Text variant="subtitle">{data?.name || "Your name"}</Text>
            <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted, marginTop: 2 }}>
              {mode === "demo" ? "demo mode · no account" : `@${data?.handle ?? ""}`}
            </Text>
          </View>
        </Row>
      </Surface>

      <View style={{ marginTop: t.space[8] }}>
        <Row style={{ marginBottom: t.space[4] }}><Text variant="label">Account</Text></Row>
        <Surface raised>
          {rows.map((r, i) => (
            <View key={r.key}>
              {i > 0 && <Divider inset={54} />}
              <Pressable style={({ pressed }) => ({ paddingVertical: t.space[4], paddingHorizontal: t.space[5], backgroundColor: pressed ? t.colors.surfaceAlt : "transparent" })}>
                <Row justify="space-between">
                  <Row gap={t.space[3]} style={{ flex: 1 }}>
                    <r.icon size={18} color={t.colors.inkDim} strokeWidth={1.75} />
                    <Text variant="bodyStrong">{r.label}</Text>
                  </Row>
                  <Row gap={t.space[2]}>
                    {!!r.value && <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted }}>{r.value}</Text>}
                    <ChevronRight size={18} color={t.colors.faint} strokeWidth={1.75} />
                  </Row>
                </Row>
              </Pressable>
            </View>
          ))}
        </Surface>
      </View>

      <View style={{ marginTop: t.space[8] }}>
        <Row style={{ marginBottom: t.space[4] }}><Text variant="label">Session</Text></Row>
        <Surface raised>
          {isAuthConfigured ? (
            <>
              <SignOutRow />
              <Divider inset={54} />
            </>
          ) : null}
          <Pressable
            onPress={() =>
              Alert.alert("Delete account", "This permanently erases your portfolio and account. This cannot be undone.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ])
            }
            style={({ pressed }) => ({ paddingVertical: t.space[4], paddingHorizontal: t.space[5], backgroundColor: pressed ? t.colors.surfaceAlt : "transparent" })}
          >
            <Row gap={t.space[3]}>
              <Trash2 size={18} color={t.colors.danger} strokeWidth={1.75} />
              <Text variant="bodyStrong" color="danger">Delete account</Text>
            </Row>
          </Pressable>
        </Surface>
      </View>

      <View style={{ alignItems: "center", marginTop: t.space[12] }}>
        <Text variant="caption">Folio v0.1 · Built by Basel Mahmoud</Text>
      </View>
    </Screen>
  );
}
