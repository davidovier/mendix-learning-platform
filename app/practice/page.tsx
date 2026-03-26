"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "@/components/practice/question-card";
import { topics } from "@/lib/content/topics";
import questions from "@/content/questions.json";

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

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => prev + 1);
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
            <p className="text-muted-foreground">
              Select a topic to practice or test your knowledge across all topics
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* All Topics Card */}
            <Card
              className="cursor-pointer transition-all hover:ring-2 hover:ring-primary"
              onClick={() => handleTopicSelect("all")}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <CardTitle>All Topics</CardTitle>
                    <CardDescription>
                      20 random questions from all categories
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {(questions as Question[]).length} questions total
                </Badge>
              </CardContent>
            </Card>

            {/* Individual Topic Cards */}
            {availableTopics.map((topic) => {
              const questionCount = (questions as Question[]).filter(
                (q) => q.category === topic.id
              ).length;

              return (
                <Card
                  key={topic.id}
                  className="cursor-pointer transition-all hover:ring-2 hover:ring-primary"
                  onClick={() => handleTopicSelect(topic.id)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <CardTitle>{topic.name}</CardTitle>
                        <CardDescription>{topic.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">
                      {questionCount} questions
                    </Badge>
                  </CardContent>
                </Card>
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
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
              <CardDescription>{topicName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <Progress
                value={scorePercentage}
                className="h-3"
              />

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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
