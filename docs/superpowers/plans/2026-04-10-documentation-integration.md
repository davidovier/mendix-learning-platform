# Documentation Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate 35 documentation files into the app: updated cheatsheet, study guide accordions, exam-pattern flashcards, and enhanced question explanations.

**Architecture:** Server components read markdown at request time, parse into sections, pass to client components. Build scripts generate enhanced flashcards and explanations from exam Q&A files.

**Tech Stack:** Next.js App Router, shadcn Accordion (base-ui), LazyMarkdown for rendering, TypeScript scripts with tsx runner.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `lib/content/docs/cheatsheet.md` | Cheatsheet content (replaced) |
| `app/study/[topic]/page.tsx` | Server component - reads markdown, passes to client |
| `app/study/[topic]/topic-study-client.tsx` | Client component - flashcards + accordion state |
| `components/study/study-guide-accordion.tsx` | Renders markdown sections as accordions |
| `scripts/generate-exam-flashcards.ts` | Parses exam Q&A → flashcards |
| `scripts/enhance-explanations.ts` | Parses exam Q&A → enriches questions |
| `lib/content/flashcards.json` | Flashcard data (appended) |
| `lib/content/questions.json` | Question data (enhanced) |
| `components/practice/question-card.tsx` | Shows detailedExplanation if present |

---

## Task 1: Update Cheatsheet

**Files:**
- Replace: `lib/content/docs/cheatsheet.md`

- [ ] **Step 1: Copy new cheatsheet content**

```bash
cp documentation/20-quick-reference-cheatsheet.md lib/content/docs/cheatsheet.md
```

- [ ] **Step 2: Verify the page renders**

```bash
npm run dev
# Open http://localhost:3000/cheatsheet
# Verify new content appears (should see "Top 10 Most Tested Topics" section)
```

- [ ] **Step 3: Commit**

```bash
git add lib/content/docs/cheatsheet.md
git commit -m "content: update cheatsheet with comprehensive exam reference"
```

---

## Task 2: Create StudyGuideAccordion Component

**Files:**
- Create: `components/study/study-guide-accordion.tsx`

- [ ] **Step 1: Create the component file**

```tsx
"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LazyMarkdown } from "@/components/lazy/lazy-markdown";

export interface StudySection {
  title: string;
  content: string;
}

interface StudyGuideAccordionProps {
  sections: StudySection[];
}

export function StudyGuideAccordion({ sections }: StudyGuideAccordionProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Study Guide</h2>
      <Accordion className="border rounded-lg divide-y">
        {sections.map((section, index) => (
          <AccordionItem key={index} className="px-4">
            <AccordionTrigger className="py-3">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <LazyMarkdown>{section.content}</LazyMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add components/study/study-guide-accordion.tsx
git commit -m "feat: add StudyGuideAccordion component for topic study pages"
```

---

## Task 3: Create Topic Study Client Component

**Files:**
- Create: `app/study/[topic]/topic-study-client.tsx`

- [ ] **Step 1: Create the client component (extracted from current page.tsx)**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { Flashcard } from "@/components/study/flashcard";
import { FlashcardControls } from "@/components/study/flashcard-controls";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  StudyGuideAccordion,
  type StudySection,
} from "@/components/study/study-guide-accordion";
import type { Topic } from "@/lib/content/topics";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface TopicStudyClientProps {
  topic: Topic;
  cards: FlashcardData[];
  studySections: StudySection[];
}

