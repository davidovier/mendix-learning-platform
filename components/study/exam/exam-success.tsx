"use client";

import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamSuccessProps {
  topicName: string;
  totalCards: number;
  onBackToTopics: () => void;
}

export function ExamSuccess({
  topicName,
  totalCards,
  onBackToTopics,
}: ExamSuccessProps) {
  return (
    <div className="text-center py-12 space-y-4">
      <Trophy className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-semibold">Exam Complete!</h2>
      <p className="text-muted-foreground">
        You matched all {totalCards} cards in {topicName}
      </p>
      <Button onClick={onBackToTopics}>Back to Topics</Button>
    </div>
  );
}
