import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XPCounter } from "@/components/progress/xp-counter";
import { StreakFlame } from "@/components/progress/streak-flame";
import { TopicMastery } from "@/components/progress/topic-mastery";

const mockProgress = {
  xp: 1250,
  level: 5,
  xpToNextLevel: 500,
  streak: 7,
  examReadiness: 65,
  topicMastery: {
    "domain-model": 80,
    "microflows": 70,
    "security": 55,
    "pages": 45,
    "xpath": 60,
  },
  achievements: [
    { id: "first-card", name: "First Steps", icon: "👶", earned: true },
    { id: "quiz-starter", name: "Quiz Starter", icon: "✍️", earned: true },
    { id: "week-streak", name: "Week Streak", icon: "🔥", earned: true },
    { id: "topic-master", name: "Topic Master", icon: "🎓", earned: false },
    { id: "perfect-exam", name: "Perfect Score", icon: "💯", earned: false },
  ],
  recentActivity: [
    { type: "study", topic: "Domain Model", xp: 50, time: "2h ago" },
    { type: "practice", topic: "Security", xp: 30, time: "5h ago" },
    { type: "exam", score: 72, time: "1d ago" },
  ],
};

export default function ProgressPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <XPCounter
          xp={mockProgress.xp}
          level={mockProgress.level}
          xpToNextLevel={mockProgress.xpToNextLevel}
        />
        <StreakFlame days={mockProgress.streak} />
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
          <div className="text-4xl">🎯</div>
          <div>
            <div className="text-2xl font-bold">{mockProgress.examReadiness}%</div>
            <p className="text-sm text-muted-foreground">Exam Readiness</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Topic Mastery */}
        <Card>
          <CardHeader>
            <CardTitle>Topic Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <TopicMastery masteryData={mockProgress.topicMastery} />
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {mockProgress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    achievement.earned
                      ? "bg-amber-50"
                      : "bg-gray-100 opacity-50"
                  }`}
                  title={achievement.name}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-xs text-center mt-1 truncate w-full">
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockProgress.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {activity.type === "study"
                      ? "📚"
                      : activity.type === "practice"
                      ? "✍️"
                      : "📝"}
                  </span>
                  <div>
                    <p className="font-medium">
                      {activity.type === "exam"
                        ? `Practice Exam - ${activity.score}%`
                        : `${activity.type === "study" ? "Studied" : "Practiced"} ${activity.topic}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
                {"xp" in activity && (
                  <span className="text-sm font-medium text-amber-600">
                    +{activity.xp} XP
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
