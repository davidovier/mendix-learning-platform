// app/blog/page.tsx
import type { Metadata } from "next";
import { getAllPosts, getCategories, getTopics } from "@/lib/blog";
import { PostCard } from "@/components/blog/post-card";

export const metadata: Metadata = {
  title: "Blog - Mendix Certification Tips & Guides",
  description:
    "Expert tips, concept guides, and practice strategies for passing the Mendix Intermediate Developer Certification.",
  keywords: ["mendix blog", "mendix certification tips", "mendix guides"],
};

interface BlogPageProps {
  searchParams: Promise<{ category?: string; topic?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const allPosts = await getAllPosts();
  const categories = await getCategories();
  const topics = await getTopics();

  // Filter posts based on query params
  let posts = allPosts;
  if (params.category) {
    posts = posts.filter((post) => post.category === params.category);
  }
  if (params.topic) {
    posts = posts.filter((post) => post.topics.includes(params.topic!));
  }

  const activeCategory = params.category || null;
  const activeTopic = params.topic || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Mendix Certification Blog
          </h1>
          <p className="text-muted-foreground">
            Tips, guides, and strategies to help you pass the Mendix Intermediate exam
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <a
              href="/blog"
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`/blog?category=${encodeURIComponent(cat.name)}`}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {cat.name} ({cat.count})
              </a>
            ))}
          </div>

          {/* Topic Filter */}
          <div className="flex flex-wrap gap-2">
            {topics.slice(0, 8).map((topic) => (
              <a
                key={topic.name}
                href={`/blog?topic=${encodeURIComponent(topic.name)}`}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeTopic === topic.name
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {topic.name}
              </a>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found.</p>
            <a href="/blog" className="text-primary hover:underline mt-2 inline-block">
              View all posts
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
