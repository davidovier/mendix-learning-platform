export interface Progress {
  id: string;
  user_id: string;
  topic_id: string;
  topic_name: string;
  completed_questions: number;
  total_questions: number;
  correct_answers: number;
  mastery_level: number;
  last_studied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  topic_id: string;
  is_correct: boolean;
  time_spent_seconds: number | null;
  attempt_number: number;
  created_at: string;
}

export interface ExamSession {
  id: string;
  user_id: string;
  exam_type: string;
  score: number;
  total_questions: number;
  passing_score: number;
  passed: boolean;
  time_spent_seconds: number | null;
  answers: Record<string, boolean> | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface TopicStats {
  topic_id: string;
  topic_name: string;
  completed_questions: number;
  correct_answers: number;
  mastery_level: number;
  last_studied_at: string | null;
}

export interface Recommendations {
  unexplored: { id: string; name: string }[];
  weak: TopicStats[];
  suggested: { id: string; name: string } | null;
}

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"
  | "paused";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  questions_answered: number;
  exams_taken: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  is_admin: boolean;
  capgemini_status: "pending" | "approved" | null;
  capgemini_requested_at: string | null;
  capgemini_reviewed_at: string | null;
  capgemini_reviewed_by: string | null;
  created_at: string;
}
