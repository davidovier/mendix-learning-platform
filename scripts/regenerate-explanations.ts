#!/usr/bin/env npx tsx
/**
 * Regenerate all question explanations using Claude API
 *
 * Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/regenerate-explanations.ts
 *
 * Options:
 *   --dry-run     Preview without saving
 *   --start=N     Start from question index N
 *   --limit=N     Process only N questions
 */

import Anthropic from "@anthropic-ai/sdk";
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

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is required");
  console.error("Usage: ANTHROPIC_API_KEY=sk-... npx tsx scripts/regenerate-explanations.ts");
  process.exit(1);
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a Mendix certification exam tutor. Generate a helpful explanation for why an answer is correct.

Your explanation must:
1. Explain WHY the correct answer is right (not just that it is)
2. Briefly note why 1-2 of the wrong options are tempting but incorrect
3. Include practical context - when/why this matters in real Mendix development

Rules:
- Be specific to Mendix, not generic software concepts
- Keep it 2-4 sentences, concise but educational
- Don't start with "The correct answer is..." - that's redundant
- Don't say "this aligns with Mendix documentation" - that's useless
- Focus on understanding, not memorization
- Use active voice

Output ONLY the explanation text, no JSON or formatting.`;

function formatCategory(cat: string): string {
  return cat
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function generateExplanation(question: Question): Promise<string> {
  const correctAnswer = question.options[question.correctIndex];
  const wrongAnswers = question.options
    .filter((_, i) => i !== question.correctIndex)
    .map((opt, i) => `${String.fromCharCode(66 + i)}. ${opt}`)
    .join("\n");

  const prompt = `Category: ${formatCategory(question.category)}

Question: ${question.question}

Correct answer: ${correctAnswer}

Wrong options:
${wrongAnswers}

Generate a helpful explanation.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6-20250514",
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }
  return content.text.trim();
}

function needsRegeneration(question: Question): boolean {
  const explanation = question.explanation || "";
  const detailed = question.detailedExplanation || "";

  // Check for generic/useless patterns
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

  // Check if detailedExplanation is just the answer repeated
  const correctAnswer = question.options[question.correctIndex];
  if (detailed && detailed.length < correctAnswer.length + 20) {
    // Likely just repeating the answer
    return true;
  }

  // Check for mismatched explanations (explanation doesn't mention key terms from question)
  const questionWords = question.question.toLowerCase().split(/\s+/);
  const keyTerms = questionWords.filter(w => w.length > 5);
  const explanationLower = explanation.toLowerCase();
  const matchCount = keyTerms.filter(t => explanationLower.includes(t)).length;
  if (keyTerms.length > 3 && matchCount < 2) {
    return true; // Explanation seems unrelated to question
  }

  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const startArg = args.find(a => a.startsWith("--start="));
  const limitArg = args.find(a => a.startsWith("--limit="));

  const startIndex = startArg ? parseInt(startArg.split("=")[1]) : 0;
  const limit = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;

  const questionsPath = path.join(process.cwd(), "lib", "content", "questions.json");
  const questionsContent = await fs.readFile(questionsPath, "utf-8");
  const questions: Question[] = JSON.parse(questionsContent);

  console.log(`Loaded ${questions.length} questions`);

  // Find questions that need regeneration
  const toRegenerate = questions
    .map((q, i) => ({ question: q, index: i }))
    .filter(({ question }) => needsRegeneration(question))
    .slice(startIndex, startIndex + limit);

  console.log(`Found ${toRegenerate.length} questions needing better explanations`);

  if (dryRun) {
    console.log("\n[DRY RUN] Would regenerate:");
    for (const { question, index } of toRegenerate.slice(0, 10)) {
      console.log(`  ${index}: ${question.question.substring(0, 60)}...`);
      console.log(`     Current: ${question.explanation?.substring(0, 50)}...`);
    }
    if (toRegenerate.length > 10) {
      console.log(`  ... and ${toRegenerate.length - 10} more`);
    }
    return;
  }

  let processed = 0;
  let errors = 0;

  for (const { question, index } of toRegenerate) {
    try {
      process.stdout.write(`[${processed + 1}/${toRegenerate.length}] ${question.id}... `);

      const newExplanation = await generateExplanation(question);
      questions[index].explanation = newExplanation;
      // Clear the useless detailedExplanation
      delete questions[index].detailedExplanation;

      console.log("done");
      processed++;

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 200));

      // Save progress every 20 questions
      if (processed % 20 === 0) {
        await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2));
        console.log(`  [Saved progress: ${processed} questions]`);
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
      errors++;
      if (errors > 5) {
        console.error("Too many errors, stopping");
        break;
      }
    }
  }

  // Final save
  await fs.writeFile(questionsPath, JSON.stringify(questions, null, 2));
  console.log(`\nComplete! Regenerated ${processed} explanations.`);
  if (errors > 0) {
    console.log(`${errors} errors occurred.`);
  }
}

main().catch(console.error);
