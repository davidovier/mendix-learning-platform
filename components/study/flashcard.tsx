"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
  codeExample?: string;
}

export function Flashcard({ front, back, codeExample }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer min-h-[300px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden flex items-center justify-center p-8",
            isFlipped && "invisible"
          )}
        >
          <CardContent className="text-center">
            <h2 className="text-2xl font-semibold">{front}</h2>
            <p className="text-sm text-muted-foreground mt-4">
              Click to reveal answer
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className={cn(
            "absolute inset-0 backface-hidden rotate-y-180 p-8 overflow-auto",
            !isFlipped && "invisible"
          )}
        >
          <CardContent className="space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{back}</p>
            </div>
            {codeExample && (
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto font-mono">
                {codeExample}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
