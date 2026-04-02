"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = {
  free: {
    name: "Free",
    description: "Get started with basic features",
    features: [
      "10 practice questions per day",
      "1 exam simulation per week",
      "Basic progress tracking",
      "1 flashcard topic",
      "Cheatsheet preview",
    ],
  },
  pro: {
    name: "Pro Lifetime",
    description: "Everything you need to pass - forever",
    price: 49.99,
    features: [
      "Unlimited practice questions",
      "Unlimited exam simulations",
      "Full progress analytics",
      "All flashcard topics",
      "Complete cheatsheet access",
      "AI Study Tutor",
      "Lifetime access - one-time payment",
    ],
  },
};

export function PricingToggle() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.error) {
        if (response.status === 401) {
          router.push("/login?redirectTo=/pricing");
          return;
        }
        throw new Error(data.error);
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Free Plan */}
        <div className="border border-border rounded-xl p-6 bg-card">
          <h3 className="text-lg font-semibold">{plans.free.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {plans.free.description}
          </p>
          <div className="mt-4">
            <span className="text-3xl font-bold">€0</span>
            <span className="text-muted-foreground">/forever</span>
          </div>
          <Button variant="outline" className="w-full mt-6" disabled>
            Current Plan
          </Button>
          <ul className="mt-6 space-y-3">
            {plans.free.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Lifetime Plan */}
        <div className="border-2 border-primary rounded-xl p-6 bg-card relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1">
              <Sparkles className="h-3 w-3" />
              Best Value
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{plans.pro.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {plans.pro.description}
          </p>
          <div className="mt-4">
            <span className="text-3xl font-bold">€{plans.pro.price.toFixed(2)}</span>
            <span className="text-muted-foreground ml-1">one-time</span>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              <Infinity className="h-3 w-3" />
              <span>Pay once, access forever</span>
            </div>
          </div>
          <Button
            className="w-full mt-6"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Get Lifetime Access"}
          </Button>
          <ul className="mt-6 space-y-3">
            {plans.pro.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
