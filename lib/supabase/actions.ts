"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { validatePassword } from "@/lib/security/password-validator";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }
  if (typeof password !== "string" || !password) {
    return { error: "Password is required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Validate redirect to prevent open redirect attacks
  const safeRedirect =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : "/";
  redirect(safeRedirect);
}

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }
  if (typeof password !== "string" || !password) {
    return { error: "Password is required" };
  }

  const validation = validatePassword(password);
  if (!validation.valid) {
    return { error: validation.errors[0] };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  const isCapgemini = email.trim().toLowerCase().endsWith("@capgemini.com");
  const successMessage = isCapgemini
    ? "Check your email to confirm your account. We detected your Capgemini email — once confirmed, your request for free colleague access will be reviewed by an admin."
    : "Check your email to confirm your account";

  return { success: successMessage };
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();

  // Validate redirect to prevent open redirect attacks
  const safeRedirect =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : "/";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${safeRedirect}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Failed to get OAuth redirect URL" };
}

export async function resetPassword(formData: FormData) {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a password reset link" };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return { error: "Password is required" };
  }

  const validation = validatePassword(password);
  if (!validation.valid) {
    return { error: validation.errors[0] };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?message=Password updated successfully");
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
