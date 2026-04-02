"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/actions";

interface TrackAttemptData {
  question_id: string;
  topic_id: string;
  topic_name: string;
  is_correct: boolean;
  time_spent_seconds?: number;
}

export async function trackAttempt(data: TrackAttemptData) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const [attemptResult, progressResult] = await Promise.all([
    supabase.from("question_attempts").insert({
      user_id: user.id,
      question_id: data.question_id,
      topic_id: data.topic_id,
      is_correct: data.is_correct,
      time_spent_seconds: data.time_spent_seconds,
    }),
    supabase
      .from("progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("topic_id", data.topic_id)
      .single(),
  ]);

  if (attemptResult.error) {
    console.error("Error tracking attempt:", attemptResult.error);
    return { error: "Failed to track attempt" };
  }

  const existingProgress = progressResult.data;
  const newCompleted = (existingProgress?.completed_questions || 0) + 1;
  const newCorrect = (existingProgress?.correct_answers || 0) + (data.is_correct ? 1 : 0);
  const newMastery = Math.round((newCorrect / newCompleted) * 100);

  if (existingProgress) {
    const { error } = await supabase
      .from("progress")
      .update({
        completed_questions: newCompleted,
        correct_answers: newCorrect,
        mastery_level: newMastery,
        last_studied_at: new Date().toISOString(),
      })
      .eq("id", existingProgress.id);
    if (error) console.error("Error updating progress:", error);
  } else {
    const { error } = await supabase.from("progress").insert({
      user_id: user.id,
      topic_id: data.topic_id,
      topic_name: data.topic_name,
      completed_questions: 1,
      correct_answers: data.is_correct ? 1 : 0,
      mastery_level: data.is_correct ? 100 : 0,
      last_studied_at: new Date().toISOString(),
    });
    if (error) console.error("Error inserting progress:", error);
  }

  return { success: true, mastery: newMastery };
}

export async function createExamSession(examType: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_sessions")
    .insert({
      user_id: user.id,
      exam_type: examType,
      score: 0,
      total_questions: 50,
      passing_score: 70,
      passed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating exam session:", error);
    return { error: "Failed to create exam session" };
  }

  return { success: true, sessionId: data.id };
}

interface CompleteExamData {
  sessionId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, boolean>;
  timeSpentSeconds: number;
}

export async function completeExamSession(data: CompleteExamData) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();
  const passed = (data.score / data.totalQuestions) * 100 >= 70;

  const { error } = await supabase
    .from("exam_sessions")
    .update({
      score: data.score,
      total_questions: data.totalQuestions,
      passed,
      answers: data.answers,
      time_spent_seconds: data.timeSpentSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq("id", data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error completing exam:", error);
    return { error: "Failed to save exam results" };
  }

  return { success: true, passed };
}

export async function resetProgress() {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const [progressResult, attemptsResult, examsResult] = await Promise.all([
    supabase.from("progress").delete().eq("user_id", user.id),
    supabase.from("question_attempts").delete().eq("user_id", user.id),
    supabase.from("exam_sessions").delete().eq("user_id", user.id),
  ]);

  const errors = [progressResult.error, attemptsResult.error, examsResult.error].filter(Boolean);

  if (errors.length > 0) {
    console.error("Errors resetting progress:", errors);
    return { error: "Failed to reset some data" };
  }

  return { success: true };
}
