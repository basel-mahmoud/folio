import { NextResponse } from "next/server";

/**
 * Stable download link for the latest Android APK. The concrete EAS artifact URL
 * changes per build, so we redirect from a stable path (overridable via env).
 */
const APK_URL =
  process.env.EXPO_APK_URL ??
  "https://expo.dev/artifacts/eas/AxcvZS-WHVKedPv5nOf-DpRhxx8CZEKjc_iPq0flKA4.apk";

export function GET() {
  return NextResponse.redirect(APK_URL, 302);
}
