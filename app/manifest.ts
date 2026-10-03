import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Idriss Mouaden — Research and writing",
    short_name: "Idriss Mouaden",
    description: "Financial research, business analysis, and writing on banking, finance, and economics.",
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
