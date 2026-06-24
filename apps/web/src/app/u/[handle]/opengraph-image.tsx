import { ImageResponse } from "next/og";
import { getPublicByHandle } from "@/lib/services/portfolio";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function OgImage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const bundle = await getPublicByHandle(handle.toLowerCase());
  const name = bundle?.portfolio.name || handle;
  const headline = bundle?.portfolio.headline || "Portfolio";

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
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#5277ff" }} />
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#86868f", fontWeight: 700 }}>
            FOLIO
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, color: "#5277ff", marginBottom: 16 }}>{headline}</div>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {name}
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#86868f" }}>folio.app/u/{handle}</div>
      </div>
    ),
    size,
  );
}
