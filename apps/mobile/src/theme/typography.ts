/**
 * Type system. Inter for content + headlines (tight tracking, strong weights);
 * JetBrains Mono for labels, metadata, numbers and section markers. The family
 * strings must match the keys loaded via useFonts() in the root layout.
 */
export const fontFamily = {
  sans: {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
  },
  mono: {
    regular: "JetBrainsMono_400Regular",
    medium: "JetBrainsMono_500Medium",
    semibold: "JetBrainsMono_600SemiBold",
    bold: "JetBrainsMono_700Bold",
  },
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 21,
  "2xl": 26,
  "3xl": 32,
  "4xl": 40,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 18,
  base: 22,
  md: 24,
  lg: 26,
  xl: 28,
  "2xl": 32,
  "3xl": 38,
  "4xl": 46,
} as const;
