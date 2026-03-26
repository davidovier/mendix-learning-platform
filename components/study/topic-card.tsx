import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  return (
    <Link href={`/study/${topic.id}`}>
      <Card className="h-full transition-all hover:border-primary hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="text-3xl mb-2">{topic.icon}</div>
          <CardTitle className="text-lg">{topic.name}</CardTitle>
          <CardDescription className="text-sm">
            {topic.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {flashcardCount} cards
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
