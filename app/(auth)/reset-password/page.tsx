"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword, updatePassword } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user arrived via magic link (has valid session from reset)
  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      // If there's a session and we have a code/token in URL, show update form
      if (session || searchParams.get("code")) {
        setMode("update");
      }
    }
    checkSession();
  }, [searchParams]);

  async function handleRequestReset(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }
    setLoading(false);
  }

  async function handleUpdatePassword(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await updatePassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          {mode === "request"
            ? "Enter your email to receive a reset link"
            : "Enter your new password"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
            {success}
          </div>
        )}

        {mode === "request" ? (
          <form action={handleRequestReset} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        ) : (
          <form action={handleUpdatePassword} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function ResetPasswordFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>Loading...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
