"use client";

import { useState, useMemo } from "react";
import { BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/practice/question-card";
import { topics } from "@/lib/content/topics";
import questions from "@/lib/content/questions.json";
import { trackAttempt } from "@/lib/db/actions";

type ViewState = "select" | "quiz" | "results";

interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export default function PracticePage() {
  const [view, setView] = useState<ViewState>("select");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  // Filter questions based on selected topic
  const filteredQuestions = useMemo(() => {
    if (selectedTopic === "all") {
      // Shuffle and take 20 questions for "All Topics"
      return [...(questions as Question[])]
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
    }
    return (questions as Question[]).filter(
      (q) => q.category === selectedTopic
    );
  }, [selectedTopic]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setView("quiz");
  };

  const handleAnswer = async (correct: boolean, questionId: string) => {
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => prev + 1);

    // Track attempt in database
    const topicId = selectedTopic === "all"
      ? currentQuestion.category
      : selectedTopic;
    const topic = topics.find((t) => t.id === topicId);

    if (topic) {
      await trackAttempt({
        question_id: questionId,
        topic_id: topicId!,
        topic_name: topic.name,
        is_correct: correct,
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
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setView("quiz");
  };

  // Calculate score percentage
  const scorePercentage = answeredQuestions > 0
    ? Math.round((correctAnswers / answeredQuestions) * 100)
    : 0;

  const isPassing = scorePercentage >= 70;

  // Get unique categories from questions for topic filtering
  const categoriesWithQuestions = useMemo(() => {
    const cats = new Set((questions as Question[]).map((q) => q.category));
    return Array.from(cats);
  }, []);

  // Filter topics that have questions
  const availableTopics = topics.filter((t) =>
    categoriesWithQuestions.includes(t.id)
  );

  if (view === "select") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold mb-2">Practice Mode</h1>
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
                    {(questions as Question[]).length} questions
                  </Badge>
                </div>
              </div>
            </button>

            {/* Individual Topic Cards */}
            {availableTopics.map((topic) => {
              const Icon = topic.icon;
              const questionCount = (questions as Question[]).filter(
                (q) => q.category === topic.id
              ).length;

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
