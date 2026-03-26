import { Flame } from "lucide-react";

interface StreakFlameProps {
  days: number;
}

export function StreakFlame({ days }: StreakFlameProps) {
  return (
    <div className="flex items-center gap-3 p-4 border border-border bg-card rounded-lg">
      <Flame className="h-10 w-10 text-primary" />
      <div>
        <div className="text-2xl font-bold">{days} day{days !== 1 && "s"}</div>
        <p className="text-sm text-muted-foreground">
          {days > 0 ? "Keep it going!" : "Start your streak!"}
        </p>
      </div>
    </div>
  );
}
