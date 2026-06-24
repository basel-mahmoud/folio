import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "#f7f7f8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "#5277ff" }} />
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#86868f", fontWeight: 700 }}>FOLIO</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#5277ff", marginBottom: 16 }}>AI portfolio &amp; CV builder</div>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05, maxWidth: 900 }}>
            Your work, presented with intent.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "#86868f" }}>Build it in the app · share it on the web</div>
      </div>
    ),
    size,
  );
}
