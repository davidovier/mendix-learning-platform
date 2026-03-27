import { createClient } from "@/lib/supabase/server";
import { topics } from "@/lib/content/topics";
import type { Progress, Streak, ExamSession, TopicStats, Recommendations } from "./types";

export async function getUserProgress(userId: string): Promise<Progress[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching progress:", error);
    return [];
  }

  return data || [];
}

export async function getUserStreak(userId: string): Promise<Streak | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching streak:", error);
    }
    return null;
  }

  return data;
}

export async function getExamHistory(userId: string): Promise<ExamSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_sessions")
    .select("*")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error fetching exam history:", error);
    return [];
  }

  return data || [];
}

export function getRecommendations(progress: Progress[]): Recommendations {
  const attemptedIds = new Set(progress.map((p) => p.topic_id));

  // Get all topics from content
  const allTopics = topics.map((t) => ({ id: t.id, name: t.name }));

  // Topics never attempted
  const unexplored = allTopics.filter((t) => !attemptedIds.has(t.id));

  // Convert progress to TopicStats
  const topicStats: TopicStats[] = progress.map((p) => ({
    topic_id: p.topic_id,
    topic_name: p.topic_name,
    completed_questions: p.completed_questions,
    correct_answers: p.correct_answers,
    mastery_level: p.mastery_level,
    last_studied_at: p.last_studied_at,
  }));

  // Weak topics (enough data + below threshold), capped at 3
  const weak = topicStats
    .filter((p) => p.completed_questions >= 3 && p.mastery_level < 70)
    .sort((a, b) => a.mastery_level - b.mastery_level)
    .slice(0, 3);

  // Determine suggested topic
  let suggested: { id: string; name: string } | null = null;

  if (weak.length > 0) {
    suggested = allTopics.find((t) => t.id === weak[0].topic_id) || null;
  } else if (unexplored.length > 0) {
    suggested = unexplored[0];
  } else if (topicStats.length > 0) {
    // All good - suggest least recently studied
    const sorted = [...topicStats].sort((a, b) => {
      const aTime = a.last_studied_at ? new Date(a.last_studied_at).getTime() : 0;
      const bTime = b.last_studied_at ? new Date(b.last_studied_at).getTime() : 0;
      return aTime - bTime;
    });
    suggested = allTopics.find((t) => t.id === sorted[0].topic_id) || null;
  }

  return { unexplored, weak, suggested };
}

export interface DashboardStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [progress, streak] = await Promise.all([
    getUserProgress(userId),
    getUserStreak(userId),
  ]);

  const totalQuestions = progress.reduce((sum, p) => sum + p.completed_questions, 0);
  const correctAnswers = progress.reduce((sum, p) => sum + p.correct_answers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    correctAnswers,
    accuracy,
    currentStreak: streak?.current_streak || 0,
    longestStreak: streak?.longest_streak || 0,
    totalStudyDays: streak?.total_study_days || 0,
  };
}
