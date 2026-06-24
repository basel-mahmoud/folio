import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { LayoutGrid, Eye, Sparkles, CircleUser } from "lucide-react-native";
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.accent,
        tabBarInactiveTintColor: t.colors.muted,
        tabBarStyle: {
          backgroundColor: t.colors.bg,
          borderTopColor: t.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 66,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontFamily: t.font.mono.medium,
          fontSize: 10,
          letterSpacing: 0.6,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Build",
          tabBarIcon: ({ color }) => (
            <LayoutGrid size={20} color={color} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="preview"
        options={{
          title: "Preview",
          tabBarIcon: ({ color }) => (
            <Eye size={20} color={color} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="tailor"
        options={{
          title: "Tailor",
          tabBarIcon: ({ color }) => (
            <Sparkles size={20} color={color} strokeWidth={1.75} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <CircleUser size={20} color={color} strokeWidth={1.75} />
          ),
        }}
      />
    </Tabs>
  );
}
