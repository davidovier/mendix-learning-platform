"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LazyMarkdown } from "@/components/lazy/lazy-markdown";

export interface StudySection {
  title: string;
  content: string;
}

interface StudyGuideAccordionProps {
  sections: StudySection[];
}

export function StudyGuideAccordion({ sections }: StudyGuideAccordionProps) {
  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Study Guide</h2>
      <Accordion className="border rounded-lg divide-y">
        {sections.map((section, index) => (
          <AccordionItem key={index} className="px-4">
            <AccordionTrigger className="py-3">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <LazyMarkdown>{section.content}</LazyMarkdown>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
