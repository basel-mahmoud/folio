import { useState } from "react";
import { TextInput, View, StyleSheet, type TextInputProps } from "react-native";
import { Text } from "./Text";
import { useTheme } from "@/theme";

export function Field({
  label,
  hint,
  multiline,
  style,
  ...rest
}: TextInputProps & { label?: string; hint?: string }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: t.space[1.5] }}>
      {label ? <Text variant="label">{label}</Text> : null}
      <TextInput
        {...rest}
        multiline={multiline}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        placeholderTextColor={t.colors.faint}
        style={[
          {
            fontFamily: t.font.sans.regular,
            fontSize: t.size.base,
            color: t.colors.ink,
            backgroundColor: t.colors.surface,
            borderColor: focused ? t.colors.accent : t.colors.border,
            borderWidth: StyleSheet.hairlineWidth + (focused ? 1 : 0),
            borderRadius: t.radius.md,
            paddingHorizontal: t.space[3],
            paddingVertical: t.space[3],
            minHeight: multiline ? 96 : 46,
            textAlignVertical: multiline ? "top" : "center",
          },
          style,
        ]}
      />
      {hint ? <Text variant="caption">{hint}</Text> : null}
    </View>
  );
}
