import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/theme";

/** Small hairline chip with a mono label. */
export function Tag({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "accent" | "success" | "danger";
}) {
  const t = useTheme();
  const border =
    tone === "accent"
      ? t.colors.accent
      : tone === "success"
        ? t.colors.success
        : tone === "danger"
          ? t.colors.danger
          : t.colors.borderStrong;
  const color =
    tone === "accent"
      ? t.colors.accent
      : tone === "success"
        ? t.colors.success
        : tone === "danger"
          ? t.colors.danger
          : t.colors.inkDim;
  return (
    <View
      style={{
        borderColor: border,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: t.radius.sm,
        paddingHorizontal: t.space[2],
        paddingVertical: t.space[1],
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          fontFamily: t.font.mono.medium,
          fontSize: 11,
          letterSpacing: 0.6,
          color,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
