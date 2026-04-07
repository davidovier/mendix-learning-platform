// components/blog/post-footer.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "./post-card";
import type { Post } from "@/lib/blog";

interface PostFooterProps {
  post: Post;
  relatedPosts: Post[];
}

export function PostFooter({ post, relatedPosts }: PostFooterProps) {
  // Determine CTA based on topics
  const hasMicroflows = post.topics.includes("microflows");
  const hasSecurity = post.topics.includes("security");
  const hasXpath = post.topics.includes("xpath");

  let ctaHref = "/practice";
  let ctaText = "Practice Questions";

  if (hasMicroflows) {
    ctaHref = "/study/microflows";
    ctaText = "Study Microflows";
  } else if (hasSecurity) {
    ctaHref = "/study/security";
    ctaText = "Study Security";
  } else if (hasXpath) {
    ctaHref = "/study/xpath";
    ctaText = "Study XPath";
  }

  return (
    <footer className="mt-12 pt-8 border-t border-border">
      {/* CTA */}
      <div className="bg-muted/50 rounded-lg p-6 mb-12 text-center">
        <h3 className="font-semibold text-lg mb-2">Ready to Test Your Knowledge?</h3>
        <p className="text-muted-foreground mb-4">
          Put what you learned into practice with our exam-style questions.
        </p>
        <Button size="lg" render={<Link href={ctaHref} />}>
          {ctaText}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 ? (
        <div>
          <h3 className="font-semibold text-xl mb-6">Related Articles</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
