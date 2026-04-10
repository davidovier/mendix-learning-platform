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
