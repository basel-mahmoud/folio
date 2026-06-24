import { View, type ViewProps, StyleSheet } from "react-native";
import { useTheme } from "@/theme";

/**
 * Layered panel. `raised` adds soft elevation + a subtle top-edge highlight so
 * depth reads on dark without any glow.
 */
export function Surface({
  style,
  alt = false,
  raised = false,
  padded = false,
  ...rest
}: ViewProps & { alt?: boolean; raised?: boolean; padded?: boolean }) {
  const t = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: alt ? t.colors.surfaceAlt : t.colors.surface,
          borderColor: t.colors.border,
          borderWidth: StyleSheet.hairlineWidth,
          borderRadius: t.radius.lg,
        },
        raised && {
          borderTopColor: t.colors.highlight,
          ...t.elevation.md,
        },
        padded && { padding: t.space[5] },
        style,
      ]}
    />
  );
}
