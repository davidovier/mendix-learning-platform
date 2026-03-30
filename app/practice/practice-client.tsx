"use client";

import { useState, useMemo, useRef } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/practice/question-card";
import { trackAttempt } from "@/lib/db/actions";

type ViewState = "select" | "quiz" | "results";

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface PracticeClientProps {
  questions: Question[];
  topics: Topic[];
  questionCountByTopic: Record<string, number>;
  totalQuestionCount: number;
}

export function PracticeClient({
  questions,
  topics,
  questionCountByTopic,
  totalQuestionCount,
}: PracticeClientProps) {
  const [view, setView] = useState<ViewState>("select");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // Store shuffled questions in a ref to persist across re-renders
  const shuffledAllQuestionsRef = useRef<Question[] | null>(null);

  // Filter questions based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "all") {
      // Only shuffle once when "all" is first selected
      if (!shuffledAllQuestionsRef.current) {
        const shuffled = [...questions];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        shuffledAllQuestionsRef.current = shuffled.slice(0, 20);
      }
      return shuffledAllQuestionsRef.current;
    }
    return questions.filter((q) => q.category === selectedTopic);
  }, [selectedTopic, questions]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setView("quiz");
  };

  // Get local date in YYYY-MM-DD format
  const getLocalDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const handleAnswer = async (correct: boolean, questionId: string) => {
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => prev + 1);

    // Track attempt in database with local date for streak calculation
    const topicId = selectedTopic === "all"
      ? currentQuestion.category
      : selectedTopic;
    const topic = topics.find((t) => t.id === topicId);

    // Track attempt even if topic not found, use category as fallback name
    const topicName = topic?.name ?? topicId ?? "Unknown";
    const finalTopicId = topicId ?? currentQuestion.category;

    if (finalTopicId) {
      await trackAttempt({
        question_id: questionId,
        topic_id: finalTopicId,
        topic_name: topicName,
        is_correct: correct,
        localDate: getLocalDate(),
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setView("results");
    }
  };

  const handleRestart = () => {
    setView("select");
    setSelectedTopic(null);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    // Clear shuffled questions so a new shuffle happens next time
    shuffledAllQuestionsRef.current = null;
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    // Clear shuffled questions to get a new random set on retry
    shuffledAllQuestionsRef.current = null;
    setView("quiz");
  };

  // Calculate score percentage
  const scorePercentage = answeredQuestions > 0
    ? Math.round((correctAnswers / answeredQuestions) * 100)
    : 0;

  const isPassing = scorePercentage >= 70;

  // Filter topics that have questions
  const availableTopics = topics.filter((t) => questionCountByTopic[t.id] > 0);

  if (view === "select") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">
              Practice Mode
            </h1>
            <p className="text-muted-foreground">
              Select a topic to practice or test your knowledge across all topics
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* All Topics Card */}
            <button
              className="text-left p-5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-200"
              onClick={() => handleTopicSelect("all")}
            >
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-foreground">All Topics</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    20 random questions from all categories
                  </p>
                  <Badge variant="secondary" className="mt-3 text-xs">
                    {totalQuestionCount} questions
                  </Badge>
                </div>
              </div>
            </button>

            {/* Individual Topic Cards */}
            {availableTopics.map((topic) => {
              const Icon = topic.icon;
              const questionCount = questionCountByTopic[topic.id] || 0;

              return (
                <button
                  key={topic.id}
                  className="text-left p-5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-200"
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {topic.description}
                      </p>
                      <Badge variant="secondary" className="mt-3 text-xs">
                        {questionCount} questions
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (view === "quiz" && currentQuestion) {
    const progressPercentage =
      ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" onClick={handleRestart}>
                ← Back to Topics
              </Button>
              <span className="text-sm text-muted-foreground">
                {correctAnswers} / {answeredQuestions} correct
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={filteredQuestions.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </div>
      </div>
    );
  }

  if (view === "results") {
    const topicName =
      selectedTopic === "all"
        ? "All Topics"
        : topics.find((t) => t.id === selectedTopic)?.name || "Practice";

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-1">Quiz Complete</h2>
              <p className="text-muted-foreground">{topicName}</p>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">{scorePercentage}%</div>
                <Badge variant={isPassing ? "default" : "destructive"}>
                  {isPassing ? "PASSED" : "NEEDS IMPROVEMENT"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Correct Answers</span>
                  <span className="font-medium text-green-600">
                    {correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Incorrect Answers</span>
                  <span className="font-medium text-red-600">
                    {answeredQuestions - correctAnswers}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Questions</span>
                  <span className="font-medium">{answeredQuestions}</span>
                </div>
              </div>

              <Progress value={scorePercentage} className="h-3" />

              <div className="flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="w-full"
                >
                  Choose Different Topic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
