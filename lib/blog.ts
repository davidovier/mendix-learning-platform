// lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  topics: string[];
  image?: string;
  content: string;
  readingTime: number;
}

export interface CategoryCount {
  name: string;
  count: number;
}

export interface TopicCount {
  name: string;
  count: number;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function getPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

export async function getAllPosts(): Promise<Post[]> {
  const files = getPostFiles();

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "",
      category: data.category || "Uncategorized",
      topics: data.topics || [],
      image: data.image,
      content,
      readingTime: calculateReadingTime(content),
    } as Post;
  });

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    category: data.category || "Uncategorized",
    topics: data.topics || [],
    image: data.image,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category === category);
}

export async function getPostsByTopic(topic: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.topics.includes(topic));
}

export async function getRelatedPosts(post: Post, limit: number = 3): Promise<Post[]> {
  const posts = await getAllPosts();

  // Filter out current post and find related by category or overlapping topics
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category === post.category) score += 2;
      const overlappingTopics = p.topics.filter((t) => post.topics.includes(t));
      score += overlappingTopics.length;
      return { post: p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return related;
}

export async function getCategories(): Promise<CategoryCount[]> {
  const posts = await getAllPosts();
  const counts: Record<string, number> = {};

  posts.forEach((post) => {
    counts[post.category] = (counts[post.category] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getTopics(): Promise<TopicCount[]> {
  const posts = await getAllPosts();
  const counts: Record<string, number> = {};

  posts.forEach((post) => {
    post.topics.forEach((topic) => {
      counts[topic] = (counts[topic] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getAllSlugs(): Promise<string[]> {
  const files = getPostFiles();
  return files.map((file) => file.replace(/\.mdx$/, ""));
}
