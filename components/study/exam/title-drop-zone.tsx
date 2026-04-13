"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface ExamCard {
  id: string;
  title: string;
  summary: string;
}

interface TitleDropZoneProps {
  card: ExamCard;
  isCorrect: boolean;
  isIncorrectFlash: boolean;
  placedContent: ExamCard | null;
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
        "p-4 rounded-xl border-2 transition-all duration-200",
        isCorrect && "border-green-500 bg-green-500/10",
        isIncorrectFlash && "border-red-500 bg-red-500/10 animate-pulse",
        !isCorrect && !isIncorrectFlash && "border-border bg-card hover:border-muted-foreground/30",
        isOver && !isCorrect && "border-primary bg-primary/5 scale-[1.02]"
      )}
    >
      <h3 className="font-semibold text-foreground">{card.title}</h3>

      {placedContent && (
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            isCorrect ? "text-green-700 dark:text-green-400" : "text-muted-foreground"
          )}
        >
          {placedContent.summary}
        </p>
      )}
    </div>
  );
}
