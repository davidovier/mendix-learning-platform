"use client";

import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface ExamCard {
  id: string;
  title: string;
  summary: string;
}

interface DraggableContentProps {
  card: ExamCard;
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
        "px-4 py-3 rounded-xl border-2 bg-card transition-all",
        isDragging && "opacity-70 cursor-grabbing shadow-xl z-50 rotate-1 scale-105",
        !isDragging && !isCorrect && "cursor-grab hover:border-primary hover:shadow-md",
        isCorrect && "cursor-default opacity-50"
      )}
    >
      <p className="text-sm text-foreground leading-snug">{card.summary}</p>
    </div>
  );
}
