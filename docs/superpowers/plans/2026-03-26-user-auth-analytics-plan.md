# User Authentication & Learning Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Supabase authentication and learning analytics to track user progress and identify weak topics.

**Architecture:** Supabase Auth with email/password and Google OAuth. Server Actions for data mutations. Middleware-based route protection. Progress tracking with weak-topic identification.

**Tech Stack:** Next.js 16, Supabase Auth, Supabase Database, Server Actions, TypeScript

**Spec:** `docs/superpowers/specs/2026-03-26-user-auth-analytics-design.md`

---

## Prerequisites

Before starting implementation, ensure environment variables are set:

- [ ] **Add NEXT_PUBLIC_SITE_URL to .env.local**

```bash
# Add to .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This is required by auth actions for OAuth redirects.

---

## Task Order

Execute tasks in this order to avoid dependency issues:
1. Supabase Auth Server Actions
2. OAuth Callback Route
3. Auth UI Components
4. Auth Pages
5. Auth Middleware (proxy.ts)
6. **Database Types and Streak Utils** (moved up)
7. **Database Queries** (moved up)
8. **Database Actions** (moved up)
9. UserNav Component (depends on queries)
10. Integrate Tracking into Practice Page
11. Update Progress Page
12. Update Exam Pages
13. Final Verification

---

## File Structure

### New Files
```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── reset-password/page.tsx
├── auth/
│   └── callback/route.ts
├── proxy.ts
components/
├── layout/
│   └── user-nav.tsx
├── auth/
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   └── oauth-buttons.tsx
lib/
├── supabase/
│   └── actions.ts
├── db/
│   ├── types.ts
│   ├── queries.ts
│   ├── actions.ts
│   └── streak-utils.ts
```

### Modified Files
```
app/layout.tsx
app/practice/page.tsx
app/exam/page.tsx
app/exam/[id]/page.tsx
app/progress/page.tsx
components/layout/header.tsx
components/practice/question-card.tsx
```

---

## Task 1: Supabase Auth Server Actions

**Files:**
- Create: `lib/supabase/actions.ts`

- [ ] **Step 1: Create auth actions file with signIn**

```typescript
// lib/supabase/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo || "/");
}
```

- [ ] **Step 2: Add signUp action**

```typescript
export async function signUpWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account" };
}
```

- [ ] **Step 3: Add signOut action**

```typescript
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
```

- [ ] **Step 4: Add Google OAuth action**

```typescript
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${redirectTo || "/"}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}
```

- [ ] **Step 5: Add password reset action**

```typescript
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for a password reset link" };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?message=Password updated successfully");
}
```

- [ ] **Step 6: Add getUser helper**

```typescript
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/actions.ts
git commit -m "feat: add Supabase auth server actions"
```

---

## Task 2: OAuth Callback Route

**Files:**
- Create: `app/auth/callback/route.ts`

- [ ] **Step 1: Create callback route handler**

```typescript
// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(
    new URL("/login?error=Could not authenticate", requestUrl.origin)
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/auth/callback/route.ts
git commit -m "feat: add OAuth callback route handler"
```

---

## Task 3: Auth UI Components

**Files:**
- Create: `components/auth/oauth-buttons.tsx`
- Create: `components/auth/login-form.tsx`
- Create: `components/auth/signup-form.tsx`

- [ ] **Step 1: Create OAuth buttons component**

```typescript
// components/auth/oauth-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/supabase/actions";

interface OAuthButtonsProps {
  redirectTo?: string;
}

