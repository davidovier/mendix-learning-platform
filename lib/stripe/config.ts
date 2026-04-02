import Stripe from "stripe";

// Lazy initialization to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backward compatibility
export const stripe = {
  get customers() { return getStripe().customers; },
  get subscriptions() { return getStripe().subscriptions; },
  get checkout() { return getStripe().checkout; },
  get billingPortal() { return getStripe().billingPortal; },
  get webhooks() { return getStripe().webhooks; },
} as unknown as Stripe;

export const PLANS = {
  pro: {
    name: "Pro",
    description: "Full access to all features - forever",
    features: [
      "Unlimited practice questions",
      "Unlimited exam simulations",
      "Full progress analytics",
      "Complete cheatsheet access",
      "All study flashcards",
      "AI-powered explanations",
      "Lifetime access - one-time payment",
    ],
    price: {
      amount: 4999, // €49.99 in cents
      currency: "eur",
      priceId: process.env.STRIPE_PRICE_LIFETIME!,
    },
  },
} as const;

export const FREE_TIER_LIMITS = {
  questionsPerDay: 10,
  examsPerWeek: 1,
  flashcardTopics: 1, // Only first topic
  cheatsheetPreview: true, // Limited preview only
} as const;
