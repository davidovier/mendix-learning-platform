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
