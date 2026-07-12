import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Idriss Mouaden — Investigación y ensayos",
    short_name: "Idriss Mouaden",
    description: "Investigación y ensayos sobre economía, banca e instituciones financieras.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4efe5",
    theme_color: "#172333",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
