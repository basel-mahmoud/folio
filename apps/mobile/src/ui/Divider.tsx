import { View } from "react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "@/theme";

export function Divider({ inset = 0 }: { inset?: number }) {
  const t = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: t.colors.border,
        marginLeft: inset,
      }}
    />
  );
}
