"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Infinity } from "lucide-react";

interface SubscriptionActionsProps {
  hasSubscription: boolean;
  isActive: boolean;
  isLifetime: boolean;
}

export function SubscriptionActions({
  hasSubscription,
  isActive,
  isLifetime,
}: SubscriptionActionsProps) {
  // Lifetime users don't need to manage anything - one-time payment, forever access
  if (isActive && isLifetime) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
        <Infinity className="h-4 w-4" />
        <span>Lifetime access - no billing to manage</span>
      </div>
    );
  }

  if (isActive) {
    // This would be for recurring subscriptions (not currently used)
    return null;
  }

  if (hasSubscription) {
    return (
      <Button render={<Link href="/pricing" />}>Upgrade to Pro</Button>
    );
  }

  return (
    <Button render={<Link href="/pricing" />}>Upgrade to Pro</Button>
  );
}
