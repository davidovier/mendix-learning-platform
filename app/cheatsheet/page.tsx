import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { LazyMarkdown } from "@/components/lazy/lazy-markdown";

export const metadata: Metadata = {
  title: "Quick Reference Cheatsheet",
  description:
    "Essential Mendix facts and formulas to memorize before your certification exam. Quick reference for XPath, microflows, security rules, and more.",
};

// Cache this page for 24 hours since cheatsheet content rarely changes
export const revalidate = 86400;

async function getCheatsheetContent() {
  const filePath = path.join(
    process.cwd(),
    "lib",
    "content",
    "docs",
    "cheatsheet.md"
  );

  // Bug fix #17: Use async file reading to avoid blocking the event loop
  return fs.readFile(filePath, "utf-8");
}

export default async function CheatsheetPage() {
  const content = await getCheatsheetContent();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quick Reference Cheatsheet</h1>
        <p className="text-muted-foreground mt-2">
          Essential facts to memorize before the exam
        </p>
      </div>

      <LazyMarkdown>{content}</LazyMarkdown>
    </div>
  );
}
