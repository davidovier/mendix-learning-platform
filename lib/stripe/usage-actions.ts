"use server";

import { createClient } from "@/lib/supabase/server";
import {
  canAnswerQuestion,
  canTakeExam,
  incrementQuestionUsage,
  incrementExamUsage,
  isProUser,
} from "./subscription";

export interface UsageStatus {
  isPro: boolean;
  questions: {
    allowed: boolean;
    remaining: number;
    limit: number;
  };
  exams: {
    allowed: boolean;
    remaining: number;
    limit: number;
  };
}

export async function getUsageStatus(): Promise<UsageStatus | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [isPro, questions, exams] = await Promise.all([
    isProUser(user.id),
    canAnswerQuestion(user.id),
    canTakeExam(user.id),
  ]);

  return {
    isPro,
    questions,
    exams,
  };
}

export async function checkAndIncrementQuestionUsage(): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, remaining: 0, limit: 10 };
  }

  const status = await canAnswerQuestion(user.id);

  if (status.allowed) {
    await incrementQuestionUsage(user.id);
    // Return updated remaining count
    return {
      allowed: true,
      remaining: Math.max(0, status.remaining - 1),
      limit: status.limit,
    };
  }

  return status;
}

export async function checkAndIncrementExamUsage(): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false, remaining: 0, limit: 1 };
  }

  const status = await canTakeExam(user.id);

  if (status.allowed) {
    await incrementExamUsage(user.id);
    return {
      allowed: true,
      remaining: Math.max(0, status.remaining - 1),
      limit: status.limit,
    };
  }

  return status;
}
