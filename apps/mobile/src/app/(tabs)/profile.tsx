import { useState } from "react";
import { View, Pressable, Linking, Share, Alert } from "react-native";
import {
  ChevronRight,
  Link2,
  SunMoon,
  Download,
  ShieldCheck,
  Trash2,
} from "lucide-react-native";
import { Screen, Text, Surface, Row, Divider } from "@/ui";
import { Avatar, initialsOf } from "@/ui/Avatar";
import { Appear } from "@/ui/motion";
import { useTheme } from "@/theme";
import { useToast } from "@/ui/Toast";
import { haptics } from "@/lib/haptics";
import { config, isAuthConfigured } from "@/lib/config";
import { getThemeMode, setThemeMode, type ThemeMode } from "@/lib/appearance";
import { usePortfolio } from "@/data/portfolio-context";
import { AuthedSession } from "@/components/auth/AuthedSession";

const MODES: ThemeMode[] = ["system", "light", "dark"];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ProfileScreen() {
  const t = useTheme();
  const toast = useToast();
  const { data, mode } = usePortfolio();
  const pf = usePortfolio();
  const [themeMode, setMode] = useState<ThemeMode>(getThemeMode());

  const handle = data?.handle ?? "";
  const url = `${config.apiUrl}/u/${handle}`;

  const cycleTheme = async () => {
    haptics.tap();
    const next = MODES[(MODES.indexOf(themeMode) + 1) % MODES.length];
    setMode(next);
    await setThemeMode(next);
    toast.show(`Appearance: ${cap(next)}`);
  };

  const exportData = async () => {
    haptics.tap();
    try {
      const json = JSON.stringify(await pf.exportData(), null, 2);
      await Share.share({ message: json });
    } catch {
      toast.show("Couldn't export");
    }
  };

  const rows = [
    { key: "url", icon: Link2, label: "Public URL", value: `folio.app/u/${handle}`, onPress: () => Linking.openURL(url) },
    { key: "theme", icon: SunMoon, label: "Appearance", value: cap(themeMode), onPress: cycleTheme },
    { key: "export", icon: Download, label: "Export my data", value: "", onPress: exportData },
    { key: "privacy", icon: ShieldCheck, label: "Privacy & data", value: "", onPress: () => Linking.openURL(`${config.apiUrl}/privacy`) },
  ];

  return (
    <Screen>
      <Appear index={0}>
        <Text variant="display" style={{ marginBottom: t.space[6] }}>Profile</Text>
      </Appear>

      <Appear index={1}>
        <Surface raised padded>
          <Row gap={t.space[3]}>
            <Avatar initials={initialsOf(data?.name || "You")} size={52} />
            <View style={{ flex: 1 }}>
              <Text variant="subtitle">{data?.name || "Your name"}</Text>
              <Text style={{ fontFamily: t.font.mono.regular, fontSize: 12, color: t.colors.muted, marginTop: 2 }}>
                {mode === "demo" ? "demo mode · no account" : `@${handle}`}
              </Text>
            </View>
          </Row>
        </Surface>
      </Appear>

      <View style={{ marginTop: t.space[8] }}>
        <Appear index={2}>
          <Row style={{ marginBottom: t.space[4] }}><Text variant="label">Account</Text></Row>
        </Appear>
        <Appear index={3}>
          <Surface raised>
            {rows.map((r, i) => (
              <View key={r.key}>
                {i > 0 && <Divider inset={54} />}
                <Pressable
                  onPress={r.onPress}
                  style={({ pressed }) => ({ paddingVertical: t.space[4], paddingHorizontal: t.space[5], backgroundColor: pressed ? t.colors.surfaceAlt : "transparent" })}
                >
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
        </Appear>
      </View>

      <View style={{ marginTop: t.space[8] }}>
        <Appear index={4}>
          <Row style={{ marginBottom: t.space[4] }}><Text variant="label">Session</Text></Row>
        </Appear>
        <Appear index={5}>
          <Surface raised>
            {isAuthConfigured ? (
              <AuthedSession />
            ) : (
              <Pressable
                onPress={() => Alert.alert("Demo mode", "Sign-in is enabled in the installed app. This preview runs on local sample data.")}
                style={({ pressed }) => ({ paddingVertical: t.space[4], paddingHorizontal: t.space[5], backgroundColor: pressed ? t.colors.surfaceAlt : "transparent" })}
              >
                <Row gap={t.space[3]}>
                  <Trash2 size={18} color={t.colors.danger} strokeWidth={1.75} />
                  <Text variant="bodyStrong" color="danger">Delete account</Text>
                </Row>
              </Pressable>
            )}
          </Surface>
        </Appear>
      </View>

      <View style={{ alignItems: "center", marginTop: t.space[12] }}>
        <Text variant="caption">Folio v1.0 · Built by Basel Mahmoud</Text>
      </View>
    </Screen>
  );
}
