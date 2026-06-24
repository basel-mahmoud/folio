import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useTheme } from "@/theme";
import { SignInScreen } from "./SignInScreen";

/** Gates the app behind Clerk auth (only mounted when Clerk is configured). */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: t.colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={t.colors.accent} />
      </View>
    );
  }
  if (!isSignedIn) return <SignInScreen />;
  return <>{children}</>;
}
