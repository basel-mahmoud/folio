import { Appearance } from "react-native";
import * as SecureStore from "expo-secure-store";

export type ThemeMode = "system" | "light" | "dark";
const KEY = "folio-theme-mode";

// Dark-first: the app opens dark out of the box. Users can still pick
// light / system from Appearance settings, which persists their choice.
let current: ThemeMode = "dark";
export const getThemeMode = (): ThemeMode => current;

function apply(mode: ThemeMode) {
  // setColorScheme accepts null at runtime to reset to system, but its types
  // don't include null — cast to pass it through.
  const setScheme = Appearance.setColorScheme as unknown as (
    s: "light" | "dark" | null,
  ) => void;
  try {
    setScheme(mode === "system" ? null : mode);
  } catch {}
}

/** Load the persisted theme mode and apply it. Call once on app start. */
export async function loadAndApplyThemeMode(): Promise<ThemeMode> {
  try {
    const v = (await SecureStore.getItemAsync(KEY)) as ThemeMode | null;
    if (v === "light" || v === "dark" || v === "system") current = v;
  } catch {}
  apply(current);
  return current;
}

export async function setThemeMode(mode: ThemeMode) {
  current = mode;
  apply(mode);
  try {
    await SecureStore.setItemAsync(KEY, mode);
  } catch {}
}

// Apply the dark-first default synchronously on import, before the first
// render, so the app never flashes light while the persisted value loads.
apply(current);
