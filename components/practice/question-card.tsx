"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnswerOption } from "./answer-option";
import { CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean) => void;
  onNext: () => void;
  showExplanation?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  showExplanation = true,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    onAnswer(selectedIndex === question.correctIndex);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    onNext();
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const correctAnswer = question.options[question.correctIndex];
  const selectedAnswer =
    selectedIndex !== null ? question.options[selectedIndex] : null;

  // Generate helpful explanation based on the question context
  const generateExplanation = (): string => {
    const category = question.category;

    // Category-specific insights
    const categoryHints: Record<string, string> = {
      "domain-model":
        "In Mendix domain modeling, understanding entity relationships, attributes, and associations is key to building a solid data foundation.",
      microflows:
        "Microflows execute on the server and are used for complex logic, database operations, and integrations. They run synchronously.",
      nanoflows:
        "Nanoflows run on the client (browser/device) and are ideal for offline scenarios and instant UI feedback without server calls.",
      security:
        "Mendix security operates at multiple levels: app security, module roles, entity access, and page/microflow access rules.",
      pages:
        "Pages in Mendix are built with widgets inside data containers. Understanding the data context is crucial for proper widget configuration.",
      xpath:
        "XPath in Mendix is used to query and filter data. It follows a specific syntax for traversing associations and applying constraints.",
      modules:
        "Modules help organize your app into logical units. They contain domain models, pages, microflows, and can be shared across apps.",
      integration:
        "Mendix supports REST, OData, SOAP, and other integration methods. Published and consumed services enable communication with external systems.",
      agile:
        "Mendix supports agile development with built-in version control, branching, and collaboration features in the Team Server.",
    };

    const hint = categoryHints[category] || "";

    return hint;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge>{question.category}</Badge>
        </div>
        <h2 className="text-xl font-medium leading-relaxed">
          {question.question}
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              index={index}
              text={option}
              selected={selectedIndex === index}
              correct={index === question.correctIndex}
              showResult={submitted}
              onClick={() => !submitted && setSelectedIndex(index)}
            />
          ))}
        </div>

        {submitted && showExplanation && (
          <div
            className={cn(
              "p-5 rounded-lg space-y-4",
              isCorrect
                ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900"
                : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900"
            )}
          >
            {/* Result header */}
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-400">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold text-amber-800 dark:text-amber-400">
                    Not quite right
                  </span>
                </>
              )}
            </div>

            {/* Detailed explanation */}
            <div className="space-y-3 text-sm">
              {/* Show correct answer */}
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-md">
                <p className="font-medium text-green-800 dark:text-green-300 mb-1">
                  Correct Answer:
                </p>
                <p className="text-green-900 dark:text-green-200">
                  {correctAnswer}
                </p>
              </div>

              {/* If wrong, show what they selected */}
              {!isCorrect && selectedAnswer && (
                <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-md">
                  <p className="font-medium text-red-800 dark:text-red-300 mb-1">
                    Your Answer:
                  </p>
                  <p className="text-red-900 dark:text-red-200">
                    {selectedAnswer}
                  </p>
                </div>
              )}

              {/* Why this matters - context hint */}
              {generateExplanation() && (
                <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-md">
                  <Lightbulb className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                      Key Concept:
                    </p>
                    <p className="text-blue-900 dark:text-blue-200">
                      {generateExplanation()}
                    </p>
                  </div>
                </div>
              )}

              {/* Explain why other options are wrong */}
              {!isCorrect && (
                <div className="pt-2 border-t border-amber-200 dark:border-amber-800">
                  <p className="text-muted-foreground">
                    <strong>Tip:</strong> Review the{" "}
                    <span className="font-medium">{question.category}</span>{" "}
                    topic in Study Mode to better understand this concept.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={selectedIndex === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>Next Question</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
