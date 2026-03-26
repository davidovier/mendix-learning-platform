"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ExamStartPage() {
  const router = useRouter();

  const handleStartExam = () => {
    const examId = uuidv4();
    router.push(`/exam/${examId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Exam Simulation</h1>
          <p className="text-muted-foreground">
            Test your knowledge under real exam conditions
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              This exam simulates the actual Mendix Intermediate Certification exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">50</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">90</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">70%</div>
                <div className="text-sm text-muted-foreground">Pass Score</div>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-2xl font-bold">No</div>
                <div className="text-sm text-muted-foreground">Feedback During Exam</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <span>Warning</span>
              <Badge variant="outline" className="border-amber-500 text-amber-700">
                Exam Mode
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-amber-900">
              <li>- You will not receive feedback on your answers until the exam is complete</li>
              <li>- The timer will continue running even if you navigate away</li>
              <li>- Questions are randomly selected from the entire question pool</li>
              <li>- You can navigate between questions and change your answers</li>
              <li>- Submit the exam only when you are ready to see your results</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleStartExam} className="px-8">
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
