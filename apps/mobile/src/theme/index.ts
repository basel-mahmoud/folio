import { useColorScheme } from "react-native";
import { colors, type ColorScheme, type Palette } from "./colors";
import { fontFamily, fontSize, lineHeight } from "./typography";

/** 4pt spacing scale (generous rhythm). */
export const space = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 999,
} as const;

export type Elevation = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: { width: number; height: number };
  elevation: number;
};

export type Theme = {
  scheme: ColorScheme;
  colors: Palette;
  space: typeof space;
  radius: typeof radius;
  font: typeof fontFamily;
  size: typeof fontSize;
  leading: typeof lineHeight;
  elevation: { sm: Elevation; md: Elevation };
};

/** Follows the system scheme; dark is the primary/home scheme. */
export function useTheme(): Theme {
  const scheme: ColorScheme = useColorScheme() === "light" ? "light" : "dark";
  const dark = scheme === "dark";
  return {
    scheme,
    colors: colors[scheme],
    space,
    radius,
    font: fontFamily,
    size: fontSize,
    leading: lineHeight,
    elevation: {
      sm: {
        shadowColor: "#000",
        shadowOpacity: dark ? 0.4 : 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      },
      md: {
        shadowColor: "#000",
        shadowOpacity: dark ? 0.5 : 0.08,
        shadowRadius: 22,
        shadowOffset: { width: 0, height: 12 },
        elevation: 8,
      },
    },
  };
}

export { colors, fontFamily, fontSize, lineHeight };
export type { ColorScheme, Palette };
