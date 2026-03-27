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

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_start_date: string | null;
  total_study_days: number;
  created_at: string;
  updated_at: string;
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