export function OAuthButtons({ redirectTo }: OAuthButtonsProps) {
  return (
    <div className="grid gap-2">
      <Button
        variant="outline"
        onClick={() => signInWithGoogle(redirectTo)}
        className="w-full"
      >
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Create login form component**

```typescript
// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/lib/supabase/actions";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    if (redirectTo) {
      formData.append("redirectTo", redirectTo);
    }

    const result = await signInWithEmail(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-4">
      {error && (
        <div className="p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-md">
          {error}
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/reset-password"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create signup form component**

```typescript
// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpWithEmail } from "@/lib/supabase/actions";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

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
          minLength={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          Minimum 6 characters
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/auth/
git commit -m "feat: add auth UI components"
```

---

## Task 4: Auth Pages

**Files:**
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/(auth)/reset-password/page.tsx`

- [ ] **Step 1: Create login page**

```typescript
// app/(auth)/login/page.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string; error?: string; message?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect, error, message } = await searchParams;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 rounded-md">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
              {message}
            </div>
          )}

          <OAuthButtons redirectTo={redirect} />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <LoginForm redirectTo={redirect} />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create signup page**

```typescript
// app/(auth)/signup/page.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "@/components/auth/signup-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";

export default function SignupPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Start tracking your learning progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <OAuthButtons />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <SignupForm />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Create reset password page**

```typescript
// app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword, updatePassword } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"request" | "update">("request");

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
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
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/\(auth\)/
git commit -m "feat: add login, signup, and reset password pages"
```

---

## Task 5: Auth Middleware (proxy.ts)

**Files:**
- Create: `app/proxy.ts`

- [ ] **Step 1: Create proxy.ts middleware**

```typescript
// app/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/practice", "/exam", "/progress"];
const authRoutes = ["/login", "/signup", "/reset-password"];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if needed
  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if accessing protected route without auth
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add app/proxy.ts
git commit -m "feat: add auth middleware for route protection"
```

---

## Task 6: UserNav Component

**Files:**
- Create: `components/layout/user-nav.tsx`
- Modify: `components/layout/header.tsx`

- [ ] **Step 1: Create UserNav component**

```typescript
// components/layout/user-nav.tsx
import Link from "next/link";
import { Flame, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser, signOut } from "@/lib/supabase/actions";
import { getUserStreak } from "@/lib/db/queries";

export async function UserNav() {
  const user = await getUser();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/login">Sign in</Link>
      </Button>
    );
  }

  const streak = await getUserStreak(user.id);

  return (
    <div className="flex items-center gap-3">
      {streak && streak.current_streak > 0 && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Flame className="h-4 w-4 text-orange-500" />
          <span>{streak.current_streak}</span>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block max-w-[150px] truncate">
              {user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/progress">My Progress</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form action={signOut}>
              <button type="submit" className="flex items-center gap-2 w-full">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

- [ ] **Step 2: Update header to include UserNav**

```typescript
// components/layout/header.tsx
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Nav } from "./nav";
import { UserNav } from "./user-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg tracking-tight">Mendix Prep</span>
        </Link>
        <div className="flex items-center gap-6">
          <Nav />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/user-nav.tsx components/layout/header.tsx
git commit -m "feat: add UserNav component with streak display"
```

---

## Task 7: Database Types and Streak Utils

**Files:**
- Create: `lib/db/types.ts`
- Create: `lib/db/streak-utils.ts`

- [ ] **Step 1: Create database types**

```typescript
// lib/db/types.ts
export interface Progress {
  id: string;
  user_id: string;
  topic_id: string;
  topic_name: string;
  completed_questions: number;
  total_questions: number;
  correct_answers: number;
  mastery_level: number;
  last_studied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuestionAttempt {
  id: string;
  user_id: string;
  question_id: string;
  topic_id: string;
  is_correct: boolean;
  time_spent_seconds: number | null;
  attempt_number: number;
  created_at: string;
}

export interface ExamSession {
  id: string;
  user_id: string;
  exam_type: string;
  score: number;
  total_questions: number;
  passing_score: number;
  passed: boolean;
  time_spent_seconds: number | null;
  answers: Record<string, boolean> | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_start_date: string | null;
  total_study_days: number;
  created_at: string;
  updated_at: string;
}

export interface TopicStats {
  topic_id: string;
  topic_name: string;
  completed_questions: number;
  correct_answers: number;
  mastery_level: number;
  last_studied_at: string | null;
}

export interface Recommendations {
  unexplored: { id: string; name: string }[];
  weak: TopicStats[];
  suggested: { id: string; name: string } | null;
}
```

- [ ] **Step 2: Create streak utilities**

```typescript
// lib/db/streak-utils.ts
export interface StreakUpdate {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_start_date: string | null;
  total_study_days: number;
  changed: boolean;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isYesterday(date: Date, today: Date): boolean {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

export function calculateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: string | null,
  streakStartDate: string | null,
  totalStudyDays: number
): StreakUpdate {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  if (lastActivityDate) {
    const lastDate = new Date(lastActivityDate);

    // Already active today
    if (isSameDay(lastDate, today)) {
      return {
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity_date: lastActivityDate,
        streak_start_date: streakStartDate,
        total_study_days: totalStudyDays,
        changed: false,
      };
    }

    // Was active yesterday - continue streak
    if (isYesterday(lastDate, today)) {
      const newCurrent = currentStreak + 1;
      return {
        current_streak: newCurrent,
        longest_streak: Math.max(longestStreak, newCurrent),
        last_activity_date: todayStr,
        streak_start_date: streakStartDate,
        total_study_days: totalStudyDays + 1,
        changed: true,
      };
    }
  }

  // Streak broken or first activity
  return {
    current_streak: 1,
    longest_streak: Math.max(longestStreak, 1),
    last_activity_date: todayStr,
    streak_start_date: todayStr,
    total_study_days: totalStudyDays + 1,
    changed: true,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/db/types.ts lib/db/streak-utils.ts
git commit -m "feat: add database types and streak utilities"
```

---

## Task 8: Database Queries

**Files:**
- Create: `lib/db/queries.ts`

- [ ] **Step 1: Create queries file with getUserProgress**

```typescript
// lib/db/queries.ts
import { createClient } from "@/lib/supabase/server";
import { topics } from "@/lib/content/topics";
import type { Progress, Streak, ExamSession, TopicStats, Recommendations } from "./types";

export async function getUserProgress(userId: string): Promise<Progress[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching progress:", error);
    return [];
  }

  return data || [];
}
```

- [ ] **Step 2: Add getUserStreak query**

```typescript
export async function getUserStreak(userId: string): Promise<Streak | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching streak:", error);
    }
    return null;
  }

  return data;
}
```

- [ ] **Step 3: Add getExamHistory query**

```typescript
export async function getExamHistory(userId: string): Promise<ExamSession[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_sessions")
    .select("*")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error fetching exam history:", error);
    return [];
  }

  return data || [];
}
```

- [ ] **Step 4: Add getRecommendations function**

```typescript
export function getRecommendations(progress: Progress[]): Recommendations {
  const attemptedIds = new Set(progress.map((p) => p.topic_id));

  // Get all topics from content
  const allTopics = topics.map((t) => ({ id: t.id, name: t.name }));

  // Topics never attempted
  const unexplored = allTopics.filter((t) => !attemptedIds.has(t.id));

  // Convert progress to TopicStats
  const topicStats: TopicStats[] = progress.map((p) => ({
    topic_id: p.topic_id,
    topic_name: p.topic_name,
    completed_questions: p.completed_questions,
    correct_answers: p.correct_answers,
    mastery_level: p.mastery_level,
    last_studied_at: p.last_studied_at,
  }));

  // Weak topics (enough data + below threshold), capped at 3
  const weak = topicStats
    .filter((p) => p.completed_questions >= 3 && p.mastery_level < 70)
    .sort((a, b) => a.mastery_level - b.mastery_level)
    .slice(0, 3);

  // Determine suggested topic
  let suggested: { id: string; name: string } | null = null;

  if (weak.length > 0) {
    suggested = allTopics.find((t) => t.id === weak[0].topic_id) || null;
  } else if (unexplored.length > 0) {
    suggested = unexplored[0];
  } else if (topicStats.length > 0) {
    // All good - suggest least recently studied
    const sorted = [...topicStats].sort((a, b) => {
      const aTime = a.last_studied_at ? new Date(a.last_studied_at).getTime() : 0;
      const bTime = b.last_studied_at ? new Date(b.last_studied_at).getTime() : 0;
      return aTime - bTime;
    });
    suggested = allTopics.find((t) => t.id === sorted[0].topic_id) || null;
  }

  return { unexplored, weak, suggested };
}
```

- [ ] **Step 5: Add getDashboardStats function**

```typescript
export interface DashboardStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const [progress, streak] = await Promise.all([
    getUserProgress(userId),
    getUserStreak(userId),
  ]);

  const totalQuestions = progress.reduce((sum, p) => sum + p.completed_questions, 0);
  const correctAnswers = progress.reduce((sum, p) => sum + p.correct_answers, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    totalQuestions,
    correctAnswers,
    accuracy,
    currentStreak: streak?.current_streak || 0,
    longestStreak: streak?.longest_streak || 0,
    totalStudyDays: streak?.total_study_days || 0,
  };
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/db/queries.ts
git commit -m "feat: add database query functions"
```

---

## Task 9: Database Actions (Mutations)

**Files:**
- Create: `lib/db/actions.ts`

- [ ] **Step 1: Create actions file with trackAttempt**

```typescript
// lib/db/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/actions";
import { calculateStreakUpdate } from "./streak-utils";
import { getUserStreak } from "./queries";

interface TrackAttemptData {
  question_id: string;
  topic_id: string;
  topic_name: string;
  is_correct: boolean;
  time_spent_seconds?: number;
}

export async function trackAttempt(data: TrackAttemptData) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  // 1. Insert question attempt
  const { error: attemptError } = await supabase.from("question_attempts").insert({
    user_id: user.id,
    question_id: data.question_id,
    topic_id: data.topic_id,
    is_correct: data.is_correct,
    time_spent_seconds: data.time_spent_seconds,
  });

  if (attemptError) {
    console.error("Error tracking attempt:", attemptError);
    return { error: "Failed to track attempt" };
  }

  // 2. Update or create progress record
  const { data: existingProgress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("topic_id", data.topic_id)
    .single();

  const newCompleted = (existingProgress?.completed_questions || 0) + 1;
  const newCorrect = (existingProgress?.correct_answers || 0) + (data.is_correct ? 1 : 0);
  const newMastery = Math.round((newCorrect / newCompleted) * 100);

  if (existingProgress) {
    await supabase
      .from("progress")
      .update({
        completed_questions: newCompleted,
        correct_answers: newCorrect,
        mastery_level: newMastery,
        last_studied_at: new Date().toISOString(),
      })
      .eq("id", existingProgress.id);
  } else {
    await supabase.from("progress").insert({
      user_id: user.id,
      topic_id: data.topic_id,
      topic_name: data.topic_name,
      completed_questions: 1,
      correct_answers: data.is_correct ? 1 : 0,
      mastery_level: data.is_correct ? 100 : 0,
      last_studied_at: new Date().toISOString(),
    });
  }

  // 3. Update streak
  const streak = await getUserStreak(user.id);
  const streakUpdate = calculateStreakUpdate(
    streak?.current_streak || 0,
    streak?.longest_streak || 0,
    streak?.last_activity_date || null,
    streak?.streak_start_date || null,
    streak?.total_study_days || 0
  );

  if (streakUpdate.changed) {
    if (streak) {
      await supabase
        .from("streaks")
        .update({
          current_streak: streakUpdate.current_streak,
          longest_streak: streakUpdate.longest_streak,
          last_activity_date: streakUpdate.last_activity_date,
          streak_start_date: streakUpdate.streak_start_date,
          total_study_days: streakUpdate.total_study_days,
        })
        .eq("id", streak.id);
    } else {
      await supabase.from("streaks").insert({
        user_id: user.id,
        current_streak: streakUpdate.current_streak,
        longest_streak: streakUpdate.longest_streak,
        last_activity_date: streakUpdate.last_activity_date,
        streak_start_date: streakUpdate.streak_start_date,
        total_study_days: streakUpdate.total_study_days,
      });
    }
  }

  return { success: true, mastery: newMastery };
}
```

- [ ] **Step 2: Add exam session actions**

```typescript
export async function createExamSession(examType: string) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("exam_sessions")
    .insert({
      user_id: user.id,
      exam_type: examType,
      score: 0,
      total_questions: 50,
      passing_score: 70,
      passed: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating exam session:", error);
    return { error: "Failed to create exam session" };
  }

  return { success: true, sessionId: data.id };
}

interface CompleteExamData {
  sessionId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, boolean>;
  timeSpentSeconds: number;
}

export async function completeExamSession(data: CompleteExamData) {
  const user = await getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  const supabase = await createClient();
  const passed = (data.score / data.totalQuestions) * 100 >= 70;

  const { error } = await supabase
    .from("exam_sessions")
    .update({
      score: data.score,
      total_questions: data.totalQuestions,
      passed,
      answers: data.answers,
      time_spent_seconds: data.timeSpentSeconds,
      completed_at: new Date().toISOString(),
    })
    .eq("id", data.sessionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error completing exam:", error);
    return { error: "Failed to save exam results" };
  }

  // Update streak (exam counts as study activity)
  const streak = await getUserStreak(user.id);
  const streakUpdate = calculateStreakUpdate(
    streak?.current_streak || 0,
    streak?.longest_streak || 0,
    streak?.last_activity_date || null,
    streak?.streak_start_date || null,
    streak?.total_study_days || 0
  );

  if (streakUpdate.changed) {
    if (streak) {
      await supabase
        .from("streaks")
        .update({
          current_streak: streakUpdate.current_streak,
          longest_streak: streakUpdate.longest_streak,
          last_activity_date: streakUpdate.last_activity_date,
          streak_start_date: streakUpdate.streak_start_date,
          total_study_days: streakUpdate.total_study_days,
        })
        .eq("id", streak.id);
    } else {
      await supabase.from("streaks").insert({
        user_id: user.id,
        current_streak: streakUpdate.current_streak,
        longest_streak: streakUpdate.longest_streak,
        last_activity_date: streakUpdate.last_activity_date,
        streak_start_date: streakUpdate.streak_start_date,
        total_study_days: streakUpdate.total_study_days,
      });
    }
  }

  return { success: true, passed };
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/db/actions.ts
git commit -m "feat: add database mutation actions"
```

---

## Task 10: Integrate Tracking into Practice Page

**Files:**
- Modify: `components/practice/question-card.tsx`
- Modify: `app/practice/page.tsx`

- [ ] **Step 1: Update QuestionCard to accept tracking callback**

Add new prop to QuestionCardProps in `components/practice/question-card.tsx`:

```typescript
interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean, questionId: string) => void; // Updated signature
  onNext: () => void;
  showExplanation?: boolean;
}
```

Update handleSubmit to pass question ID:

```typescript
const handleSubmit = () => {
  if (selectedIndex === null) return;
  setSubmitted(true);
  onAnswer(selectedIndex === question.correctIndex, question.id);
};
```

- [ ] **Step 2: Update practice page to track attempts**

Add import at top of `app/practice/page.tsx`:

```typescript
import { trackAttempt } from "@/lib/db/actions";
import { topics } from "@/lib/content/topics";
```

Update handleAnswer function:

```typescript
const handleAnswer = async (correct: boolean, questionId: string) => {
  if (correct) {
    setCorrectAnswers((prev) => prev + 1);
  }
  setAnsweredQuestions((prev) => prev + 1);

  // Track attempt in database
  const topicId = selectedTopic === "all"
    ? currentQuestion.category
    : selectedTopic;
  const topic = topics.find((t) => t.id === topicId);

  if (topic) {
    trackAttempt({
      question_id: questionId,
      topic_id: topicId,
      topic_name: topic.name,
      is_correct: correct,
    });
  }
};
```

- [ ] **Step 3: Update QuestionCard call in practice page**

```typescript
<QuestionCard
  question={currentQuestion}
  questionNumber={currentQuestionIndex + 1}
  totalQuestions={filteredQuestions.length}
  onAnswer={handleAnswer}
  onNext={handleNext}
