import { Pressable } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { LogOut } from "lucide-react-native";
import { Row, Text } from "@/ui";
import { useTheme } from "@/theme";

/** Only mounted when Clerk is configured (keeps useClerk inside its provider). */
export function SignOutRow() {
  const t = useTheme();
  const { signOut } = useClerk();
  return (
    <Pressable
      onPress={() => signOut()}
      style={({ pressed }) => ({
        paddingVertical: t.space[4],
        paddingHorizontal: t.space[5],
        backgroundColor: pressed ? t.colors.surfaceAlt : "transparent",
      })}
    >
      <Row gap={t.space[3]}>
        <LogOut size={18} color={t.colors.inkDim} strokeWidth={1.75} />
        <Text variant="bodyStrong">Sign out</Text>
      </Row>
    </Pressable>
  );
}
