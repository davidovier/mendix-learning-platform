#!/usr/bin/env npx tsx
/**
 * Import explanations from Claude's response back into questions.json
 *
 * Usage: npx tsx scripts/import-explanations.ts response.txt
 *
 * Expected format in response.txt:
 * [q-0]
 * Explanation text here...
 * ---
 * [q-3]
 * Another explanation...
 * ---
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

async function main() {
  const responseFile = process.argv[2];

  if (!responseFile) {
    console.error("Usage: npx tsx scripts/import-explanations.ts <response-file.txt>");
    process.exit(1);
  }

  // Read the response file
  const responsePath = path.resolve(responseFile);
  let responseContent: string;
  try {
    responseContent = await fs.readFile(responsePath, "utf-8");
  } catch {
    console.error(`Could not read file: ${responsePath}`);
    process.exit(1);
  }

  // Parse explanations from the response
  const explanations = new Map<string, string>();

  // Match [q-N] followed by text until ---
  const regex = /\[([^\]]+)\]\s*\n([\s\S]*?)(?=\n---|\n\[q-|$)/g;
  let match;

  while ((match = regex.exec(responseContent)) !== null) {
    const id = match[1].trim();
    const explanation = match[2].trim();
    if (id && explanation) {
      explanations.set(id, explanation);
    }
  }

  if (explanations.size === 0) {
    console.error("No explanations found in file. Expected format:");
    console.error("[q-0]");
    console.error("Explanation text...");
    console.error("---");
    process.exit(1);
  }

  console.log(`Found ${explanations.size} explanations to import`);

  // Load questions
  const questionsPath = path.join(process.cwd(), "lib", "content", "questions.json");
  const questionsContent = await fs.readFile(questionsPath, "utf-8");
  const questions: Question[] = JSON.parse(questionsContent);

  // Update questions with new explanations
  let updated = 0;
  let notFound = 0;

  for (const [id, explanation] of explanations) {
    const questionIdx = questions.findIndex(q => q.id === id);
    if (questionIdx === -1) {
      console.warn(`Question ${id} not found in questions.json`);
      notFound++;
      continue;
    }

    questions[questionIdx].explanation = explanation;
    // Remove the useless detailedExplanation field
    delete questions[questionIdx].detailedExplanation;
    updated++;
  }

  // Save updated questions
  await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2));

  console.log(`\nDone! Updated ${updated} explanations.`);
  if (notFound > 0) {
    console.log(`${notFound} IDs not found in questions.json`);
  }

  // Show sample of what was updated
  console.log("\nSample updates:");
  let count = 0;
  for (const [id, explanation] of explanations) {
    if (count >= 3) break;
    console.log(`\n[${id}]`);
    console.log(explanation.substring(0, 100) + (explanation.length > 100 ? "..." : ""));
    count++;
  }
}

main().catch(console.error);
