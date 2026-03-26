import fs from "fs";
import path from "path";
import { parseAllFlashcards } from "../lib/content/parse-flashcards";
import { parseQuestionsFromCSV } from "../lib/content/parse-questions";

const contentDir = path.join(process.cwd(), "content");

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Process flashcards
console.log("Processing flashcards...");
const flashcards = parseAllFlashcards();
const flashcardCount = Object.values(flashcards).flat().length;
fs.writeFileSync(
  path.join(contentDir, "flashcards.json"),
  JSON.stringify(flashcards, null, 2)
);
console.log(`Wrote ${flashcardCount} flashcards`);

// Process questions
console.log("Processing questions...");
const questions = parseQuestionsFromCSV();
fs.writeFileSync(
  path.join(contentDir, "questions.json"),
  JSON.stringify(questions, null, 2)
);
console.log(`Wrote ${questions.length} questions`);

console.log("Content processing complete!");
