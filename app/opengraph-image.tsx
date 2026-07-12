import { ImageResponse } from "next/og";

export const alt = "Idriss Mouaden — Economía, banca e instituciones financieras";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f4efe5",
          color: "#172333",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "68px 76px 58px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            borderBottom: "2px solid #172333",
            display: "flex",
            fontFamily: "Georgia, serif",
            fontSize: 38,
            justifyContent: "space-between",
            paddingBottom: 28,
          }}
        >
          <span>Idriss Mouaden</span>
          <span style={{ color: "#7a2430", fontFamily: "Arial, sans-serif", fontSize: 18, letterSpacing: "0.15em" }}>
            INVESTIGACIÓN &amp; ENSAYOS
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 970 }}>
          <div style={{ color: "#7a2430", fontFamily: "Arial, sans-serif", fontSize: 19, letterSpacing: "0.18em", marginBottom: 26 }}>
            ECONOMÍA · BANCA · INSTITUCIONES FINANCIERAS
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 76, letterSpacing: "-0.045em", lineHeight: 1.02 }}>
            Banca e instituciones financieras.
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 20, justifyContent: "space-between" }}>
          <span>idrissmouaden.com</span>
          <span style={{ color: "#4f5b68" }}>Investigación independiente · España</span>
        </div>
      </div>
    ),
    size,
  );
}
