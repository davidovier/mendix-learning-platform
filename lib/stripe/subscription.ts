"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe, FREE_TIER_LIMITS } from "./config";
import type { Subscription, UsageTracking } from "@/lib/db/types";

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as Subscription;
}

export async function isProUser(userId: string): Promise<boolean> {
  const subscription = await getSubscription(userId);
  if (!subscription) return false;

  return (
    subscription.status === "active" ||
    subscription.status === "trialing"
  );
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const supabase = await createClient();

  // Check if customer already exists
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  // Store customer ID
  await supabase.from("subscriptions").upsert({
    user_id: userId,
    stripe_customer_id: customer.id,
    status: "incomplete",
    cancel_at_period_end: false,
    updated_at: new Date().toISOString(),
  });

  return customer.id;
}

// Usage tracking for free tier limits
export async function getTodayUsage(userId: string): Promise<UsageTracking | null> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  return data as UsageTracking | null;
}

export async function getWeekUsage(userId: string): Promise<number> {
  const supabase = await createClient();

  // Get date 7 days ago
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const { data } = await supabase
    .from("usage_tracking")
    .select("exams_taken")
    .eq("user_id", userId)
    .gte("date", weekAgoStr);

  if (!data) return 0;
  return data.reduce((sum, row) => sum + (row.exams_taken || 0), 0);
}

export async function incrementQuestionUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  // Upsert today's usage
  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("questions_answered")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({
        questions_answered: existing.questions_answered + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("date", today);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      questions_answered: 1,
      exams_taken: 0,
    });
  }
}

export async function incrementExamUsage(userId: string): Promise<void> {
  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("usage_tracking")
    .select("exams_taken")
    .eq("user_id", userId)
    .eq("date", today)
    .single();

  if (existing) {
    await supabase
      .from("usage_tracking")
      .update({
        exams_taken: existing.exams_taken + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("date", today);
  } else {
    await supabase.from("usage_tracking").insert({
      user_id: userId,
      date: today,
      questions_answered: 0,
      exams_taken: 1,
    });
  }
}

export async function canAnswerQuestion(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  // Check if pro user first
  if (await isProUser(userId)) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const usage = await getTodayUsage(userId);
  const used = usage?.questions_answered || 0;
  const limit = FREE_TIER_LIMITS.questionsPerDay;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

export async function canTakeExam(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  if (await isProUser(userId)) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const weekExams = await getWeekUsage(userId);
  const limit = FREE_TIER_LIMITS.examsPerWeek;
  const remaining = Math.max(0, limit - weekExams);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}
