"use client";

import Link from "next/link";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  title: string;
  description: string;
  feature: string;
}

export function UpgradePrompt({ title, description, feature }: UpgradePromptProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      <Button render={<Link href="/pricing" />} className="gap-2">
        <Sparkles className="w-4 h-4" />
        Upgrade to Pro
      </Button>
      <p className="text-xs text-muted-foreground mt-4">
        Unlock unlimited {feature} with Pro
      </p>
    </div>
  );
}

interface UsageLimitBannerProps {
  remaining: number;
  limit: number;
  unit: string;
  period: string;
}

export function UsageLimitBanner({
  remaining,
  limit,
  unit,
  period,
}: UsageLimitBannerProps) {
  if (remaining === Infinity) return null;

  const percentage = ((limit - remaining) / limit) * 100;
  const isLow = remaining <= 2;

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm ${
        isLow
          ? "bg-amber-500/10 border border-amber-500/20"
          : "bg-muted/50 border border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isLow ? "bg-amber-500" : "bg-primary"
          }`}
        />
        <span className={isLow ? "text-amber-600" : "text-muted-foreground"}>
          {remaining} {unit} remaining {period}
        </span>
      </div>
      <Link
        href="/pricing"
        className="text-primary hover:underline text-xs font-medium"
      >
        Get unlimited
      </Link>
    </div>
  );
}
