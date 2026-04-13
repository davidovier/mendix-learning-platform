"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Database,
  Workflow,
  Smartphone,
  Package,
  Shield,
  Layout,
  Search,
  Link,
  Code,
  Zap,
  List,
  Clock,
  Users,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Flashcard } from "@/components/study/flashcard";
import { FlashcardControls } from "@/components/study/flashcard-controls";
import { ExamMode } from "@/components/study/exam/exam-mode";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Icon mapping - client-side only (icons are not serializable from server)
const topicIcons: Record<string, LucideIcon> = {
  "domain-model": Database,
  "microflows": Workflow,
  "nanoflows": Smartphone,
  "modules": Package,
  "security": Shield,
  "pages": Layout,
  "xpath": Search,
  "integration": Link,
  "java": Code,
  "events": Zap,
  "enumerations": List,
  "scheduled-events": Clock,
  "agile": Users,
};

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface TopicStudyClientProps {
  topicId: string;
  topicName: string;
  cards: FlashcardData[];
}

export function TopicStudyClient({
  topicId,
  topicName,
  cards,
}: TopicStudyClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());
  const [showExam, setShowExam] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">No flashcards available</h1>
        <p className="text-muted-foreground mt-2">
          This topic doesn&apos;t have any flashcards yet.
        </p>
        <Button className="mt-4" onClick={() => router.push("/study")}>
          Back to Topics
        </Button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const masteredCount = masteredCards.size;
  const progress = (masteredCount / cards.length) * 100;

  const handleGotIt = () => {
    setMasteredCards((prev) => new Set(prev).add(currentIndex));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReviewAgain = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isComplete = masteredCount === cards.length;
  const Icon = topicIcons[topicId] || BookOpen;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/study")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">{topicName}</h1>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}% mastered</span>
        </div>
        <Progress value={progress} />
      </div>

      {isComplete && !showExam ? (
        <div className="text-center py-12 space-y-4">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Topic Complete!</h2>
          <p className="text-muted-foreground">
            You&apos;ve mastered all {cards.length} cards in {topicName}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/study")}>
              Back to Topics
            </Button>
            {cards.length >= 2 && (
              <Button onClick={() => setShowExam(true)}>
                Take Exam
              </Button>
            )}
          </div>
        </div>
      ) : showExam ? (
        <ExamMode
          cards={cards}
          topicName={topicName}
          onComplete={() => router.push("/study")}
          onExit={() => setShowExam(false)}
        />
      ) : (
        <>
          <Flashcard
            key={currentIndex}
            front={currentCard.front}
            back={currentCard.back}
            codeExample={currentCard.codeExample}
          />
          <FlashcardControls
            onGotIt={handleGotIt}
            onReviewAgain={handleReviewAgain}
            currentIndex={currentIndex}
            totalCards={cards.length}
          />
        </>
      )}
    </div>
  );
}
