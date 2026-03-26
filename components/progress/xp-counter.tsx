interface XPCounterProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
}

export function XPCounter({ xp, level, xpToNextLevel }: XPCounterProps) {
  const progress = (xp % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl">
      <div className="text-4xl">⭐</div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">{xp.toLocaleString()} XP</span>
          <span className="text-sm text-muted-foreground">Level {level}</span>
        </div>
        <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {xpToNextLevel - (xp % xpToNextLevel)} XP to next level
        </p>
      </div>
    </div>
  );
}
