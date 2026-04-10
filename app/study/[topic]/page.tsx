import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content/topics";
import { TopicStudyClient } from "./topic-study-client";
import flashcardsData from "@/lib/content/flashcards.json";
import studySectionsData from "@/lib/content/study-sections.json";

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

  // Get pre-generated study sections
  interface StudySection {
    title: string;
    content: string;
  }
  const allStudySections = studySectionsData as Record<string, StudySection[]>;
  const studySections = allStudySections[topicId] ?? [];

  return (
    <TopicStudyClient
      topic={topic}
      cards={cards}
      studySections={studySections}
    />
  );
}
