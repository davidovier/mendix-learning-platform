"use client";

import { Button } from "@/components/ui/button";

interface FlashcardControlsProps {
  onGotIt: () => void;
  onReviewAgain: () => void;
  currentIndex: number;
  totalCards: number;
}

export function FlashcardControls({
  onGotIt,
  onReviewAgain,
  currentIndex,
  totalCards,
}: FlashcardControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="text-sm text-muted-foreground">
        Card {currentIndex + 1} of {totalCards}
      </div>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onReviewAgain}
          className="min-w-[140px]"
        >
          Review Again
        </Button>
        <Button
          size="lg"
          onClick={onGotIt}
          className="min-w-[140px]"
        >
          Got It!
        </Button>
      </div>
    </div>
  );
}
