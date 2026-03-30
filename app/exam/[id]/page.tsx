import questions from "@/lib/content/questions.json";
import { ExamClient, type Question } from "./exam-client";

const EXAM_QUESTIONS = 50;

interface PageProps {
  params: Promise<{ id: string }>;
}

// Server-side shuffle - only send 50 questions to client instead of 100KB+
function getShuffledQuestions(seed: string): Question[] {
  const allQuestions = questions as Question[];
  const shuffled = [...allQuestions];

  // Use the exam ID as a seed for consistent shuffling per exam
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Fisher-Yates shuffle with seeded random
  let currentIndex = shuffled.length;
  let seededRandom = Math.abs(hash);

  while (currentIndex !== 0) {
    seededRandom = (seededRandom * 1664525 + 1013904223) % 4294967296;
    const randomIndex = Math.floor((seededRandom / 4294967296) * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled.slice(0, EXAM_QUESTIONS);
}

export default async function ExamPage({ params }: PageProps) {
  const { id } = await params;

  // Pre-shuffle on server - client only receives 50 questions (~10KB instead of 100KB)
  const examQuestions = getShuffledQuestions(id);

  return <ExamClient examQuestions={examQuestions} />;
}
