/**
 * Folio palette — Linear-grade restraint.
 * Layered neutrals (page < surface < raised) so depth comes from elevation, not
 * decoration. One confident cobalt accent. Dark is the primary scheme.
 */
export type ColorScheme = "light" | "dark";

export type Palette = {
  bg: string;
  bgInset: string;
  surface: string;
  surfaceAlt: string;
  surfaceHi: string;
  border: string;
  borderStrong: string;
  highlight: string; // top-edge inner highlight for raised surfaces
  ink: string;
  inkDim: string;
  muted: string;
  faint: string;
  accent: string;
  accentInk: string;
  accentSoft: string;
  accentBorder: string;
  success: string;
  warning: string;
  danger: string;
};

export const colors: Record<ColorScheme, Palette> = {
  dark: {
    bg: "#09090b",
    bgInset: "#0d0d10",
    surface: "#141417",
    surfaceAlt: "#1a1a1f",
    surfaceHi: "#212128",
    border: "#26262c",
    borderStrong: "#33333b",
    highlight: "rgba(255,255,255,0.06)",
    ink: "#f7f7f8",
    inkDim: "#c5c5cd",
    muted: "#86868f",
    faint: "#56565e",
    accent: "#5277ff",
    accentInk: "#ffffff",
    accentSoft: "rgba(82,119,255,0.13)",
    accentBorder: "rgba(82,119,255,0.45)",
    success: "#3ad08a",
    warning: "#e0a93c",
    danger: "#ff6b5e",
  },
  light: {
    bg: "#ffffff",
    bgInset: "#f7f7f8",
    surface: "#ffffff",
    surfaceAlt: "#f6f6f7",
    surfaceHi: "#f1f1f3",
    border: "#ececee",
    borderStrong: "#dadade",
    highlight: "rgba(255,255,255,0.9)",
    ink: "#0a0a0b",
    inkDim: "#3d3d44",
    muted: "#6c6c74",
    faint: "#a0a0a8",
    accent: "#2d5bff",
    accentInk: "#ffffff",
    accentSoft: "rgba(45,91,255,0.08)",
    accentBorder: "rgba(45,91,255,0.30)",
    success: "#0f9d58",
    warning: "#9a6a00",
    danger: "#d8362c",
  },
};
