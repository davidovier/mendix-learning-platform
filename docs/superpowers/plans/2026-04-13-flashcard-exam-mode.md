# Flashcard Exam Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a drag-and-drop matching exam that appears after mastering all flashcards in a topic, where users match flashcard titles with their content.

**Architecture:** Extend `TopicStudyClient` with a new `showExam` state. When triggered, render `ExamMode` component which uses @dnd-kit for drag-and-drop. Content cards are draggable, title cards are drop zones. Matches are validated on drop with visual feedback.

**Tech Stack:** @dnd-kit/core, React 19, Tailwind CSS 4, existing UI components

---

## File Structure

```
components/study/
├── exam/
│   ├── exam-mode.tsx          # Main exam container with DnD context
│   ├── title-drop-zone.tsx    # Individual title card (drop target)
│   ├── draggable-content.tsx  # Draggable content card
│   └── exam-success.tsx       # Success screen after completion
├── flashcard.tsx              # (existing, no changes)
├── flashcard-controls.tsx     # (existing, no changes)
└── topic-card.tsx             # (existing, no changes)

app/study/[topic]/
└── topic-study-client.tsx     # (modify to add exam mode state)
```

---

## Task 1: Install @dnd-kit dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @dnd-kit/core**

```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep
npm install @dnd-kit/core
```

- [ ] **Step 2: Verify installation**

```bash
cat package.json | grep dnd-kit
```

Expected output: `"@dnd-kit/core": "^6.x.x"`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @dnd-kit/core for drag-and-drop exam mode"
```

---

## Task 2: Create ExamSuccess component

**Files:**
- Create: `components/study/exam/exam-success.tsx`

- [ ] **Step 1: Create the exam directory**

```bash
mkdir -p /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/components/study/exam
```

- [ ] **Step 2: Create ExamSuccess component**

Create `components/study/exam/exam-success.tsx`:

```tsx
"use client";

import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamSuccessProps {
  topicName: string;
  totalCards: number;
  onBackToTopics: () => void;
}

export function ExamSuccess({
  topicName,
  totalCards,
  onBackToTopics,
}: ExamSuccessProps) {
  return (
    <div className="text-center py-12 space-y-4">
      <Trophy className="h-16 w-16 text-green-500 mx-auto" />
      <h2 className="text-2xl font-semibold">Exam Complete!</h2>
      <p className="text-muted-foreground">
        You matched all {totalCards} cards in {topicName}
      </p>
      <Button onClick={onBackToTopics}>Back to Topics</Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify file exists**

```bash
cat /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/components/study/exam/exam-success.tsx
```

- [ ] **Step 4: Commit**

```bash
git add components/study/exam/exam-success.tsx
git commit -m "feat: add ExamSuccess component for exam completion"
```

---

## Task 3: Create TitleDropZone component

**Files:**
- Create: `components/study/exam/title-drop-zone.tsx`

- [ ] **Step 1: Create TitleDropZone component**

Create `components/study/exam/title-drop-zone.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify file exists**

```bash
head -20 /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/components/study/exam/title-drop-zone.tsx
```

- [ ] **Step 3: Commit**

```bash
git add components/study/exam/title-drop-zone.tsx
git commit -m "feat: add TitleDropZone component for exam drop targets"
```

---

## Task 4: Create DraggableContent component

**Files:**
- Create: `components/study/exam/draggable-content.tsx`

- [ ] **Step 1: Create DraggableContent component**

Create `components/study/exam/draggable-content.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify file exists**

```bash
head -20 /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/components/study/exam/draggable-content.tsx
```

- [ ] **Step 3: Commit**

```bash
git add components/study/exam/draggable-content.tsx
git commit -m "feat: add DraggableContent component for exam draggables"
```

---

## Task 5: Create ExamMode component

**Files:**
- Create: `components/study/exam/exam-mode.tsx`

- [ ] **Step 1: Create ExamMode component**

Create `components/study/exam/exam-mode.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify file exists and check for syntax errors**

```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npx tsc --noEmit components/study/exam/exam-mode.tsx 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add components/study/exam/exam-mode.tsx
git commit -m "feat: add ExamMode component with drag-and-drop matching"
```

---

## Task 6: Update TopicStudyClient to integrate exam mode

**Files:**
- Modify: `app/study/[topic]/topic-study-client.tsx`

- [ ] **Step 1: Add exam mode state and import**

At the top of `topic-study-client.tsx`, add the import:

```tsx
import { ExamMode } from "@/components/study/exam/exam-mode";
```

- [ ] **Step 2: Add showExam state**

Inside the `TopicStudyClient` component, after the existing state declarations, add:

```tsx
const [showExam, setShowExam] = useState(false);
```

- [ ] **Step 3: Update the completion screen**

Replace the existing completion screen (the `isComplete` conditional block) with:

```tsx
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
```

- [ ] **Step 4: Verify the changes compile**

```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | tail -20
```

- [ ] **Step 5: Commit**

```bash
git add app/study/[topic]/topic-study-client.tsx
git commit -m "feat: integrate exam mode into topic study page"
```

---

## Task 7: Manual testing and verification

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run dev
```

- [ ] **Step 2: Test the happy path**

1. Open http://localhost:3000/study
2. Select a topic with at least 2 flashcards (e.g., "Domain Model")
3. Click "Got It!" on all flashcards until 100% complete
4. Verify the completion screen shows "Take Exam" button
5. Click "Take Exam"
6. Verify the exam mode shows titles on left, shuffled content on right
7. Drag a content card to its correct title
8. Verify it turns green and locks
9. Drag a content card to an incorrect title
10. Verify it flashes red and returns
11. Complete all matches
12. Verify success screen appears

- [ ] **Step 3: Test edge cases**

1. Test "Exit Exam" button returns to completion screen
2. Test responsive layout on mobile viewport
3. Test with a topic that has <2 cards (exam button should not appear)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: address issues found during manual testing"
```

---

## Task 8: Final cleanup and documentation

- [ ] **Step 1: Run linter**

```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run lint
```

- [ ] **Step 2: Fix any lint errors**

Address any ESLint errors that appear.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: lint fixes for exam mode feature"
```

---

## Summary

After completing all tasks, the flashcard exam mode feature will be fully implemented:

1. **@dnd-kit/core** installed for drag-and-drop
2. **ExamSuccess** component shows completion message
3. **TitleDropZone** component acts as drop targets
4. **DraggableContent** component provides draggable cards
5. **ExamMode** orchestrates the exam with state management
6. **TopicStudyClient** updated to show exam after completion

The feature triggers from the completion screen, shows max 10 randomly selected cards, validates matches with visual feedback, and returns users to the topics list on completion.
