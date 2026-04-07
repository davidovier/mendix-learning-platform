// app/study/[topic]/layout.tsx
import type { Metadata } from "next";
import { getTopicById, topics } from "@/lib/content/topics";

interface LayoutProps {
  params: Promise<{ topic: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    return {
      title: "Topic Not Found",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  return {
    title: `${topic.name} - Mendix Study Guide`,
    description: `Learn ${topic.name} for Mendix Intermediate Certification. ${topic.description}. Interactive flashcards with AI explanations.`,
    keywords: [
      `mendix ${topic.name.toLowerCase()}`,
      `mendix ${topicId}`,
      "mendix certification",
      "mendix study guide",
    ],
    alternates: {
      canonical: `${siteUrl}/study/${topicId}`,
    },
  };
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    topic: topic.id,
  }));
}

export default function TopicLayout({ children }: LayoutProps) {
  return children;
}
