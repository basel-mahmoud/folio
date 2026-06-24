import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { useTheme } from "@/theme";
import type { Palette } from "@/theme/colors";

type Variant =
  | "display" // big page hero
  | "title" // screen / card title
  | "subtitle" // section title
  | "body" // paragraph
  | "bodyStrong"
  | "small" // secondary line
  | "label" // mono, uppercase, tracked — section markers / field labels
  | "mono" // mono data / metadata
  | "caption"; // faint fine print

export type TextProps = RNTextProps & {
  variant?: Variant;
  color?: keyof Palette;
  center?: boolean;
  children?: React.ReactNode;
};

export function Text({
  variant = "body",
  color,
  center,
  style,
  ...rest
}: TextProps) {
  const t = useTheme();
  const v = styleFor(variant, t);
  return (
    <RNText
      {...rest}
      style={[
        v,
        color ? { color: t.colors[color] } : null,
        center ? { textAlign: "center" } : null,
        style,
      ]}
    />
  );
}

function styleFor(variant: Variant, t: ReturnType<typeof useTheme>) {
  const c = t.colors;
  switch (variant) {
    case "display":
      return {
        fontFamily: t.font.sans.bold,
        fontSize: t.size["3xl"],
        lineHeight: t.leading["3xl"],
        letterSpacing: -0.6,
        color: c.ink,
      };
    case "title":
      return {
        fontFamily: t.font.sans.semibold,
        fontSize: t.size.xl,
        lineHeight: t.leading.xl,
        letterSpacing: -0.4,
        color: c.ink,
      };
    case "subtitle":
      return {
        fontFamily: t.font.sans.semibold,
        fontSize: t.size.lg,
        lineHeight: t.leading.lg,
        letterSpacing: -0.2,
        color: c.ink,
      };
    case "body":
      return {
        fontFamily: t.font.sans.regular,
        fontSize: t.size.base,
        lineHeight: t.leading.base,
        color: c.inkDim,
      };
    case "bodyStrong":
      return {
        fontFamily: t.font.sans.medium,
        fontSize: t.size.base,
        lineHeight: t.leading.base,
        color: c.ink,
      };
    case "small":
      return {
        fontFamily: t.font.sans.regular,
        fontSize: t.size.sm,
        lineHeight: t.leading.sm,
        color: c.muted,
      };
    case "label":
      return {
        fontFamily: t.font.mono.medium,
        fontSize: t.size.xs,
        lineHeight: t.leading.xs,
        letterSpacing: 1.4,
        textTransform: "uppercase" as const,
        color: c.muted,
      };
    case "mono":
      return {
        fontFamily: t.font.mono.regular,
        fontSize: t.size.sm,
        lineHeight: t.leading.sm,
        color: c.inkDim,
      };
    case "caption":
      return {
        fontFamily: t.font.sans.regular,
        fontSize: t.size.xs,
        lineHeight: t.leading.xs,
        color: c.faint,
      };
  }
}
