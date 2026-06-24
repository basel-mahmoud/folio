import { Pressable, ActivityIndicator, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  loading,
  full,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
}) {
  const t = useTheme();
  const height = size === "sm" ? 36 : size === "lg" ? 52 : 44;
  const px = size === "sm" ? t.space[3] : t.space[4];
  const fontSize = size === "lg" ? t.size.md : t.size.base;

  const bg =
    variant === "primary"
      ? t.colors.accent
      : variant === "danger"
        ? t.colors.danger
        : "transparent";
  const labelColor =
    variant === "primary" || variant === "danger"
      ? variant === "primary"
        ? t.colors.accentInk
        : "#fff"
      : variant === "ghost"
        ? t.colors.inkDim
        : t.colors.ink;
  const borderColor =
    variant === "secondary" ? t.colors.borderStrong : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          height,
          paddingHorizontal: px,
          borderRadius: t.radius.md,
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === "secondary" ? StyleSheet.hairlineWidth : 0,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: t.space[2],
          alignSelf: full ? "stretch" : "flex-start",
          opacity: disabled ? 0.4 : pressed ? 0.82 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColor} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text
            style={{
              fontFamily: t.font.sans.semibold,
              fontSize,
              color: labelColor,
              letterSpacing: -0.1,
            }}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
