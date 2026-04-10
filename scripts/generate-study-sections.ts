import { promises as fs } from "fs";
import path from "path";
import { topics } from "../lib/content/topics";

interface StudySection {
  title: string;
  content: string;
}

interface StudySectionsData {
  [topicId: string]: StudySection[];
}

function parseMarkdownSections(markdown: string): StudySection[] {
  const sections = markdown.split(/^## /gm);

  return sections.slice(1).map((section) => {
    const [title, ...content] = section.split("\n");
    return {
      title: title.trim(),
      content: content.join("\n").trim(),
    };
  });
}

async function main() {
  const outputPath = path.join(
    process.cwd(),
    "lib",
    "content",
    "study-sections.json"
  );

  const studySections: StudySectionsData = {};

  for (const topic of topics) {
    if (!topic.sourceFile) {
      studySections[topic.id] = [];
      continue;
    }

    const filePath = path.join(process.cwd(), "documentation", topic.sourceFile);

    try {
      const markdown = await fs.readFile(filePath, "utf-8");
      studySections[topic.id] = parseMarkdownSections(markdown);
      console.log(`Parsed ${studySections[topic.id].length} sections for ${topic.id}`);
    } catch (err) {
      console.warn(`Could not read ${topic.sourceFile}: ${err}`);
      studySections[topic.id] = [];
    }
  }

  await fs.writeFile(outputPath, JSON.stringify(studySections, null, 2));
  console.log(`\nWrote study sections to ${outputPath}`);
}

main().catch(console.error);
