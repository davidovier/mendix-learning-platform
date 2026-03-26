import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export interface Question {
  id: string;
  category: string;
  knowledgePath: string;
  question: string;
  options: string[];
  correctIndex: number;
  imageSource?: string;
}

const categoryToTopicMap: Record<string, string> = {
  "Domain Model": "domain-model",
  "Microflows": "microflows",
  "Nanoflows": "nanoflows",
  "Modules": "modules",
  "Security": "security",
  "Pages": "pages",
  "XPath": "xpath",
  "Integration": "integration",
  "App Directory": "modules",
  "Version Control": "agile",
  "Agile, Collaboration": "agile",
};

export function parseQuestionsFromCSV(): Question[] {
  const csvPath = path.join(
    process.cwd(),
    "..",
    "intermediate_questions.csv"
  );

  if (!fs.existsSync(csvPath)) {
    console.warn(`CSV not found: ${csvPath}`);
    return [];
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8");

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
  });

  const questions: Question[] = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i] as Record<string, string>;

    const options = [
      row.answer_1,
      row.answer_2,
      row.answer_3,
      row.answer_4,
    ].filter(Boolean);

    if (options.length < 2) continue;

    const correctIndex = parseInt(row.correct_answers, 10);
    if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      continue;
    }

    questions.push({
      id: `q-${i}`,
      category: categoryToTopicMap[row.category] || "misc",
      knowledgePath: row.knowledge_path || "",
      question: row.question,
      options,
      correctIndex,
      imageSource: row.image_source || undefined,
    });
  }

  return questions;
}

export function getQuestionsByTopic(
  questions: Question[],
  topicId: string
): Question[] {
  return questions.filter((q) => q.category === topicId);
}

export function getRandomQuestions(
  questions: Question[],
  count: number
): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
