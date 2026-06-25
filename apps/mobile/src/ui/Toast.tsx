import { createContext, useCallback, useContext, useRef, useState } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { Text } from "./Text";
import { useTheme } from "@/theme";

type ToastCtx = { show: (message: string) => void };
const Ctx = createContext<ToastCtx>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string) => {
    setMsg(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2200);
  }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {msg !== null && (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOutDown.duration(180)}
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 96,
            alignSelf: "center",
            maxWidth: "86%",
          }}
        >
          <View
            style={{
              backgroundColor: t.colors.ink,
              paddingHorizontal: t.space[4],
              paddingVertical: t.space[3],
              borderRadius: t.radius.full,
            }}
          >
            <Text style={{ color: t.colors.bg, fontFamily: t.font.sans.medium, fontSize: 13 }}>
              {msg}
            </Text>
          </View>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
}
