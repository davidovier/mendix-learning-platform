import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { LazyMarkdown } from "@/components/lazy/lazy-markdown";
import { JsonLd, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Mendix Cheatsheet - Quick Reference Guide",
  description:
    "Quick reference for microflows, nanoflows, security, XPath and more. Print-friendly Mendix cheatsheet for exam preparation.",
  keywords: [
    "mendix cheatsheet",
    "mendix reference",
    "mendix quick guide",
    "mendix exam cheatsheet",
  ],
};

// Cache this page for 24 hours since cheatsheet content rarely changes
export const revalidate = 86400;

const cheatsheetFAQs = [
  {
    question: "What is the difference between microflows and nanoflows?",
    answer:
      "Microflows run server-side and are used for complex business logic, database operations, and integrations. Nanoflows run client-side in the browser or on mobile devices, making them faster for simple operations and essential for offline functionality.",
  },
  {
    question: "How do access rules work in Mendix?",
    answer:
      "Access rules in Mendix control which users can read, create, update, or delete entity instances based on their user role. They are defined at the entity level in the domain model and can include XPath constraints to limit access to specific records.",
  },
  {
    question: "What XPath functions are commonly used in Mendix?",
    answer:
      "Common XPath functions include contains(), starts-with(), not(), and/or operators, and comparison operators. You can also use tokens like [%CurrentUser%] and [%CurrentDateTime%] for dynamic queries.",
  },
];

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
      <JsonLd data={faqSchema(cheatsheetFAQs)} />
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
