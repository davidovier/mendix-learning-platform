"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SubscriptionActionsProps {
  hasSubscription: boolean;
  isActive: boolean;
}

export function SubscriptionActions({
  hasSubscription,
  isActive,
}: SubscriptionActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const openPortal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("Failed to open billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isActive) {
    return (
      <Button variant="outline" onClick={openPortal} disabled={isLoading}>
        {isLoading ? "Loading..." : "Manage Subscription"}
      </Button>
    );
  }

  if (hasSubscription) {
    return (
      <div className="flex gap-3">
        <Button render={<Link href="/pricing" />}>Upgrade to Pro</Button>
        <Button variant="outline" onClick={openPortal} disabled={isLoading}>
          {isLoading ? "Loading..." : "Billing History"}
        </Button>
      </div>
    );
  }

  return (
    <Button render={<Link href="/pricing" />}>Upgrade to Pro</Button>
  );
}
