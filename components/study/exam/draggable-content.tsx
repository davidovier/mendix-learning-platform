"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface DraggableContentProps {
  card: FlashcardData;
  isPlaced: boolean;
  isCorrect: boolean;
}

export function DraggableContent({
  card,
  isPlaced,
  isCorrect,
}: DraggableContentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `content-${card.id}`,
      data: { cardId: card.id },
      disabled: isCorrect,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Don't render in content column if placed on a title
  if (isPlaced) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-4 rounded-lg border bg-card transition-all max-h-48 overflow-y-auto",
        isDragging && "opacity-50 cursor-grabbing shadow-lg z-50",
        !isDragging && !isCorrect && "cursor-grab hover:border-primary",
        isCorrect && "cursor-default opacity-50"
      )}
    >
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{card.back}</p>
      {card.codeExample && (
        <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
          {card.codeExample}
        </pre>
      )}
    </div>
  );
}
