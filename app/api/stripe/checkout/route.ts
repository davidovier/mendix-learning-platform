import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS } from "@/lib/stripe/config";
import { getOrCreateStripeCustomer } from "@/lib/stripe/subscription";

interface CheckoutRequestBody {
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body for UTM params
    let utm: CheckoutRequestBody["utm"] = {};
    try {
      const body = (await request.json()) as CheckoutRequestBody;
      utm = body.utm || {};
    } catch {
      // No body or invalid JSON - continue without UTM
    }

    const priceId = PLANS.pro.price.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card", "ideal", "bancontact"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/account?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        ...(utm?.utm_source && { utm_source: utm.utm_source }),
        ...(utm?.utm_medium && { utm_medium: utm.utm_medium }),
        ...(utm?.utm_campaign && { utm_campaign: utm.utm_campaign }),
        ...(utm?.utm_term && { utm_term: utm.utm_term }),
        ...(utm?.utm_content && { utm_content: utm.utm_content }),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
