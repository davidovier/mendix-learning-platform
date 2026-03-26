"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ExamTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
}

export function ExamTimer({ totalSeconds, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback ref up to date in an effect
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUpRef.current();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isLow = secondsLeft < 300; // Less than 5 minutes

  return (
    <div
      className={cn(
        "font-mono text-lg font-bold px-4 py-2 rounded-lg",
        isLow ? "bg-red-100 text-red-700" : "bg-muted"
      )}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </div>
  );
}
