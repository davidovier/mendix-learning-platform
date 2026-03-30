import type { MetadataRoute } from "next";
import { topics } from "@/lib/content/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  const staticPages = [
    "",
    "/study",
    "/practice",
    "/exam",
    "/cheatsheet",
    "/progress",
    "/login",
    "/signup",
  ];

  const topicPages = topics.map((topic) => `/study/${topic.id}`);

  const allPages = [...staticPages, ...topicPages];

  return allPages.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/study/") ? 0.7 : 0.8,
  }));
}