/>
```

- [ ] **Step 4: Commit**

```bash
git add components/practice/question-card.tsx app/practice/page.tsx
git commit -m "feat: integrate progress tracking into practice page"
```

---

## Task 11: Update Progress Page

**Files:**
- Modify: `app/progress/page.tsx`

- [ ] **Step 1: Rewrite progress page with analytics dashboard**

```typescript
// app/progress/page.tsx
import Link from "next/link";
import { Flame, Target, TrendingUp, Calendar, AlertCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getUser } from "@/lib/supabase/actions";
import { getUserProgress, getDashboardStats, getRecommendations, getExamHistory } from "@/lib/db/queries";
import { topics } from "@/lib/content/topics";
import { cn } from "@/lib/utils";

export default async function ProgressPage() {
  const user = await getUser();

  if (!user) {
    return null; // Middleware should have redirected
  }

  const [progress, stats, examHistory] = await Promise.all([
    getUserProgress(user.id),
    getDashboardStats(user.id),
    getExamHistory(user.id),
  ]);

  const recommendations = getRecommendations(progress);

  // Create a map for easy lookup
  const progressMap = new Map(progress.map((p) => [p.topic_id, p]));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">
            Track your learning journey and focus on areas that need improvement
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Questions Answered
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Accuracy
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accuracy}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Streak
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Study Days
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudyDays}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        {(recommendations.weak.length > 0 || recommendations.unexplored.length > 0) && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <Lightbulb className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.weak.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-amber-900 dark:text-amber-100">
                    Focus on these weak topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.weak.map((topic) => (
                      <Badge
                        key={topic.topic_id}
                        variant="outline"
                        className="border-rose-300 text-rose-700 dark:border-rose-800 dark:text-rose-300"
                      >
                        {topic.topic_name} ({topic.mastery_level}%)
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.unexplored.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-amber-900 dark:text-amber-100">
                    Start learning these topics:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendations.unexplored.slice(0, 3).map((topic) => (
                      <Badge key={topic.id} variant="secondary">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendations.suggested && (
                <Button asChild className="mt-2">
                  <Link href={`/practice?topic=${recommendations.suggested.id}`}>
                    Practice {recommendations.suggested.name}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Topic Progress Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Topic Mastery</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {topics.map((topic) => {
              const topicProgress = progressMap.get(topic.id);
              const mastery = topicProgress?.mastery_level || 0;
              const completed = topicProgress?.completed_questions || 0;
              const correct = topicProgress?.correct_answers || 0;

              return (
                <Card key={topic.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <topic.icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{topic.name}</span>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          mastery >= 70
                            ? "text-emerald-600"
                            : mastery >= 50
                              ? "text-amber-600"
                              : mastery > 0
                                ? "text-rose-600"
                                : "text-muted-foreground"
                        )}
                      >
                        {mastery}%
                      </span>
                    </div>
                    <Progress
                      value={mastery}
                      className={cn(
                        "h-2",
                        mastery >= 70
                          ? "[&>div]:bg-emerald-500"
                          : mastery >= 50
                            ? "[&>div]:bg-amber-500"
                            : "[&>div]:bg-rose-500"
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {completed > 0
                        ? `${correct}/${completed} correct`
                        : "Not started"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Exam History */}
        {examHistory.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Exam History</h2>
            <div className="space-y-3">
              {examHistory.slice(0, 5).map((exam) => (
                <Card key={exam.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium">
                        Score: {exam.score}/{exam.total_questions} (
                        {Math.round((exam.score / exam.total_questions) * 100)}%)
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exam.completed_at!).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={exam.passed ? "default" : "destructive"}>
                      {exam.passed ? "PASSED" : "FAILED"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/progress/page.tsx
git commit -m "feat: redesign progress page with analytics dashboard"
```

---

## Task 12: Update Exam Pages

**Files:**
- Modify: `app/exam/page.tsx`
- Modify: `app/exam/[id]/page.tsx`

- [ ] **Step 1: Add new state and imports to exam/[id]/page.tsx**

Add at top of file after existing imports:

```typescript
import { useEffect, useRef } from "react";
import { createExamSession, completeExamSession } from "@/lib/db/actions";
```

Add new state variables inside component:

```typescript
const [sessionId, setSessionId] = useState<string | null>(null);
const startTimeRef = useRef<number>(Date.now());
```

- [ ] **Step 2: Add useEffect to create exam session on mount**

Add after state declarations:

```typescript
useEffect(() => {
  async function initSession() {
    const result = await createExamSession("simulation");
    if (result.sessionId) {
      setSessionId(result.sessionId);
    }
  }
  initSession();
  startTimeRef.current = Date.now();
}, []);
```

- [ ] **Step 3: Update handleSubmitExam to save results**

Replace the existing handleSubmitExam function:

```typescript
const handleSubmitExam = useCallback(async () => {
  // Calculate results
  let correctCount = 0;
  const answersRecord: Record<string, boolean> = {};

  examQuestions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correctIndex;
    answersRecord[question.id] = isCorrect;
    if (isCorrect) correctCount++;
  });

  // Save to database if we have a session
  if (sessionId) {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    await completeExamSession({
      sessionId,
      score: correctCount,
      totalQuestions: examQuestions.length,
      answers: answersRecord,
      timeSpentSeconds: timeSpent,
    });
  }

  setExamState("results");
}, [sessionId, examQuestions, answers]);
```

- [ ] **Step 4: Update handleTimeUp to also save results**

Replace handleTimeUp:

```typescript
const handleTimeUp = useCallback(async () => {
  // Auto-submit when time runs out
  await handleSubmitExam();
}, [handleSubmitExam]);
```

- [ ] **Step 5: Commit exam tracking integration**

```bash
git add app/exam/[id]/page.tsx
git commit -m "feat: integrate exam session tracking with database"
```

---

## Task 13: Supabase OAuth Configuration

**Note:** `NEXT_PUBLIC_SITE_URL` should already be set (see Prerequisites section).

- [ ] **Step 1: Configure Google OAuth in Supabase Dashboard**

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Google provider
3. Create OAuth credentials in Google Cloud Console:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase Google provider settings

- [ ] **Step 2: Update production SITE_URL**

For Vercel deployment, add environment variable in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app`

---

## Final Verification

- [ ] **Step 1: Run dev server and test auth flow**

```bash
npm run dev
```

Test:
1. Visit `/practice` → should redirect to `/login`
2. Sign up with email → check email for confirmation
3. Sign in → should redirect back to `/practice`
4. Answer questions → check database for progress entries
5. Visit `/progress` → should show stats and topic mastery

- [ ] **Step 2: Test Google OAuth**

1. Click "Continue with Google" on login page
2. Complete OAuth flow
3. Verify redirect back to app

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete user auth and learning analytics implementation"
git push
```
