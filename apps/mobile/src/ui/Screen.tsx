import { ScrollView, View, type ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

/** Page container: themed background, safe-area top padding, optional scroll. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewProps["style"];
  contentStyle?: ViewProps["style"];
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const pad = padded ? t.space[5] : 0;

  const inner = (
    <View
      style={[
        { paddingHorizontal: pad, paddingTop: t.space[2], paddingBottom: t.space[16] },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View
        style={[
          { flex: 1, backgroundColor: t.colors.bg, paddingTop: insets.top },
          style,
        ]}
      >
        {inner}
      </View>
    );
  }

  return (
    <ScrollView
      style={[{ flex: 1, backgroundColor: t.colors.bg }, style]}
      contentContainerStyle={{ paddingTop: insets.top }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {inner}
    </ScrollView>
  );
}
