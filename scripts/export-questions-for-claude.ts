#!/usr/bin/env npx tsx
/**
 * Export questions that need better explanations for manual Claude processing
 *
 * Usage: npx tsx scripts/export-questions-for-claude.ts > questions-batch.txt
 *
 * Options:
 *   --batch=N     Export batch N (each batch = 20 questions)
 *   --list        List all batches
 */

import { promises as fs } from "fs";
import path from "path";

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

function needsRegeneration(question: Question): boolean {
  const explanation = question.explanation || "";
  const detailed = question.detailedExplanation || "";

  const genericPatterns = [
    "this aligns with Mendix",
    "aligns with Mendix",
    "best practices and documentation",
    "This concept is important for the Intermediate Certification",
  ];

  for (const pattern of genericPatterns) {
    if (explanation.toLowerCase().includes(pattern.toLowerCase())) {
      return true;
    }
  }

  const correctAnswer = question.options[question.correctIndex];
  if (detailed && detailed.length < correctAnswer.length + 20) {
    return true;
  }

  const questionWords = question.question.toLowerCase().split(/\s+/);
  const keyTerms = questionWords.filter(w => w.length > 5);
  const explanationLower = explanation.toLowerCase();
  const matchCount = keyTerms.filter(t => explanationLower.includes(t)).length;
  if (keyTerms.length > 3 && matchCount < 2) {
    return true;
  }

  return false;
}

function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function main() {
  const args = process.argv.slice(2);
  const listBatches = args.includes("--list");
  const batchArg = args.find(a => a.startsWith("--batch="));
  const batchNum = batchArg ? parseInt(batchArg.split("=")[1]) : 1;

  const BATCH_SIZE = 20;

  const questionsPath = path.join(process.cwd(), "lib", "content", "questions.json");
  const questionsContent = await fs.readFile(questionsPath, "utf-8");
  const questions: Question[] = JSON.parse(questionsContent);

  const toFix = questions
    .map((q, i) => ({ question: q, index: i }))
    .filter(({ question }) => needsRegeneration(question));

  const totalBatches = Math.ceil(toFix.length / BATCH_SIZE);

  if (listBatches) {
    console.log(`Total questions needing fixes: ${toFix.length}`);
    console.log(`Total batches (${BATCH_SIZE} each): ${totalBatches}`);
    console.log(`\nTo export a batch: npx tsx scripts/export-questions-for-claude.ts --batch=1`);
    return;
  }

  const startIdx = (batchNum - 1) * BATCH_SIZE;
  const batch = toFix.slice(startIdx, startIdx + BATCH_SIZE);

  if (batch.length === 0) {
    console.error(`Batch ${batchNum} is empty. Total batches: ${totalBatches}`);
    process.exit(1);
  }

  // Output the prompt for Claude
  console.log(`=== BATCH ${batchNum} of ${totalBatches} (${batch.length} questions) ===

INSTRUCTIONS FOR CLAUDE:

Generate better explanations for these Mendix certification practice questions.

For each question, write a 2-4 sentence explanation that:
1. Explains WHY the correct answer is right (not just that it is)
2. Briefly mentions why 1-2 wrong options are tempting but incorrect
3. Adds practical context about when this matters in real Mendix development

Rules:
- Be specific to Mendix concepts
- Don't start with "The correct answer is..."
- Don't say generic things like "this aligns with documentation"
- Focus on understanding, not memorization

Output format - for each question output EXACTLY:
[ID]
explanation text here
---

Example output:
[q-42]
Scheduled events run microflows at specified times on the server, ideal for batch processing or nightly jobs. Using a nanoflow won't work because nanoflows execute client-side and can't run without a user session. The [%CurrentDateTime%] token is just a value, not a scheduling mechanism.
---

Now generate explanations for these questions:

`);

  for (const { question } of batch) {
    const correctAnswer = question.options[question.correctIndex];
    const wrongAnswers = question.options
      .map((opt, i) => i !== question.correctIndex ? opt : null)
      .filter(Boolean)
      .join(" | ");

    console.log(`[${question.id}]
Category: ${formatCategory(question.category)}
Question: ${question.question}
Correct: ${correctAnswer}
Wrong options: ${wrongAnswers}
`);
  }

  console.log(`
=== END OF BATCH ${batchNum} ===

After getting responses from Claude, save them to a file and run:
npx tsx scripts/import-explanations.ts explanations-batch${batchNum}.txt
`);
}

main().catch(console.error);
