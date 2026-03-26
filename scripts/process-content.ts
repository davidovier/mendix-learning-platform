import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");
const flashcardsPath = path.join(contentDir, "flashcards.json");
const questionsPath = path.join(contentDir, "questions.json");

// Skip processing if content files already exist (e.g., in CI/CD deployment)
if (fs.existsSync(flashcardsPath) && fs.existsSync(questionsPath)) {
  console.log("Content files already exist, skipping processing.");
  console.log("To regenerate, delete content/*.json and run again.");
  process.exit(0);
}

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Dynamic imports to avoid errors when source files aren't available
const { parseAllFlashcards } = await import("../lib/content/parse-flashcards");
const { parseQuestionsFromCSV } = await import("../lib/content/parse-questions");

// Process flashcards
console.log("Processing flashcards...");
const flashcards = parseAllFlashcards();
const flashcardCount = Object.values(flashcards).flat().length;
fs.writeFileSync(flashcardsPath, JSON.stringify(flashcards, null, 2));
console.log(`Wrote ${flashcardCount} flashcards`);

// Process questions
console.log("Processing questions...");
const questions = parseQuestionsFromCSV();
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`Wrote ${questions.length} questions`);

console.log("Content processing complete!");
