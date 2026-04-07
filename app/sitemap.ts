import type { MetadataRoute } from "next";
import { topics } from "@/lib/content/topics";
import { getAllPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  const staticPages = [
    "",
    "/study",
    "/practice",
    "/exam",
    "/cheatsheet",
    "/progress",
    "/pricing",
    "/blog",
    "/login",
    "/signup",
  ];

  const topicPages = topics.map((topic) => `/study/${topic.id}`);

  // Get blog posts
  const posts = await getAllPosts();
  const blogPages = posts.map((post) => `/blog/${post.slug}`);

  const allPages = [...staticPages, ...topicPages, ...blogPages];

  return allPages.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : route.startsWith("/blog/") ? "monthly" : "monthly",
    priority: route === "" ? 1 : route === "/blog" ? 0.8 : route.startsWith("/blog/") ? 0.6 : 0.8,
  }));
}
