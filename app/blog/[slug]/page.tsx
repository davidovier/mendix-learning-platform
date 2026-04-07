// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts, getAllSlugs } from "@/lib/blog";
import { PostHeader } from "@/components/blog/post-header";
import { PostFooter } from "@/components/blog/post-footer";
import { JsonLd, articleSchema } from "@/lib/structured-data";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, ...post.topics],
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `${siteUrl}/blog/${slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <JsonLd
          data={articleSchema({
            title: post.title,
            description: post.description,
            date: post.date,
            url: `${siteUrl}/blog/${slug}`,
          })}
        />

        <PostHeader post={post} />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={post.content} />
        </div>

        <PostFooter post={post} relatedPosts={relatedPosts} />
      </div>
    </article>
  );
}
