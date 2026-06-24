import { useEffect, useState } from "react";
import { Pressable, View, type ViewProps, type PressableProps } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useTheme } from "@/theme";

/** Staggered entrance: subtle slide-up + fade. Index drives the stagger. */
export function Appear({
  children,
  index = 0,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: ViewProps["style"];
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay + index * 65)
        .duration(460)
        .damping(22)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable with a tasteful spring scale on press. */
export function PressScale({
  children,
  style,
  scale = 0.975,
  ...rest
}: PressableProps & { scale?: number; children: React.ReactNode }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        s.value = withSpring(scale, { damping: 18, stiffness: 320 });
        rest.onPressIn?.(e);
      }}
      onPressOut={(e) => {
        s.value = withSpring(1, { damping: 16, stiffness: 280 });
        rest.onPressOut?.(e);
      }}
      style={[a, style as object]}
    >
      {children}
    </AnimatedPressable>
  );
}

/** A progress bar that fills from 0 → pct on mount. */
export function AnimatedProgress({
  pct,
  tone = "accent",
}: {
  pct: number;
  tone?: "accent" | "success";
}) {
  const t = useTheme();
  const w = useSharedValue(0);
  const [track, setTrack] = useState(0);
  useEffect(() => {
    w.value = withDelay(250, withTiming((track * pct) / 100, { duration: 950 }));
  }, [track, pct, w]);
  const a = useAnimatedStyle(() => ({ width: w.value }));
  return (
    <View
      onLayout={(e) => setTrack(e.nativeEvent.layout.width)}
      style={{
        height: 5,
        borderRadius: 999,
        backgroundColor: t.colors.surfaceHi,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          a,
          {
            height: "100%",
            borderRadius: 999,
            backgroundColor:
              tone === "success" ? t.colors.success : t.colors.accent,
          },
        ]}
      />
    </View>
  );
}
