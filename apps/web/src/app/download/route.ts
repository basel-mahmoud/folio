/**
 * Streams the latest Android APK with a clean filename (Folio.apk). We proxy the
 * EAS artifact (a stable permalink that redirects to a fresh signed CDN URL)
 * rather than 302-ing, so the browser saves it as "Folio.apk" instead of the
 * EAS build hash. The body is streamed through, not buffered.
 */
export const runtime = "nodejs";
export const maxDuration = 60;

const APK_URL =
  process.env.EXPO_APK_URL ??
  "https://expo.dev/artifacts/eas/QUbQC1Wg2ki7PHOPWYxB1m3yRTe9QPwLeP6f1pa_sgE.apk";

export async function GET() {
  const upstream = await fetch(APK_URL, { redirect: "follow" });
  if (!upstream.ok || !upstream.body) {
    return new Response("APK temporarily unavailable", { status: 502 });
  }
  const headers = new Headers();
  headers.set("Content-Type", "application/vnd.android.package-archive");
  headers.set("Content-Disposition", 'attachment; filename="Folio.apk"');
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set("Cache-Control", "public, max-age=300");
  return new Response(upstream.body, { status: 200, headers });
}
