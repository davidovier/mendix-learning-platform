export interface StreakUpdate {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_start_date: string | null;
  total_study_days: number;
  changed: boolean;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function calculateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null,
  streakStartDate: string | null,
  totalStudyDays: number
): StreakUpdate {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  if (lastActivityDate) {
    const lastDate = new Date(lastActivityDate);

    // Already active today
    if (isSameDay(lastDate, today)) {
      return {
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity_date: lastActivityDate,
        streak_start_date: streakStartDate,
        total_study_days: totalStudyDays,
        changed: false,
      };
    }

    // Was active yesterday - continue streak
    if (isYesterday(lastDate, today)) {
      const newCurrent = currentStreak + 1;
      return {
        current_streak: newCurrent,
        longest_streak: Math.max(longestStreak, newCurrent),
        last_activity_date: todayStr,
        streak_start_date: streakStartDate,
        total_study_days: totalStudyDays + 1,
        changed: true,
      };
    }
  }

  // Streak broken or first activity
  return {
    current_streak: 1,
    longest_streak: Math.max(longestStreak, 1),
    last_activity_date: todayStr,
    streak_start_date: todayStr,
    total_study_days: totalStudyDays + 1,
    changed: true,
  };
}
