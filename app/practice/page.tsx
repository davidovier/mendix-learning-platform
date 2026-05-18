import type { Metadata } from "next";
import { topics } from "@/lib/content/topics";
import questions from "@/lib/content/questions.json";
import { PracticeClient, type Question, type TopicData } from "./practice-client";
import { getUsageStatus } from "@/lib/stripe/usage-actions";

export const metadata: Metadata = {
  title: "Practice Quiz - 455 Mendix Exam Questions",
  description:
    "Test your knowledge with 455 real exam-style questions. Free practice for Mendix Intermediate certification with instant feedback and progress tracking.",
  keywords: [
    "mendix practice test",
    "mendix quiz",
    "mendix exam questions",
    "mendix certification practice",
  ],
};

// Dynamic page - needs to check user-specific usage limits
export const dynamic = "force-dynamic";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const typedQuestions = questions as Question[];

  const questionCountByTopic: Record<string, number> = {};
  for (const q of typedQuestions) {
    questionCountByTopic[q.category] = (questionCountByTopic[q.category] || 0) + 1;
  }

  const topicData: TopicData[] = topics.map(({ id, name, description }) => ({
    id,
    name,
    description,
  }));

  const { topic: requestedTopic } = await searchParams;
  const initialTopicId =
    requestedTopic === "all" ||
    (requestedTopic && (questionCountByTopic[requestedTopic] ?? 0) > 0)
      ? requestedTopic
      : null;

  const usageStatus = await getUsageStatus();

  return (
    <PracticeClient
      questions={typedQuestions}
      topics={topicData}
      questionCountByTopic={questionCountByTopic}
      totalQuestionCount={typedQuestions.length}
      initialUsageStatus={usageStatus}
      initialTopicId={initialTopicId}
    />
  );
}
