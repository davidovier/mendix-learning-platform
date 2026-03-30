"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnswerOption } from "@/components/practice/answer-option";
import { ExamTimer } from "@/components/exam/exam-timer";
import { topics } from "@/lib/content/topics";
import { cn } from "@/lib/utils";
import questions from "@/lib/content/questions.json";
import { createExamSession, completeExamSession } from "@/lib/db/actions";

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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Bug fix #1: Use useState with lazy initializer to shuffle only once on mount
  // This prevents re-shuffling on re-renders or strict mode double-mount
  const [examQuestions] = useState<Question[]>(() => {
    // Seeded shuffle using Fisher-Yates with a fixed seed per session
    const seed = Date.now();
    const shuffled = [...(questions as Question[])];
    let currentIndex = shuffled.length;
    let seededRandom = seed;

    while (currentIndex !== 0) {
      // Simple seeded random (mulberry32-like)
      seededRandom = (seededRandom * 1664525 + 1013904223) % 4294967296;
      const randomIndex = Math.floor((seededRandom / 4294967296) * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    return shuffled.slice(0, EXAM_QUESTIONS);
  });

  // Bug fix #12: Create exam session on mount with error handling
  useEffect(() => {
    async function initSession() {
      const result = await createExamSession("simulation");
      if (result.error) {
        console.error("Failed to create exam session:", result.error);
        // Session creation failed but exam can still proceed locally
      } else if (result.sessionId) {
        setSessionId(result.sessionId);
      }
    }
    initSession();
    startTimeRef.current = Date.now();
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

  // Get local date in YYYY-MM-DD format for streak calculation
  const getLocalDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const handleSubmitExam = useCallback(async () => {
    // Calculate results
    let correctCount = 0;
    const answersRecord: Record<string, boolean> = {};

    examQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctIndex;
      answersRecord[question.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    // Save to database if we have a session
    if (sessionId) {
      const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
      await completeExamSession({
        sessionId,
        score: correctCount,
        totalQuestions: examQuestions.length,
        answers: answersRecord,
        timeSpentSeconds: timeSpent,
        localDate: getLocalDate(),
      });
    }

    setExamState("results");
  }, [sessionId, examQuestions, answers]);

  const handleTimeUp = useCallback(async () => {
    // Auto-submit when time runs out
    await handleSubmitExam();
  }, [handleSubmitExam]);

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
    const { correctCount, totalQuestions, percentage, passed } = calculateResults;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Exam Complete</h1>
            <p className="text-muted-foreground">
              Your results are ready
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Score</CardTitle>
              <CardDescription>
                {passed ? "Congratulations, you passed!" : "Keep practicing and try again"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{correctCount}/{totalQuestions}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{PASS_PERCENTAGE}%</div>
                  <div className="text-sm text-muted-foreground">Required</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{passed ? "Pass" : "Fail"}</div>
                  <div className="text-sm text-muted-foreground">Result</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>What&apos;s Next</span>
                <Badge variant="outline">
                  {passed ? "Well done" : "Keep going"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {passed ? (
                  <>
                    <li>- Review any topics where you felt unsure</li>
                    <li>- Take another exam to solidify your knowledge</li>
                    <li>- Check your progress page for detailed topic breakdown</li>
                  </>
                ) : (
                  <>
                    <li>- Practice the topics you struggled with</li>
                    <li>- Review the study materials before retrying</li>
                    <li>- Check your progress page to identify weak areas</li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleReturnHome} className="flex-1">
              Take Another Exam
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/progress")}
              className="flex-1"
            >
              View Progress
            </Button>
          </div>
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
