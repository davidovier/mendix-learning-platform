"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnswerOption } from "./answer-option";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  detailedExplanation?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean, questionId: string) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Shuffle options once per question to randomize answer order
  const { shuffledOptions, shuffledCorrectIndex } = useMemo(() => {
    const indices = question.options.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      shuffledOptions: indices.map((i) => question.options[i]),
      shuffledCorrectIndex: indices.indexOf(question.correctIndex),
    };
  }, [question.id, question.options, question.correctIndex]);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);

    const isCorrect = selectedIndex === shuffledCorrectIndex;
    onAnswer(isCorrect, question.id);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    onNext();
  };

  const isCorrect = selectedIndex === shuffledCorrectIndex;

  // Format category name for display
  const formatCategory = (cat: string): string => {
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge>{formatCategory(question.category)}</Badge>
        </div>
        <h2 className="text-xl font-medium leading-relaxed">
          {question.question}
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {shuffledOptions.map((option, index) => (
            <AnswerOption
              key={index}
              index={index}
              text={option}
              selected={selectedIndex === index}
              correct={index === shuffledCorrectIndex}
              showResult={submitted}
              onClick={() => !submitted && setSelectedIndex(index)}
            />
          ))}
        </div>

        {submitted && (
          <div className="p-5 rounded-lg space-y-3 border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900">
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
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Incorrect
                  </span>
                </>
              )}
            </div>

            {/* Explanation */}
            {(question.detailedExplanation || question.explanation) && (
              <div className="flex gap-2 text-sm">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-emerald-800 dark:text-emerald-200 whitespace-pre-line">
                  {question.detailedExplanation || question.explanation}
                </p>
              </div>
            )}
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
