"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "@/lib/supabase/actions";
import { validatePassword } from "@/lib/security/password-validator";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const password = formData.get("password") as string;
    const validation = validatePassword(password);
    if (!validation.valid) {
      setPasswordError(validation.errors[0]);
      setLoading(false);
      return;
    }
    setPasswordError(null);

    const result = await signUpWithEmail(formData);

    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
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

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
        />
        {passwordError && (
          <p className="text-xs text-rose-600">{passwordError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Minimum 8 characters
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
