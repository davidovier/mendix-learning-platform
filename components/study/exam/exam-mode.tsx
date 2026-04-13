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

// Extract a clean, short summary from flashcard content
function getCleanSummary(text: string): string {
  // Remove markdown links [text](url) -> text
  let clean = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  // Remove markdown tables
  clean = clean.replace(/\|[^\n]+\|/g, "");
  // Remove table separators
  clean = clean.replace(/\|[-:]+\|/g, "");
  // Remove bold markers
  clean = clean.replace(/\*\*([^*]+)\*\*/g, "$1");
  // Remove list markers
  clean = clean.replace(/^[-*]\s+/gm, "");
  // Remove numbered list markers
  clean = clean.replace(/^\d+\.\s+/gm, "");
  // Remove horizontal rules
  clean = clean.replace(/^---+$/gm, "");
  // Remove "Important:" prefix
  clean = clean.replace(/^Important:\s*/i, "");
  // Remove standalone URLs
  clean = clean.replace(/https?:\/\/[^\s]+/g, "");
  // Collapse multiple newlines
  clean = clean.replace(/\n{2,}/g, " ");
  // Collapse multiple spaces
  clean = clean.replace(/\s{2,}/g, " ");
  // Trim
  clean = clean.trim();

  // Get first 1-2 sentences (up to ~150 chars)
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(s => s.length > 10);
  let summary = sentences[0] || clean;

  // Add second sentence if first is short
  if (summary.length < 80 && sentences[1]) {
    summary += " " + sentences[1];
  }

  // Truncate if still too long
  if (summary.length > 180) {
    summary = summary.slice(0, 177) + "...";
  }

  return summary;
}

interface ExamCard {
  id: string;
  title: string;
  summary: string;
}

export function ExamMode({
  cards,
  topicName,
  onComplete,
  onExit,
}: ExamModeProps) {
  // Select up to 10 random cards and create clean exam cards
  // Filter out cards with empty or too short summaries
  const examCards = useMemo((): ExamCard[] => {
    const shuffled = shuffleArray(cards);
    const validCards: ExamCard[] = [];

    for (const card of shuffled) {
      if (validCards.length >= 10) break;

      const summary = getCleanSummary(card.back);
      // Only include cards with meaningful summaries (at least 20 chars)
      if (summary.length >= 20) {
        validCards.push({
          id: card.id,
          title: card.front,
          summary,
        });
      }
    }

    return validCards;
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
    (id: string): ExamCard | null => examCards.find((c) => c.id === id) ?? null,
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

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{topicName} Exam</h1>
        <p className="text-muted-foreground mt-2">
          Drag descriptions from the right and drop them on matching concepts
        </p>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Titles (drop zones) */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Concepts
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
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Descriptions
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
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">All descriptions matched!</p>
                  <p className="text-xs mt-1">Check your answers above</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DragOverlay />
      </DndContext>
    </div>
  );
}
