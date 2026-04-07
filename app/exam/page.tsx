import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileQuestion, Target, Shuffle, Navigation } from "lucide-react";
import { StartExamButton } from "@/components/exam/start-exam-button";
import { getUsageStatus } from "@/lib/stripe/usage-actions";
import { UpgradePrompt, UsageLimitBanner } from "@/components/upgrade-prompt";

export const metadata: Metadata = {
  title: "Mock Exam - Timed Mendix Certification Simulation",
  description:
    "Simulate the real exam with timed 50-question tests. Track your readiness for Mendix Intermediate certification under realistic conditions.",
  keywords: [
    "mendix mock exam",
    "mendix exam simulator",
    "mendix certification test",
    "mendix timed exam",
  ],
};

// Dynamic page - needs to check user-specific usage limits
export const dynamic = "force-dynamic";

export default async function ExamStartPage() {
  const usageStatus = await getUsageStatus();
  const canTakeExam = usageStatus?.exams.allowed ?? true;
  const examsRemaining = usageStatus?.exams.remaining ?? Infinity;
  const examsLimit = usageStatus?.exams.limit ?? 1;
  const isPro = usageStatus?.isPro ?? false;

  // Show upgrade prompt if weekly limit reached
  if (!canTakeExam && !isPro) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <UpgradePrompt
            title="Weekly Exam Limit Reached"
            description="Free accounts can take 1 exam simulation per week. Upgrade to Pro for unlimited exam practice."
            feature="exam simulations"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Usage limit banner for free users */}
        {usageStatus && !isPro && (
          <div className="mb-6 max-w-xl mx-auto">
            <UsageLimitBanner
              remaining={examsRemaining}
              limit={examsLimit}
              unit="exam"
              period="this week"
            />
          </div>
        )}

        {/* Page Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 sm:mb-4">
            Ready for the Challenge?
          </h1>
          <p className="text-muted-foreground">
            Test your Mendix knowledge under real exam conditions
          </p>
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
                <StartExamButton />
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
