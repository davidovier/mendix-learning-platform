"use client";

import { useState, useMemo, useCallback } from "react";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TitleDropZone } from "./title-drop-zone";
import { DraggableContent } from "./draggable-content";
import { ExamSuccess } from "./exam-success";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface ExamModeProps {
  cards: FlashcardData[];
  topicName: string;
  onComplete: () => void;
  onExit: () => void;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function ExamMode({
  cards,
  topicName,
  onComplete,
  onExit,
}: ExamModeProps) {
  // Select up to 10 random cards for the exam
  const examCards = useMemo(() => {
    const shuffled = shuffleArray(cards);
    return shuffled.slice(0, Math.min(10, cards.length));
  }, [cards]);

  // Shuffle content order separately
  const shuffledContentIds = useMemo(
    () => shuffleArray(examCards.map((c) => c.id)),
    [examCards]
  );

  // Track which content is placed on which title
  const [placements, setPlacements] = useState<Record<string, string | null>>(
    () => Object.fromEntries(examCards.map((c) => [c.id, null]))
  );

  // Track correct matches
  const [correctMatches, setCorrectMatches] = useState<string[]>([]);

  // Track incorrect flash animation
  const [incorrectFlash, setIncorrectFlash] = useState<string | null>(null);

  const matchedCount = correctMatches.length;
  const isComplete = matchedCount === examCards.length;

  // Get content cards that haven't been placed yet
  const unplacedContentIds = useMemo(() => {
    const placedIds = new Set(Object.values(placements).filter(Boolean));
    return shuffledContentIds.filter((id) => !placedIds.has(id));
  }, [shuffledContentIds, placements]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over) return;

      // Extract IDs from the draggable/droppable IDs
      const contentId = String(active.id).replace("content-", "");
      const titleId = String(over.id).replace("title-", "");

      // Check if this title already has a correct match
      if (correctMatches.includes(titleId)) return;

      // Check if the match is correct
      if (contentId === titleId) {
        // Correct match!
        setCorrectMatches((prev) => [...prev, titleId]);
        setPlacements((prev) => ({ ...prev, [titleId]: contentId }));
      } else {
        // Incorrect match - flash red
        setPlacements((prev) => ({ ...prev, [titleId]: contentId }));
        setIncorrectFlash(titleId);
        setTimeout(() => {
          setIncorrectFlash(null);
          // Remove the incorrect placement after flash
          setPlacements((prev) => ({ ...prev, [titleId]: null }));
        }, 500);
      }
    },
    [correctMatches]
  );

  const getCardById = useCallback(
    (id: string) => examCards.find((c) => c.id === id),
    [examCards]
  );

  if (isComplete) {
    return (
      <ExamSuccess
        topicName={topicName}
        totalCards={examCards.length}
        onBackToTopics={onComplete}
      />
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onExit}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Exit Exam
        </Button>
        <div className="text-sm font-medium">
          {matchedCount}/{examCards.length} matched
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold">{topicName} Exam</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Drag each content card to its matching title
        </p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column: Titles (drop zones) */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Titles
            </h2>
            <div className="space-y-3">
              {examCards.map((card) => (
                <TitleDropZone
                  key={card.id}
                  card={card}
                  isCorrect={correctMatches.includes(card.id)}
                  isIncorrectFlash={incorrectFlash === card.id}
                  placedContent={
                    placements[card.id]
                      ? getCardById(placements[card.id]!)
                      : null
                  }
                />
              ))}
            </div>
          </div>

          {/* Right column: Content (draggables) */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Content
            </h2>
            <div className="space-y-3">
              {unplacedContentIds.map((id) => {
                const card = getCardById(id);
                if (!card) return null;
                return (
                  <DraggableContent
                    key={card.id}
                    card={card}
                    isPlaced={false}
                    isCorrect={correctMatches.includes(card.id)}
                  />
                );
              })}
              {unplacedContentIds.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  All content cards have been placed!
                </p>
              )}
            </div>
          </div>
        </div>

        <DragOverlay />
      </DndContext>
    </div>
  );
}
