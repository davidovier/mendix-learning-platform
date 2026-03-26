import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Flashcard {
  id: string;
  topicId: string;
  front: string;
  back: string;
  codeExample?: string;
  tags: string[];
}

interface Section {
  title: string;
  content: string;
  level: number;
}

function parseMarkdownSections(content: string): Section[] {
  const lines = content.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let contentBuffer: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);

    if (headerMatch) {
      if (currentSection) {
        currentSection.content = contentBuffer.join("\n").trim();
        if (currentSection.content) {
          sections.push(currentSection);
        }
      }
      currentSection = {
        title: headerMatch[2],
        content: "",
        level: headerMatch[1].length,
      };
      contentBuffer = [];
    } else if (currentSection) {
      contentBuffer.push(line);
    }
  }

  if (currentSection) {
    currentSection.content = contentBuffer.join("\n").trim();
    if (currentSection.content) {
      sections.push(currentSection);
    }
  }

  return sections;
}

function extractCodeBlock(content: string): { text: string; code?: string } {
  const codeMatch = content.match(/```[\s\S]*?```/);
  if (codeMatch) {
    return {
      text: content.replace(codeMatch[0], "").trim(),
      code: codeMatch[0],
    };
  }
  return { text: content };
}

export function parseFlashcardsFromFile(
  filePath: string,
  topicId: string
): Flashcard[] {
  const fullPath = path.join(process.cwd(), "..", "documentation", filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return [];
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { content } = matter(fileContent);
  const sections = parseMarkdownSections(content);

  const flashcards: Flashcard[] = [];

  for (const section of sections) {
    if (section.level >= 2 && section.content.length > 50) {
      const { text, code } = extractCodeBlock(section.content);

      flashcards.push({
        id: `${topicId}-${flashcards.length}`,
        topicId,
        front: section.title,
        back: text,
        codeExample: code,
        tags: [topicId],
      });
    }
  }

  return flashcards;
}

export function parseAllFlashcards(): Record<string, Flashcard[]> {
  const { topics } = require("./topics");
  const allFlashcards: Record<string, Flashcard[]> = {};

  for (const topic of topics) {
    if (topic.sourceFile) {
      allFlashcards[topic.id] = parseFlashcardsFromFile(
        topic.sourceFile,
        topic.id
      );
    }
  }

  return allFlashcards;
}
