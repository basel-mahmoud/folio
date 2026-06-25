import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useTheme } from "@/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/** Animated circular progress ring with a gradient stroke. Center renders `children`. */
export function ProgressRing({
  pct,
  size = 132,
  stroke = 11,
  children,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}) {
  const t = useTheme();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withDelay(300, withTiming(pct / 100, { duration: 1200 }));
  }, [pct, p]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - p.value),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Defs>
          <LinearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#5277ff" />
            <Stop offset="0.55" stopColor="#8b6cff" />
            <Stop offset="1" stopColor="#43e3c0" />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.colors.surfaceHi} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circ}
          animatedProps={animatedProps}
        />
      </Svg>
      {children}
    </View>
  );
}
