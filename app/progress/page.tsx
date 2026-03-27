import Link from "next/link";
import { Flame, Target, TrendingUp, Calendar, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getUser } from "@/lib/supabase/actions";
import { getUserProgress, getDashboardStats, getRecommendations, getExamHistory } from "@/lib/db/queries";
import { topics } from "@/lib/content/topics";
import { cn } from "@/lib/utils";

export default async function ProgressPage() {
  const user = await getUser();

  if (!user) {
    return null; // Middleware should have redirected
  }

  const [progress, stats, examHistory] = await Promise.all([
    getUserProgress(user.id),
    getDashboardStats(user.id),
    getExamHistory(user.id),
  ]);

  const recommendations = getRecommendations(progress);

  // Create a map for easy lookup
  const progressMap = new Map(progress.map((p) => [p.topic_id, p]));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your learning journey and focus on areas that need improvement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Questions Answered
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Accuracy
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Days
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudyDays}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {(recommendations.weak.length > 0 || recommendations.unexplored.length > 0) && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Lightbulb className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.weak.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-amber-900 dark:text-amber-100">
                    Focus on these weak topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.weak.map((topic) => (
                      <Badge
                        key={topic.topic_id}
                        variant="outline"
                        className="border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300"
                      >
                        {topic.topic_name} ({topic.mastery_level}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.unexplored.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-amber-900 dark:text-amber-100">
                    Start learning these topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.unexplored.slice(0, 3).map((topic) => (
                      <Badge key={topic.id} variant="secondary">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.suggested && (
                <Link
                  href={`/practice?topic=${recommendations.suggested.id}`}
                  className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80 mt-2"
                >
                  Practice {recommendations.suggested.name}
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* Topic Progress Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Topic Mastery</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => {
              const topicProgress = progressMap.get(topic.id);
              const mastery = topicProgress?.mastery_level || 0;
              const completed = topicProgress?.completed_questions || 0;
              const correct = topicProgress?.correct_answers || 0;

              return (
                <Card key={topic.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <topic.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          mastery >= 70
                            ? "text-emerald-600"
                            : mastery >= 50
                              ? "text-amber-600"
                              : mastery > 0
                                ? "text-rose-600"
                                : "text-muted-foreground"
                        )}
                      >
                        {mastery}%
                      </span>
                    </div>
                    <Progress
                      value={mastery}
                      className={cn(
                        "h-2",
                        mastery >= 70
                          ? "[&>div]:bg-emerald-500"
                          : mastery >= 50
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-rose-500"
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completed > 0
                        ? `${correct}/${completed} correct`
                        : "Not started"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Exam History */}
        {examHistory.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Exam History</h2>
            <div className="space-y-3">
              {examHistory.slice(0, 5).map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">
                        Score: {exam.score}/{exam.total_questions} (
                        {Math.round((exam.score / exam.total_questions) * 100)}%)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exam.completed_at!).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={exam.passed ? "default" : "destructive"}>
                      {exam.passed ? "PASSED" : "FAILED"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
