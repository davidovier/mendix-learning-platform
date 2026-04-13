"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface TitleDropZoneProps {
  card: FlashcardData;
  isCorrect: boolean;
  isIncorrectFlash: boolean;
  placedContent: FlashcardData | null;
}

export function TitleDropZone({
  card,
  isCorrect,
  isIncorrectFlash,
  placedContent,
}: TitleDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `title-${card.id}`,
    data: { cardId: card.id },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-4 rounded-lg border-2 transition-all duration-200 min-h-[80px]",
        isCorrect && "border-green-500 bg-green-500/10",
        isIncorrectFlash && "border-red-500 bg-red-500/10 animate-pulse",
        !isCorrect && !isIncorrectFlash && "border-border bg-card",
        isOver && !isCorrect && "border-primary bg-primary/5"
      )}
    >
      <h3 className="font-semibold text-foreground">{card.front}</h3>

      {placedContent && (
        <div
          className={cn(
            "mt-3 p-3 rounded border text-sm max-h-32 overflow-y-auto",
            isCorrect
              ? "border-green-500/50 bg-green-500/5 text-muted-foreground"
              : "border-muted bg-muted/50 text-muted-foreground"
          )}
        >
          <p className="whitespace-pre-wrap">{placedContent.back}</p>
        </div>
      )}

      {!placedContent && !isCorrect && (
        <p className="text-sm text-muted-foreground mt-2">Drop matching content here</p>
      )}
    </div>
  );
}
