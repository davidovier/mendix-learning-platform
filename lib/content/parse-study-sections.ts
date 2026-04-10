import { promises as fs } from "fs";
import path from "path";

export interface StudySection {
  title: string;
  content: string;
}

export async function parseStudySections(
  sourceFile: string
): Promise<StudySection[]> {
  if (!sourceFile) {
    return [];
  }

  const filePath = path.join(process.cwd(), "documentation", sourceFile);

  try {
    const markdown = await fs.readFile(filePath, "utf-8");
    const sections = markdown.split(/^## /gm);

    return sections.slice(1).map((section) => {
      const [title, ...content] = section.split("\n");
      return {
        title: title.trim(),
        content: content.join("\n").trim(),
      };
    });
  } catch {
    // File doesn't exist or can't be read
    return [];
  }
}
