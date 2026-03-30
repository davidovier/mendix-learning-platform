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
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
