import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Topic } from "@/lib/content/topics";

interface TopicCardProps {
  topic: Topic;
  progress?: number;
  flashcardCount: number;
}

export function TopicCard({
  topic,
  progress = 0,
  flashcardCount,
}: TopicCardProps) {
  const Icon = topic.icon;

  return (
    <Link href={`/study/${topic.id}`} className="group block">
      <div className="h-full p-5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/30 transition-all duration-200">
        <Icon className="h-5 w-5 text-primary mb-3" />
        <h3 className="font-medium text-foreground mb-1">{topic.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{flashcardCount} cards</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </div>
    </Link>
  );
}
