interface StreakFlameProps {
  days: number;
}

export function StreakFlame({ days }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl">
      <div className="text-4xl animate-flame">🔥</div>
      <div>
        <div className="text-2xl font-bold">{days} day{days !== 1 && "s"}</div>
        <p className="text-sm text-muted-foreground">
          {days > 0 ? "Keep it going!" : "Start your streak!"}
        </p>
      </div>
    </div>
  );
}
