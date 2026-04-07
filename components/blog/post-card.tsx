// components/blog/post-card.tsx
import Link from "next/link";
import type { Post } from "@/lib/blog";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group border border-border rounded-lg p-5 hover:border-primary/50 transition-colors">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {post.category}
          </span>
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center justify-between">
          <time className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>

          <div className="flex gap-1">
            {post.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
