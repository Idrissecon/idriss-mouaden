import { ImageResponse } from "next/og";
import type { ContentItem } from "@/lib/content-types";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

function titleFontSize(title: string) {
  if (title.length > 90) return 44;
  if (title.length > 55) return 54;
  return 66;
}

export function publicationOgImage(
  item: Pick<ContentItem, "title" | "venue" | "year"> | null,
  category: "research" | "writing",
) {
  const title = item?.title ?? "Banking and financial institutions.";
  const eyebrow = [
    category === "research" ? "RESEARCH" : "WRITING",
    item?.venue?.toUpperCase(),
    item?.year?.toString(),
  ]
    .filter(Boolean)
    .join(" · ");

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
            RESEARCH &amp; WRITING
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ color: "#7a2430", fontFamily: "Arial, sans-serif", fontSize: 19, letterSpacing: "0.18em", marginBottom: 26 }}>
            {eyebrow}
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: titleFontSize(title), letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            {title}
          </div>
        </div>
        <div style={{ alignItems: "center", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 20, justifyContent: "space-between" }}>
          <span>idrissmouaden.com</span>
          <span style={{ color: "#4f5b68" }}>Independent research · Spain</span>
        </div>
      </div>
    ),
    ogImageSize,
  );
}
