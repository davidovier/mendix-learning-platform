import { topics } from "@/lib/content/topics";
import questions from "@/lib/content/questions.json";
import { PracticeClient, type Question } from "./practice-client";

// Cache this page - questions don't change often
export const revalidate = 3600;

export default function PracticePage() {
  // Server-side: compute counts and prepare data
  const typedQuestions = questions as Question[];

  // Compute question counts per topic (done server-side, not bundled to client)
  const questionCountByTopic: Record<string, number> = {};
  for (const q of typedQuestions) {
    questionCountByTopic[q.category] = (questionCountByTopic[q.category] || 0) + 1;
  }

  return (
    <PracticeClient
      questions={typedQuestions}
      topics={topics}
      questionCountByTopic={questionCountByTopic}
      totalQuestionCount={typedQuestions.length}
    />
  );
}
