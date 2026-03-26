"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashcardProps {
  front: string;
  back: string;
  codeExample?: string;
}

export function Flashcard({ front, back, codeExample }: FlashcardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  // Simple markdown-like rendering for common patterns
  const renderContent = (text: string) => {
    // Split by lines to handle different elements
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    lines.forEach((line, lineIndex) => {
      // Check for table row
      if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
        const cells = line
          .split("|")
          .filter((cell) => cell.trim() !== "")
          .map((cell) => cell.trim());

        // Check if it's a separator row
        if (cells.every((cell) => /^[-:]+$/.test(cell))) {
          return; // Skip separator row
        }

        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        return;
      }

      // If we were in a table and hit a non-table line, render the table
      if (inTable) {
        elements.push(
          <div key={`table-${lineIndex}`} className="overflow-x-auto my-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {tableHeaders.map((header, i) => (
                    <th
                      key={i}
                      className="text-left p-2 font-semibold text-foreground"
                    >
                      {renderInlineText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border/50">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="p-2 text-muted-foreground">
                        {renderInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableRows = [];
        tableHeaders = [];
      }

      // Handle horizontal rule
      if (line.trim() === "---") {
        elements.push(<hr key={lineIndex} className="my-4 border-border" />);
        return;
      }

      // Handle empty lines
      if (line.trim() === "") {
        elements.push(<div key={lineIndex} className="h-2" />);
        return;
      }

      // Handle list items
      if (line.trim().startsWith("- ")) {
        elements.push(
          <div key={lineIndex} className="flex gap-2 ml-2 my-1">
            <span className="text-primary">•</span>
            <span className="text-muted-foreground">
              {renderInlineText(line.trim().substring(2))}
            </span>
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={lineIndex} className="text-muted-foreground my-2">
          {renderInlineText(line)}
        </p>
      );
    });

    // Handle any remaining table
    if (inTable && tableHeaders.length > 0) {
      elements.push(
        <div key="table-final" className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                {tableHeaders.map((header, i) => (
                  <th
                    key={i}
                    className="text-left p-2 font-semibold text-foreground"
                  >
                    {renderInlineText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border/50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="p-2 text-muted-foreground">
                      {renderInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  // Handle inline formatting like **bold**
  const renderInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="w-full">
      {/* Question/Front */}
      <button
        onClick={() => setIsRevealed(!isRevealed)}
        className="w-full text-left p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">{front}</h2>
          <div className="flex-shrink-0 text-muted-foreground">
            {isRevealed ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </div>
        {!isRevealed && (
          <p className="text-sm text-muted-foreground mt-2">
            Click to reveal answer
          </p>
        )}
      </button>

      {/* Answer/Back */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isRevealed ? "max-h-[2000px] opacity-100 mt-3" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 rounded-lg border border-primary/30 bg-accent/30">
          <div className="space-y-1">{renderContent(back)}</div>
          {codeExample && (
            <pre className="mt-4 bg-muted p-4 rounded-lg text-sm overflow-x-auto font-mono">
              {codeExample}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
