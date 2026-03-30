"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function StartExamButton() {
  const router = useRouter();

  const handleStartExam = () => {
    const examId = uuidv4();
    router.push(`/exam/${examId}`);
  };

  return (
    <Button size="lg" onClick={handleStartExam} className="w-full">
      Start Exam
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  );
}
