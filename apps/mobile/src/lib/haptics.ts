import * as Haptics from "expo-haptics";

/** Thin haptics wrapper — no-ops on web / unsupported devices. */
export const haptics = {
  tap: () => Haptics.selectionAsync().catch(() => {}),
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  warn: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};
