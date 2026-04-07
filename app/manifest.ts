import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mendix Prep - Intermediate Certification Study Guide",
    short_name: "Mendix Prep",
    description:
      "Free practice exams and study materials for the Mendix Intermediate Developer Certification",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0595DB",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
