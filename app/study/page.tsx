import { topics } from "@/lib/content/topics";
import { TopicCard } from "@/components/study/topic-card";
import flashcardsData from "@/lib/content/flashcards.json";

export default function StudyPage() {
  const flashcards = flashcardsData as Record<string, unknown[]>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Study Mode</h1>
        <p className="text-muted-foreground mt-2">
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
