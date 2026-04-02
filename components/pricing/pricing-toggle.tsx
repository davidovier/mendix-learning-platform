"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    name: "Pro",
    description: "Everything you need to pass",
    monthly: {
      price: 14.99,
      interval: "month",
    },
    annual: {
      price: 49.99,
      monthlyEquivalent: 4.17,
      interval: "year",
      savings: "Save 72%",
    },
    features: [
      "Unlimited practice questions",
      "Unlimited exam simulations",
      "Full progress analytics",
      "All flashcard topics",
      "Complete cheatsheet access",
      "AI Study Tutor",
    ],
  },
};

export function PricingToggle() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: isAnnual ? "annual" : "monthly" }),
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
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span
          className={cn(
            "text-sm font-medium",
            !isAnnual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            isAnnual ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              isAnnual ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm font-medium",
            isAnnual ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Annual
        </span>
        {isAnnual && (
          <Badge variant="secondary" className="text-xs">
            Save 72%
          </Badge>
        )}
      </div>

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

        {/* Pro Plan */}
        <div className="border-2 border-primary rounded-xl p-6 bg-card relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="gap-1">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          </div>
          <h3 className="text-lg font-semibold">{plans.pro.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {plans.pro.description}
          </p>
          <div className="mt-4">
            {isAnnual ? (
              <>
                <span className="text-3xl font-bold">
                  €{plans.pro.annual.monthlyEquivalent.toFixed(2)}
                </span>
                <span className="text-muted-foreground">/month</span>
                <div className="text-xs text-muted-foreground mt-1">
                  €{plans.pro.annual.price.toFixed(2)} billed annually
                </div>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold">
                  €{plans.pro.monthly.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">/month</span>
              </>
            )}
          </div>
          <Button
            className="w-full mt-6"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Upgrade to Pro"}
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