export function TopicStudyClient({
  topic,
  cards,
  studySections,
}: TopicStudyClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">No flashcards available</h1>
        <p className="text-muted-foreground mt-2">
          This topic doesn&apos;t have any flashcards yet.
        </p>
        <Button className="mt-4" onClick={() => router.push("/study")}>
          Back to Topics
        </Button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const masteredCount = masteredCards.size;
  const progress = (masteredCount / cards.length) * 100;

  const handleGotIt = () => {
    setMasteredCards((prev) => new Set(prev).add(currentIndex));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleReviewAgain = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isComplete = masteredCount === cards.length;
  const Icon = topic.icon;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/study")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">{topic.name}</h1>
        </div>
      </div>

      {/* Study Guide Accordion */}
      <StudyGuideAccordion sections={studySections} />

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}% mastered</span>
        </div>
        <Progress value={progress} />
      </div>

      {isComplete ? (
        <div className="text-center py-12 space-y-4">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-2xl font-semibold">Topic Complete</h2>
          <p className="text-muted-foreground">
            You&apos;ve mastered all {cards.length} cards in {topic.name}
          </p>
          <Button onClick={() => router.push("/study")}>
            Study Another Topic
          </Button>
        </div>
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
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add app/study/[topic]/topic-study-client.tsx
git commit -m "feat: extract TopicStudyClient component with study guide support"
```

---

## Task 4: Refactor Study Topic Page to Server Component

**Files:**
- Modify: `app/study/[topic]/page.tsx`

- [ ] **Step 1: Create markdown parsing utility**

Create `lib/content/parse-study-sections.ts`:

```typescript
import { promises as fs } from "fs";
import path from "path";

export interface StudySection {
  title: string;
  content: string;
}

export async function parseStudySections(
  sourceFile: string
): Promise<StudySection[]> {
  if (!sourceFile) {
    return [];
  }

  const filePath = path.join(process.cwd(), "documentation", sourceFile);

  try {
    const markdown = await fs.readFile(filePath, "utf-8");
    const sections = markdown.split(/^## /gm);

    return sections.slice(1).map((section) => {
      const [title, ...content] = section.split("\n");
      return {
        title: title.trim(),
        content: content.join("\n").trim(),
      };
    });
  } catch {
    // File doesn't exist or can't be read
    return [];
  }
}
```

- [ ] **Step 2: Rewrite page.tsx as server component**

Replace `app/study/[topic]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { getTopicById } from "@/lib/content/topics";
import { parseStudySections } from "@/lib/content/parse-study-sections";
import { TopicStudyClient } from "./topic-study-client";
import flashcardsData from "@/lib/content/flashcards.json";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  codeExample?: string;
}

interface PageProps {
  params: Promise<{ topic: string }>;
}

export default async function TopicStudyPage({ params }: PageProps) {
  const { topic: topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    notFound();
  }

  const allFlashcards = flashcardsData as Record<string, FlashcardData[]>;
  const cards = allFlashcards[topicId] ?? [];

  // Parse study guide sections from documentation
  const studySections = await parseStudySections(topic.sourceFile);

  return (
    <TopicStudyClient
      topic={topic}
      cards={cards}
      studySections={studySections}
    />
  );
}
```

- [ ] **Step 3: Verify the page works**

```bash
npm run dev
# Open http://localhost:3000/study/domain-model
# Should see Study Guide accordion above flashcards
# Expand a section - markdown should render
```

- [ ] **Step 4: Commit**

```bash
git add lib/content/parse-study-sections.ts app/study/[topic]/page.tsx
git commit -m "feat: add study guide accordions to topic study pages"
```

---

## Task 5: Create Exam Flashcards Generator Script

**Files:**
- Create: `scripts/generate-exam-flashcards.ts`

- [ ] **Step 1: Create the script**

```typescript
import { promises as fs } from "fs";
import path from "path";
import { topics } from "../lib/content/topics";

interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  tags: string[];
}

interface ExistingFlashcards {
  [topicId: string]: Flashcard[];
}

async function parseExamQuestions(
  filePath: string,
  topicId: string
): Promise<Flashcard[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const flashcards: Flashcard[] = [];

  // Match "### Exam Question:" or "### Exam Question Pattern:" sections
  const questionPattern =
    /### Exam Question(?:\s+Pattern)?:\s*\n>\s*"([^"]+)"\s*\n\s*\*\*Answer\*\*:\s*([^\n]+(?:\n(?!\n|###)[^\n]*)*)/g;

  let match;
  let index = 0;

  while ((match = questionPattern.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();

    flashcards.push({
      id: `${topicId}-exam-${index}`,
      topicId,
      front: question,
      back: answer,
      tags: [topicId, "exam-pattern"],
    });
    index++;
  }

  return flashcards;
}

async function main() {
  const flashcardsPath = path.join(
    process.cwd(),
    "lib",
    "content",
    "flashcards.json"
  );

  // Read existing flashcards
  const existingContent = await fs.readFile(flashcardsPath, "utf-8");
  const existingFlashcards: ExistingFlashcards = JSON.parse(existingContent);

  // Track new cards added
  let totalNew = 0;

  for (const topic of topics) {
    if (topic.questionFiles.length === 0) continue;

    const topicCards = existingFlashcards[topic.id] || [];
    const existingFronts = new Set(topicCards.map((c) => c.front.toLowerCase()));

    for (const questionFile of topic.questionFiles) {
      const filePath = path.join(process.cwd(), "documentation", questionFile);

      try {
        const newCards = await parseExamQuestions(filePath, topic.id);

        for (const card of newCards) {
          // Dedupe by question text
          if (!existingFronts.has(card.front.toLowerCase())) {
            topicCards.push(card);
            existingFronts.add(card.front.toLowerCase());
            totalNew++;
          }
        }
      } catch (err) {
        console.warn(`Could not read ${questionFile}: ${err}`);
      }
    }

    existingFlashcards[topic.id] = topicCards;
  }

  // Write updated flashcards
  await fs.writeFile(
    flashcardsPath,
    JSON.stringify(existingFlashcards, null, 2)
  );

  console.log(`Added ${totalNew} new exam-pattern flashcards`);
}

main().catch(console.error);
```

- [ ] **Step 2: Run the script**

```bash
npx tsx scripts/generate-exam-flashcards.ts
```

Expected output: `Added X new exam-pattern flashcards`

- [ ] **Step 3: Verify flashcards were added**

```bash
grep -c "exam-pattern" lib/content/flashcards.json
```

Expected: Number > 0

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-exam-flashcards.ts lib/content/flashcards.json
git commit -m "feat: generate exam-pattern flashcards from Q&A documentation"
```

---

## Task 6: Create Question Explanation Enhancer Script

**Files:**
- Create: `scripts/enhance-explanations.ts`

- [ ] **Step 1: Create the script**

```typescript
import { promises as fs } from "fs";
import path from "path";
import { topics } from "../lib/content/topics";

interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  detailedExplanation?: string;
}

interface ExamQA {
  question: string;
  answer: string;
  context?: string;
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, "").trim();
}

function wordOverlap(text1: string, text2: string): number {
  const words1 = new Set(normalizeText(text1).split(/\s+/));
  const words2 = new Set(normalizeText(text2).split(/\s+/));

  let matches = 0;
  for (const word of words1) {
    if (words2.has(word)) matches++;
  }

  return matches / Math.max(words1.size, 1);
}

async function parseExamQAContent(filePath: string): Promise<ExamQA[]> {
  const content = await fs.readFile(filePath, "utf-8");
  const qaList: ExamQA[] = [];

  // Match exam questions with their answers and surrounding context
  const sections = content.split(/^## /gm);

  for (const section of sections) {
    // Find all exam questions in this section
    const questionPattern =
      /### Exam Question(?:\s+Pattern)?:\s*\n>\s*"([^"]+)"\s*\n\s*\*\*Answer\*\*:\s*([^\n]+(?:\n(?!\n|###)[^\n]*)*)/g;

    let match;
    while ((match = questionPattern.exec(section)) !== null) {
      const question = match[1].trim();
      const answer = match[2].trim();

      // Get context from "Key Facts to Memorize" tables in this section
      const tableMatch = section.match(
        /Key Facts to Memorize[:\s]*\n([\s\S]*?)(?=\n##|\n###|$)/i
      );
      const context = tableMatch ? tableMatch[1].trim() : undefined;

      qaList.push({ question, answer, context });
    }
  }

  return qaList;
}

async function main() {
  const questionsPath = path.join(
    process.cwd(),
    "lib",
    "content",
    "questions.json"
  );

  // Read existing questions
  const questionsContent = await fs.readFile(questionsPath, "utf-8");
  const questions: Question[] = JSON.parse(questionsContent);

  // Collect all exam Q&A from documentation
  const allExamQA: ExamQA[] = [];

  for (const topic of topics) {
    for (const questionFile of topic.questionFiles) {
      const filePath = path.join(process.cwd(), "documentation", questionFile);

      try {
        const qaList = await parseExamQAContent(filePath);
        allExamQA.push(...qaList);
      } catch (err) {
        console.warn(`Could not read ${questionFile}: ${err}`);
      }
    }
  }

  console.log(`Found ${allExamQA.length} exam Q&A entries in documentation`);

  // Match and enhance
  let enhanced = 0;
  const unmatched: string[] = [];

  for (const question of questions) {
    // Skip if already has detailed explanation
    if (question.detailedExplanation) continue;

    // Find best matching exam Q&A
    let bestMatch: ExamQA | null = null;
    let bestScore = 0;

    for (const qa of allExamQA) {
      const score = wordOverlap(question.question, qa.question);
      if (score > bestScore && score >= 0.8) {
        bestScore = score;
        bestMatch = qa;
      }
    }

    if (bestMatch) {
      // Build detailed explanation from answer + context
      let detailed = bestMatch.answer;
      if (bestMatch.context) {
        detailed += "\n\n" + bestMatch.context;
      }
      question.detailedExplanation = detailed;
      enhanced++;
    } else {
      unmatched.push(question.question.substring(0, 60) + "...");
    }
  }

  // Write updated questions
  await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2));

  console.log(`Enhanced ${enhanced} questions with detailed explanations`);
  console.log(`${unmatched.length} questions could not be matched`);

  if (unmatched.length > 0 && unmatched.length <= 20) {
    console.log("\nUnmatched questions:");
    unmatched.forEach((q) => console.log(`  - ${q}`));
  }
}

main().catch(console.error);
```

- [ ] **Step 2: Run the script**

```bash
npx tsx scripts/enhance-explanations.ts
```

Expected output shows enhanced count and unmatched count

- [ ] **Step 3: Verify enhancements**

```bash
grep -c "detailedExplanation" lib/content/questions.json
```

Expected: Number > 0

- [ ] **Step 4: Commit**

```bash
git add scripts/enhance-explanations.ts lib/content/questions.json
git commit -m "feat: enhance question explanations from exam Q&A documentation"
```

---

## Task 7: Update QuestionCard to Show Detailed Explanations

**Files:**
- Modify: `components/practice/question-card.tsx`

- [ ] **Step 1: Update the Question interface**

In `components/practice/question-card.tsx`, update the interface:

```typescript
interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  detailedExplanation?: string;
}
```

- [ ] **Step 2: Update explanation display logic**

Find this line (around line 114-119):

```typescript
            {question.explanation && (
              <div className="flex gap-2 text-sm">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-emerald-800 dark:text-emerald-200">
                  {question.explanation}
                </p>
              </div>
            )}
```

Replace with:

```typescript
            {(question.detailedExplanation || question.explanation) && (
              <div className="flex gap-2 text-sm">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-emerald-800 dark:text-emerald-200 whitespace-pre-line">
                  {question.detailedExplanation || question.explanation}
                </p>
              </div>
            )}
```

- [ ] **Step 3: Verify the change works**

```bash
npm run dev
# Open http://localhost:3000/practice
# Select a topic and answer a question
# Check that explanation appears (may be longer if detailedExplanation exists)
```

- [ ] **Step 4: Commit**

```bash
git add components/practice/question-card.tsx
git commit -m "feat: show detailed explanations in question cards when available"
```

---

## Task 8: Final Verification

- [ ] **Step 1: Run type check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Run linter**

```bash
npm run lint
```

Expected: No errors (or only pre-existing warnings)

- [ ] **Step 3: Test all features**

```bash
npm run dev
```

Manual verification checklist:
- [ ] `/cheatsheet` - Shows new content with "Top 10 Most Tested Topics"
- [ ] `/study/domain-model` - Study Guide accordion appears above flashcards
- [ ] `/study/domain-model` - Accordion sections expand and show markdown content
- [ ] `/study/agile` - No Study Guide section (topic has no sourceFile)
- [ ] `/study/domain-model` - New exam-pattern flashcards appear in deck
- [ ] `/practice` - Answer a question, see enhanced explanation

- [ ] **Step 4: Final commit**

```bash
git add -A
git status
# If there are any uncommitted changes, commit them
git commit -m "chore: final cleanup for documentation integration"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Update cheatsheet | `lib/content/docs/cheatsheet.md` |
| 2 | Create StudyGuideAccordion | `components/study/study-guide-accordion.tsx` |
| 3 | Create TopicStudyClient | `app/study/[topic]/topic-study-client.tsx` |
| 4 | Refactor study page to server | `app/study/[topic]/page.tsx`, `lib/content/parse-study-sections.ts` |
| 5 | Generate exam flashcards | `scripts/generate-exam-flashcards.ts`, `lib/content/flashcards.json` |
| 6 | Enhance explanations | `scripts/enhance-explanations.ts`, `lib/content/questions.json` |
| 7 | Update QuestionCard | `components/practice/question-card.tsx` |
| 8 | Final verification | All files |
