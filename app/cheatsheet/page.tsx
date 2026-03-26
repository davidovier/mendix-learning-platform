import fs from "fs";
import path from "path";
import { MessageResponse } from "@/components/ai-elements/message";

async function getCheatsheetContent() {
  const filePath = path.join(
    process.cwd(),
    "lib",
    "content",
    "docs",
    "cheatsheet.md"
  );

  return fs.readFileSync(filePath, "utf-8");
}

export default async function CheatsheetPage() {
  const content = await getCheatsheetContent();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quick Reference Cheatsheet</h1>
        <p className="text-muted-foreground mt-2">
          Essential facts to memorize before the exam
        </p>
      </div>

      <MessageResponse>{content}</MessageResponse>
    </div>
  );
}
