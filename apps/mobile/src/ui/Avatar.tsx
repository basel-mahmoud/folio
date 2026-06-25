import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "./Text";
import { useTheme } from "@/theme";

/** Square initials avatar with a subtle gradient ring. */
export function Avatar({
  initials,
  size = 56,
}: {
  initials: string;
  size?: number;
}) {
  const t = useTheme();
  return (
    <LinearGradient
      colors={[t.colors.accent, "#8b6cff", "#43e3c0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: t.radius.md + 2,
        padding: 1.5,
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: t.radius.md,
          backgroundColor: t.colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: t.font.mono.semibold,
            fontSize: size * 0.3,
            color: t.colors.ink,
            letterSpacing: 0.5,
          }}
        >
          {initials}
        </Text>
      </View>
    </LinearGradient>
  );
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}
