import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/theme";

/** Square, hairline-bordered initials avatar. */
export function Avatar({
  initials,
  size = 56,
}: {
  initials: string;
  size?: number;
}) {
  const t = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: t.radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: t.colors.borderStrong,
        backgroundColor: t.colors.surfaceAlt,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: t.font.mono.semibold,
          fontSize: size * 0.32,
          color: t.colors.ink,
          letterSpacing: 0.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
