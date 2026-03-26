"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnswerOption } from "@/components/practice/answer-option";
import { ExamTimer } from "@/components/exam/exam-timer";
import { topics } from "@/lib/content/topics";
import { cn } from "@/lib/utils";
import questions from "@/content/questions.json";

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
}

type ExamState = "active" | "results";

const EXAM_QUESTIONS = 50;
const EXAM_TIME_SECONDS = 90 * 60; // 90 minutes
const PASS_PERCENTAGE = 70;

export default function ExamPage() {
  const router = useRouter();
  const [examState, setExamState] = useState<ExamState>("active");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Shuffle and select 50 random questions
  const examQuestions = useMemo(() => {
    return [...(questions as Question[])]
      .sort(() => Math.random() - 0.5)
      .slice(0, EXAM_QUESTIONS);
  }, []);

  const currentQuestion = examQuestions[currentQuestionIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = useCallback(() => {
    setExamState("results");
  }, []);

  const handleTimeUp = useCallback(() => {
    setExamState("results");
  }, []);

  const handleReturnHome = () => {
    router.push("/exam");
  };

  // Calculate results
  const calculateResults = useMemo(() => {
    let correctCount = 0;
    const categoryResults: Record<string, { correct: number; total: number }> = {};

    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctIndex;

      if (isCorrect) {
        correctCount++;
      }

      if (!categoryResults[question.category]) {
        categoryResults[question.category] = { correct: 0, total: 0 };
      }
      categoryResults[question.category].total++;
      if (isCorrect) {
        categoryResults[question.category].correct++;
      }
    });

    const percentage = Math.round((correctCount / examQuestions.length) * 100);
    const passed = percentage >= PASS_PERCENTAGE;

    return {
      correctCount,
      totalQuestions: examQuestions.length,
      percentage,
      passed,
      categoryResults,
    };
  }, [examQuestions, answers]);

  const answeredCount = Object.keys(answers).length;

  if (examState === "results") {
    const { correctCount, totalQuestions, percentage, passed, categoryResults } = calculateResults;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Exam Complete!</CardTitle>
              <CardDescription>
                Here are your results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{percentage}%</div>
                <Badge
                  variant={passed ? "default" : "destructive"}
                  className="text-lg px-4 py-1"
                >
                  {passed ? "PASSED" : "FAILED"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Correct Answers</span>
                  <span className="font-medium text-green-600">{correctCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Incorrect Answers</span>
                  <span className="font-medium text-red-600">
                    {totalQuestions - correctCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Questions</span>
                  <span className="font-medium">{totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pass Threshold</span>
                  <span className="font-medium">{PASS_PERCENTAGE}%</span>
                </div>
              </div>

              <Progress value={percentage} className="h-3" />

              <div className="space-y-3">
                <h3 className="font-semibold">Results by Topic</h3>
                <div className="space-y-2">
                  {Object.entries(categoryResults).map(([category, result]) => {
                    const topic = topics.find((t) => t.id === category);
                    const topicPercentage = Math.round(
                      (result.correct / result.total) * 100
                    );
                    const topicPassed = topicPercentage >= PASS_PERCENTAGE;

                    return (
                      <div
                        key={category}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span>{topic?.icon || "?"}</span>
                          <span className="text-sm font-medium">
                            {topic?.name || category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {result.correct}/{result.total}
                          </span>
                          <Badge
                            variant={topicPassed ? "outline" : "destructive"}
                            className="text-xs"
                          >
                            {topicPercentage}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleReturnHome} className="w-full">
                  Take Another Exam
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/practice")}
                  className="w-full"
                >
                  Practice Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Exam</h1>
            <Badge variant="outline">
              {answeredCount}/{examQuestions.length} answered
            </Badge>
          </div>
          <ExamTimer totalSeconds={EXAM_TIME_SECONDS} onTimeUp={handleTimeUp} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
          {/* Question Card */}
          <Card className="w-full">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {examQuestions.length}
                </Badge>
                <Badge>{currentQuestion.category}</Badge>
              </div>
              <h2 className="text-xl font-medium leading-relaxed">
                {currentQuestion.question}
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <AnswerOption
                    key={index}
                    index={index}
                    text={option}
                    selected={answers[currentQuestionIndex] === index}
                    correct={false}
                    showResult={false}
                    onClick={() => handleSelectAnswer(index)}
                  />
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                <div className="flex gap-2">
                  {currentQuestionIndex < examQuestions.length - 1 ? (
                    <Button onClick={handleNext}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmitExam} variant="default">
                      Submit Exam
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {examQuestions.map((_, index) => {
                  const isAnswered = answers[index] !== undefined;
                  const isCurrent = index === currentQuestionIndex;

                  return (
                    <button
                      key={index}
                      onClick={() => handleGoToQuestion(index)}
                      className={cn(
                        "w-8 h-8 rounded text-sm font-medium transition-colors",
                        isCurrent && "ring-2 ring-primary ring-offset-2",
                        isAnswered
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted"></div>
                  <span>Unanswered</span>
                </div>
              </div>
              <Button
                onClick={handleSubmitExam}
                className="w-full mt-4"
                variant="outline"
              >
                Submit Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
