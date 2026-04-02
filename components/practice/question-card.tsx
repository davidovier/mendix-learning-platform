"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnswerOption } from "./answer-option";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Brain,
  Target,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface AIExplanation {
  whyYouChose: string;
  whyCorrect: string;
  tip: string;
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
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleSubmit = async () => {
    if (selectedIndex === null) return;
    setSubmitted(true);

    const isCorrect = selectedIndex === question.correctIndex;
    onAnswer(isCorrect, question.id);

    // Fetch AI explanation for wrong answers
    if (!isCorrect && showExplanation) {
      setIsLoadingExplanation(true);
      try {
        const response = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.question,
            category: question.category,
            options: question.options,
            correctIndex: question.correctIndex,
            selectedIndex,
          }),
        });

        if (response.ok) {
          const explanation = await response.json();
          setAiExplanation(explanation);
        }
      } catch (error) {
        console.error("Failed to fetch explanation:", error);
      } finally {
        setIsLoadingExplanation(false);
      }
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    setAiExplanation(null);
    onNext();
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const correctAnswer = question.options[question.correctIndex];
  const selectedAnswer =
    selectedIndex !== null ? question.options[selectedIndex] : null;

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
              "p-5 rounded-lg space-y-4 border",
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
                : "bg-muted/50 border-border"
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
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Incorrect
                  </span>
                </>
              )}
            </div>

            {isCorrect ? (
              // Simple confirmation for correct answers
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {correctAnswer}
                  </span>
                </p>
                <p className="mt-2">
                  Great job! You correctly identified the right answer.
                </p>
              </div>
            ) : (
              // Detailed AI explanation for wrong answers
              <div className="space-y-4 text-sm">
                {isLoadingExplanation ? (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">
                      Analyzing your answer...
                    </span>
                  </div>
                ) : aiExplanation ? (
                  <>
                    {/* Why you chose this answer */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <Brain className="h-4 w-4" />
                        <span className="font-medium">Why you might have chosen "{selectedAnswer}"</span>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {aiExplanation.whyYouChose}
                      </p>
                    </div>

                    {/* Why correct answer is correct */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">Why "{correctAnswer}" is correct</span>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {aiExplanation.whyCorrect}
                      </p>
                    </div>

                    {/* Tip for next time */}
                    <div className="space-y-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Lightbulb className="h-4 w-4" />
                        <span className="font-medium">Tip for similar questions</span>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {aiExplanation.tip}
                      </p>
                    </div>
                  </>
                ) : (
                  // Fallback if AI explanation failed
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Correct answer:</span>{" "}
                      {correctAnswer}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Your answer:</span>{" "}
                      {selectedAnswer}
                    </p>
                  </div>
                )}
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
            <Button onClick={handleNext} disabled={isLoadingExplanation}>
              {isLoadingExplanation ? "Loading..." : "Next Question"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
