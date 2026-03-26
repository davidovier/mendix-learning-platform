import { Star } from "lucide-react";

interface XPCounterProps {
  xp: number;
  level: number;
  xpToNextLevel: number;
}

export function XPCounter({ xp, level, xpToNextLevel }: XPCounterProps) {
  const progress = (xp % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="flex items-center gap-4 p-4 border border-border bg-card rounded-lg">
      <Star className="h-10 w-10 text-primary" />
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">{xp.toLocaleString()} XP</span>
          <span className="text-sm text-muted-foreground">Level {level}</span>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
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
