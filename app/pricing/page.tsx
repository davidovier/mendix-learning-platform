import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { PricingToggle } from "@/components/pricing/pricing-toggle";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Choose the plan that fits your Mendix certification preparation needs. Free tier available, Pro unlocks unlimited access.",
};

const features = [
  { name: "Practice questions", free: "10/day", pro: "Unlimited" },
  { name: "Exam simulations", free: "1/week", pro: "Unlimited" },
  { name: "Progress tracking", free: "Basic", pro: "Full analytics" },
  { name: "Study flashcards", free: "1 topic", pro: "All topics" },
  { name: "Quick reference cheatsheet", free: "Preview", pro: "Full access" },
  { name: "AI Study Tutor", free: false, pro: true },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you need unlimited access to pass your
            Mendix Intermediate Certification.
          </p>
        </div>

        <PricingToggle />

        {/* Feature Comparison */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-center mb-8">
            Compare Plans
          </h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 text-sm font-medium">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center">Pro</div>
            </div>
            {features.map((feature, i) => (
              <div
                key={feature.name}
                className={`grid grid-cols-3 p-4 text-sm ${
                  i % 2 === 0 ? "bg-background" : "bg-muted/30"
                }`}
              >
                <div className="font-medium">{feature.name}</div>
                <div className="text-center text-muted-foreground">
                  {typeof feature.free === "boolean" ? (
                    feature.free ? (
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    ) : (
                      <X className="h-4 w-4 mx-auto text-muted-foreground/50" />
                    )
                  ) : (
                    feature.free
                  )}
                </div>
                <div className="text-center">
                  {typeof feature.pro === "boolean" ? (
                    feature.pro ? (
                      <Check className="h-4 w-4 mx-auto text-green-500" />
                    ) : (
                      <X className="h-4 w-4 mx-auto text-muted-foreground/50" />
                    )
                  ) : (
                    <span className="text-primary font-medium">
                      {feature.pro}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-2xl mx-auto">
            <div>
              <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. You&apos;ll
                continue to have Pro access until the end of your billing
                period.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, iDEAL, and Bancontact through
                our secure payment provider Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                Is the free tier really free?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes! The free tier includes 10 practice questions per day and 1
                exam simulation per week. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
