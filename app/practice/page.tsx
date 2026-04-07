import type { Metadata } from "next";
import { topics } from "@/lib/content/topics";
import questions from "@/lib/content/questions.json";
import { PracticeClient, type Question, type TopicData } from "./practice-client";
import { getUsageStatus } from "@/lib/stripe/usage-actions";

export const metadata: Metadata = {
  title: "Practice Quiz - 268 Mendix Exam Questions",
  description:
    "Test your knowledge with 268 real exam-style questions. Free practice for Mendix Intermediate certification with instant feedback and progress tracking.",
  keywords: [
    "mendix practice test",
    "mendix quiz",
    "mendix exam questions",
    "mendix certification practice",
  ],
};

// Dynamic page - needs to check user-specific usage limits
export const dynamic = "force-dynamic";

export default async function PracticePage() {
  // Server-side: compute counts and prepare data
  const typedQuestions = questions as Question[];

  // Compute question counts per topic (done server-side, not bundled to client)
  const questionCountByTopic: Record<string, number> = {};
  for (const q of typedQuestions) {
    questionCountByTopic[q.category] = (questionCountByTopic[q.category] || 0) + 1;
  }

  // Extract only serializable topic data (no icon functions)
  const topicData: TopicData[] = topics.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));

  // Get user's usage status (null if not logged in)
  const usageStatus = await getUsageStatus();

  return (
    <PracticeClient
      questions={typedQuestions}
      topics={topicData}
      questionCountByTopic={questionCountByTopic}
      totalQuestionCount={typedQuestions.length}
      initialUsageStatus={usageStatus}
    />
  );
}
