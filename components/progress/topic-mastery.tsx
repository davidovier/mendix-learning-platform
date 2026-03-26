"use client";

import { Progress } from "@/components/ui/progress";
import { topics } from "@/lib/content/topics";

interface TopicMasteryProps {
  masteryData: Record<string, number>;
}

export function TopicMastery({ masteryData }: TopicMasteryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Topic Mastery</h3>
      <div className="space-y-3">
        {topics.map((topic) => {
          const mastery = masteryData[topic.id] ?? 0;
          return (
            <div key={topic.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{topic.icon}</span>
                  <span>{topic.name}</span>
                </span>
                <span className="font-medium">{mastery}%</span>
              </div>
              <Progress value={mastery} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
