import { useFonts } from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ClerkProvider } from "@clerk/clerk-expo";
import { colors } from "@/theme";
import { config, isAuthConfigured } from "@/lib/config";
import { tokenCache } from "@/lib/token-cache";
import { DemoPortfolioProvider } from "@/data/portfolio-context";
import { ApiPortfolioProvider } from "@/data/portfolio-api-provider";
import { AuthGate } from "@/components/auth/AuthGate";

function RootStack() {
  const scheme = useColorScheme() === "light" ? "light" : "dark";
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors[scheme].bg },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit/profile" options={{ presentation: "modal" }} />
      <Stack.Screen name="edit/[section]" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const scheme = useColorScheme() === "light" ? "light" : "dark";
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: colors[scheme].bg }} />;
  }

  const content = isAuthConfigured ? (
    <ClerkProvider
      publishableKey={config.clerkPublishableKey}
      tokenCache={tokenCache}
    >
      <AuthGate>
        <ApiPortfolioProvider>
          <RootStack />
        </ApiPortfolioProvider>
      </AuthGate>
    </ClerkProvider>
  ) : (
    <DemoPortfolioProvider>
      <RootStack />
    </DemoPortfolioProvider>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        {content}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
