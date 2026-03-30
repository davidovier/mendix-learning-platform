"use client";

import { cn } from "@/lib/utils";

interface AnswerOptionProps {
  index: number;
  text: string;
  selected: boolean;
  correct?: boolean;
  showResult: boolean;
  onClick: () => void;
}

// Bug fix #18: Support more than 4 answer options
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function AnswerOption({
  index,
  text,
  selected,
  correct,
  showResult,
  onClick,
}: AnswerOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={showResult}
      className={cn(
        "w-full p-4 rounded-lg border text-left transition-all",
        "hover:border-primary hover:bg-primary/5",
        selected && !showResult && "border-primary bg-primary/10",
        showResult && selected && correct && "border-green-500 bg-green-50",
        showResult && selected && !correct && "border-red-500 bg-red-50",
        showResult && !selected && correct && "border-green-500 bg-green-50/50",
        showResult && "cursor-default"
      )}
    >
      <div className="flex gap-3">
        <span
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            selected ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {letters[index]}
        </span>
        <span className="flex-1">{text}</span>
        {showResult && correct && <span className="text-green-600">✓</span>}
        {showResult && selected && !correct && <span className="text-red-600">✗</span>}
      </div>
    </button>
  );
}
