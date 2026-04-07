import type { Metadata } from "next";
import { topics } from "@/lib/content/topics";
import { TopicCard } from "@/components/study/topic-card";
import flashcardsData from "@/lib/content/flashcards.json";
import { JsonLd, courseSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Study Guide - Mendix Intermediate Certification Topics",
  description:
    "Master all 6 exam topics with interactive flashcards and AI explanations. Free Mendix study guide covering domain models, microflows, security, XPath, and more.",
  keywords: [
    "mendix study guide",
    "mendix topics",
    "mendix flashcards",
    "mendix intermediate certification",
  ],
};

// Cache this page for 1 hour since topic list rarely changes
export const revalidate = 3600;

export default function StudyPage() {
  const flashcards = flashcardsData as Record<string, unknown[]>;

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={courseSchema()} />
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">
          Study Mode
        </h1>
        <p className="text-muted-foreground">
          Choose a topic to study with interactive flashcards
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            flashcardCount={flashcards[topic.id]?.length ?? 0}
            progress={0}
          />
        ))}
      </div>
    </div>
  );
}
