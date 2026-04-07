// components/blog/post-header.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Post } from "@/lib/blog";

interface PostHeaderProps {
  post: Post;
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Link>

      <div className="flex items-center gap-3 text-sm mb-4">
        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
          {post.category}
        </span>
        <span className="text-muted-foreground">{post.readingTime} min read</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
        {post.title}
      </h1>

      <time dateTime={post.date} className="text-muted-foreground">
        Published{" "}
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>

      {post.topics.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4">
          {post.topics.map((topic) => (
            <Link
              key={topic}
              href={`/blog?topic=${topic}`}
              className="text-sm px-2.5 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              {topic}
            </Link>
          ))}
        </div>
      ) : null}
    </header>
  );
}
