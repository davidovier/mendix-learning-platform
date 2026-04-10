import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content/topics";
import { parseStudySections } from "@/lib/content/parse-study-sections";
import { TopicStudyClient } from "./topic-study-client";
import flashcardsData from "@/lib/content/flashcards.json";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface PageProps {
  params: Promise<{ topic: string }>;
}

export default async function TopicStudyPage({ params }: PageProps) {
  const { topic: topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  const allFlashcards = flashcardsData as Record<string, FlashcardData[]>;
  const cards = allFlashcards[topicId] ?? [];

  // Parse study guide sections from documentation
  const studySections = await parseStudySections(topic.sourceFile);

  return (
    <TopicStudyClient
      topic={topic}
      cards={cards}
      studySections={studySections}
    />
  );
}
