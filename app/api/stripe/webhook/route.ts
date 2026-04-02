import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";
import { createClient } from "@/lib/supabase/server";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function grantLifetimeAccess(customerId: string, paymentId: string) {
  const supabase = await createClient();

  // Find the user by stripe_customer_id
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!existing) {
    console.error("No subscription record found for customer:", customerId);
    return;
  }

  // Grant lifetime access
  await supabase
    .from("subscriptions")
    .update({
      status: "active",
      stripe_subscription_id: paymentId, // Store payment ID for reference
      price_id: "lifetime",
      current_period_start: new Date().toISOString(),
      current_period_end: null, // Null = lifetime access
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  console.log("Granted lifetime access to customer:", customerId);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle one-time payment
        if (session.mode === "payment" && session.payment_status === "paid") {
          const customerId = session.customer as string;
          const paymentIntentId = session.payment_intent as string;
          await grantLifetimeAccess(customerId, paymentIntentId);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment succeeded:", paymentIntent.id);
        // Lifetime access is granted via checkout.session.completed
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
