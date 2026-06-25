import { useEffect, useState } from "react";
import {
  Pressable,
  View,
  Text as RNText,
  type ViewProps,
  type PressableProps,
  type TextStyle,
  type StyleProp,
} from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme";

/** Staggered entrance: subtle slide-up + fade. */
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
      entering={FadeInDown.delay(delay + index * 65).duration(460).damping(22)}
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

/** Counts up to `value` on mount (rAF, eased). */
export function AnimatedNumber({
  value,
  duration = 1000,
  style,
}: {
  value: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
}) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <RNText style={style}>{n}</RNText>;
}

/** A softly pulsing dot — signals "live" state. */
export function PulseDot({ color, size = 6 }: { color: string; size?: number }) {
  const s = useSharedValue(1);
  useEffect(() => {
    s.value = withRepeat(
      withSequence(withTiming(0.35, { duration: 950 }), withTiming(1, { duration: 950 })),
      -1,
      true,
    );
  }, [s]);
  const a = useAnimatedStyle(() => ({
    opacity: 0.5 + 0.5 * s.value,
    transform: [{ scale: 0.82 + 0.18 * s.value }],
  }));
  return (
    <Animated.View
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }, a]}
    />
  );
}

/** Progress bar: animated fill, gradient, and a looping sheen. */
export function AnimatedProgress({
  pct,
  tone = "accent",
}: {
  pct: number;
  tone?: "accent" | "success";
}) {
  const t = useTheme();
  const w = useSharedValue(0);
  const sheen = useSharedValue(-80);
  const [track, setTrack] = useState(0);

  useEffect(() => {
    w.value = withDelay(250, withTiming((track * pct) / 100, { duration: 950 }));
  }, [track, pct, w]);
  useEffect(() => {
    if (track > 0) {
      sheen.value = withDelay(
        700,
        withRepeat(withTiming(track, { duration: 1500 }), -1, false),
      );
    }
  }, [track, sheen]);

  const fillA = useAnimatedStyle(() => ({ width: w.value }));
  const sheenA = useAnimatedStyle(() => ({ transform: [{ translateX: sheen.value }] }));
  const colors =
    tone === "success"
      ? [t.colors.success, "#2fa9d9"]
      : [t.colors.accent, "#8b6cff"];

  return (
    <View
      onLayout={(e) => setTrack(e.nativeEvent.layout.width)}
      style={{ height: 6, borderRadius: 999, backgroundColor: t.colors.surfaceHi, overflow: "hidden" }}
    >
      <Animated.View style={[fillA, { height: "100%", borderRadius: 999, overflow: "hidden" }]}>
        <LinearGradient
          colors={colors as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
        <Animated.View
          style={[
            sheenA,
            { position: "absolute", top: 0, bottom: 0, width: 60, backgroundColor: "rgba(255,255,255,0.35)" },
          ]}
        />
      </Animated.View>
    </View>
  );
}
