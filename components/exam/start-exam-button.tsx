"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { checkAndIncrementExamUsage } from "@/lib/stripe/usage-actions";

export function StartExamButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartExam = async () => {
    setIsLoading(true);
    try {
      // Check and increment exam usage
      const result = await checkAndIncrementExamUsage();
      if (!result.allowed) {
        // Refresh the page to show the limit reached UI
        router.refresh();
        return;
      }

      const examId = uuidv4();
      router.push(`/exam/${examId}`);
    } catch (error) {
      console.error("Failed to start exam:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleStartExam} disabled={isLoading} className="w-full">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Starting...
        </>
      ) : (
        <>
          Start Exam
          <ArrowRight className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  );
}
