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
  onAnswer: (correct: boolean, questionId: string) => void;
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
    onAnswer(selectedIndex === question.correctIndex, question.id);
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
                ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900"
                : "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700"
            )}
          >
            {/* Result header */}
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Not quite right
                  </span>
                </>
              )}
            </div>

            {/* Detailed explanation */}
            <div className="space-y-3 text-sm">
              {/* Show correct answer */}
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-md">
                <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                  Correct Answer:
                </p>
                <p className="text-emerald-800 dark:text-emerald-200">
                  {correctAnswer}
                </p>
              </div>

              {/* If wrong, show what they selected */}
              {!isCorrect && selectedAnswer && (
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-md">
                  <p className="font-medium text-rose-700 dark:text-rose-300 mb-1">
                    Your Answer:
                  </p>
                  <p className="text-rose-800 dark:text-rose-200">
                    {selectedAnswer}
                  </p>
                </div>
              )}

              {/* Why this matters - context hint */}
              {generateExplanation() && (
                <div className="flex gap-2 p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-md">
                  <Lightbulb className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-1">
                      Key Concept:
                    </p>
                    <p className="text-indigo-800 dark:text-indigo-200">
                      {generateExplanation()}
                    </p>
                  </div>
                </div>
              )}

              {/* Explain why other options are wrong */}
              {!isCorrect && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
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
