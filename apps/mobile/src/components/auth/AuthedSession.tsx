import { useState } from "react";
import { Pressable, Alert } from "react-native";
import { useClerk } from "@clerk/clerk-expo";
import { LogOut, Trash2 } from "lucide-react-native";
import { Row, Text, Divider } from "@/ui";
import { useTheme } from "@/theme";
import { useToast } from "@/ui/Toast";
import { haptics } from "@/lib/haptics";
import { usePortfolio } from "@/data/portfolio-context";

/** Sign out + delete account. Only mounted when Clerk is configured. */
export function AuthedSession() {
  const t = useTheme();
  const { signOut } = useClerk();
  const { deleteAccount } = usePortfolio();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function doDelete() {
    setBusy(true);
    try {
      await deleteAccount();
      haptics.success();
      await signOut();
    } catch {
      haptics.warn();
      toast.show("Couldn't delete account");
    } finally {
      setBusy(false);
    }
  }

  const confirmDelete = () =>
    Alert.alert(
      "Delete account",
      "This permanently erases your portfolio and account. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: doDelete },
      ],
    );

  const rowStyle = ({ pressed }: { pressed: boolean }) => ({
    paddingVertical: t.space[4],
    paddingHorizontal: t.space[5],
    backgroundColor: pressed ? t.colors.surfaceAlt : "transparent",
  });

  return (
    <>
      <Pressable onPress={() => { haptics.tap(); signOut(); }} style={rowStyle}>
        <Row gap={t.space[3]}>
          <LogOut size={18} color={t.colors.inkDim} strokeWidth={1.75} />
          <Text variant="bodyStrong">Sign out</Text>
        </Row>
      </Pressable>
      <Divider inset={54} />
      <Pressable onPress={confirmDelete} disabled={busy} style={rowStyle}>
        <Row gap={t.space[3]}>
          <Trash2 size={18} color={t.colors.danger} strokeWidth={1.75} />
          <Text variant="bodyStrong" color="danger">
            {busy ? "Deleting…" : "Delete account"}
          </Text>
        </Row>
      </Pressable>
    </>
  );
}
