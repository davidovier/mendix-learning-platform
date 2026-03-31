import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/stripe/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubscriptionActions } from "@/components/account/subscription-actions";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account and subscription settings.",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/account");
  }

  const subscription = await getSubscription(user.id);
  const isActive = subscription?.status === "active";
  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and subscription
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Account created</div>
              <div className="font-medium">
                {new Date(user.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Subscription</CardTitle>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Pro" : "Free"}
              </Badge>
            </div>
            <CardDescription>
              {isActive
                ? "You have full access to all features"
                : "Upgrade to Pro for unlimited access"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isActive && periodEnd && (
              <div>
                <div className="text-sm text-muted-foreground">
                  {subscription?.cancel_at_period_end
                    ? "Access until"
                    : "Next billing date"}
                </div>
                <div className="font-medium">
                  {periodEnd.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {subscription?.cancel_at_period_end && (
                  <p className="text-sm text-amber-600 mt-1">
                    Your subscription will not renew
                  </p>
                )}
              </div>
            )}

            <SubscriptionActions
              hasSubscription={!!subscription?.stripe_customer_id}
              isActive={isActive}
            />
          </CardContent>
        </Card>

        {/* Usage Card for Free Users */}
        {!isActive && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Free Tier Limits</CardTitle>
              <CardDescription>
                Your current usage restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Practice questions</span>
                  <span>10 per day</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Exam simulations</span>
                  <span>1 per week</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Flashcard topics</span>
                  <span>1 topic</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
