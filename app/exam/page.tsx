"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileQuestion, Target, ArrowRight, Shuffle, Navigation } from "lucide-react";

export default function ExamStartPage() {
  const router = useRouter();

  const handleStartExam = () => {
    const examId = uuidv4();
    router.push(`/exam/${examId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header matching exam page style */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Exam</h1>
            <Badge variant="outline">Simulation</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">90:00</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_250px]">
          {/* Main Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileQuestion className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-semibold">50</div>
                      <div className="text-xs text-muted-foreground">Questions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-semibold">90</div>
                      <div className="text-xs text-muted-foreground">Minutes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-lg font-semibold">70%</div>
                      <div className="text-xs text-muted-foreground">To Pass</div>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Shuffle className="h-4 w-4 shrink-0" />
                    <span>Questions randomly selected from all topics</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Navigation className="h-4 w-4 shrink-0" />
                    <span>Navigate freely and change answers anytime</span>
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  size="lg"
                  onClick={handleStartExam}
                  className="w-full"
                >
                  Start Exam
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Side Card - Preview */}
          <Card className="h-fit">
            <CardContent className="pt-6">
              <div className="text-sm font-medium mb-3">Question Navigator</div>
              <div className="grid grid-cols-5 gap-2 opacity-50">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded text-sm font-medium bg-muted flex items-center justify-center text-muted-foreground"
                  >
                    {i + 1}
                  </div>
                ))}
                <div className="col-span-5 text-center text-xs text-muted-foreground mt-1">
                  ···
                </div>
              </div>
              <div className="mt-4 pt-4 border-t space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted"></div>
                  <span>Unanswered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
