#!/usr/bin/env npx tsx
/**
 * Export ALL questions needing better explanations for Claude web
 */

import { promises as fs } from "fs";
import path from "path";

interface Question {
  id: string;
  category: string;
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
  const questionsPath = path.join(process.cwd(), "lib", "content", "questions.json");
  const questionsContent = await fs.readFile(questionsPath, "utf-8");
  const questions: Question[] = JSON.parse(questionsContent);

  const toFix = questions.filter(q => needsRegeneration(q));

  console.log(`Generate better explanations for these ${toFix.length} Mendix certification practice questions.

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

Example:
[q-42]
Scheduled events run microflows at specified times on the server, ideal for batch processing or nightly jobs. Using a nanoflow won't work because nanoflows execute client-side and can't run without a user session. The [%CurrentDateTime%] token is just a value, not a scheduling mechanism.
---

QUESTIONS:
`);

  for (const question of toFix) {
    const correctAnswer = question.options[question.correctIndex];
    const wrongAnswers = question.options
      .map((opt, i) => i !== question.correctIndex ? opt : null)
      .filter(Boolean)
      .join(" | ");

    console.log(`[${question.id}]
Category: ${formatCategory(question.category)}
Q: ${question.question}
Correct: ${correctAnswer}
Wrong: ${wrongAnswers}
`);
  }
}

main().catch(console.error);
