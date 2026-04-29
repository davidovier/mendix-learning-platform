# Capgemini Access & Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow Capgemini colleagues to sign up for free pro access, pending admin approval, with an admin dashboard at `/admin` to approve or decline requests.

**Architecture:** A new `user_profiles` Postgres table (one row per user, populated by trigger on signup) stores `is_admin` and `capgemini_status`. A new `hasFullAccess()` function replaces `isProUser()` at all access-check call sites. An admin dashboard at `/admin` (server component, gated behind `is_admin`) lets admins approve or delete pending users.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase (Postgres + Auth), `@supabase/ssr`, `@supabase/supabase-js` (service-role client for admin deletes), shadcn/ui (`AlertDialog` for confirm).

---

## File Map

**New files:**
- `supabase/migrations/20260429000000_add_user_profiles.sql` — table, trigger, RLS, helper function
- `lib/db/profile.ts` — `getUserProfile()` query
- `lib/admin/actions.ts` — `getAdminDashboardData()`, `approveCapgeminiRequest()`, `declineCapgeminiRequest()` (service-role client)
- `app/admin/page.tsx` — admin dashboard server component
- `app/admin/admin-client.tsx` — client component for approve/decline buttons + confirm dialog
- `components/layout/capgemini-banner.tsx` — `PendingBanner` (static client component, no server needs)
- `components/layout/capgemini-approval-banner.tsx` — `ApprovalBannerClient` (`"use client"`, uses localStorage)

**Modified files:**
- `lib/db/types.ts` — add `UserProfile` type
- `lib/stripe/subscription.ts` — add `hasFullAccess()`, update `canAnswerQuestion()` + `canTakeExam()`
- `lib/stripe/usage-actions.ts` — replace `isProUser` with `hasFullAccess` for `isPro` field
- `lib/supabase/actions.ts` — detect `@capgemini.com` in `signUpWithEmail()`
- `lib/security/rate-limiter.ts` — replace `isProUser` with `hasFullAccess`
- `components/layout/user-nav.tsx` — fetch profile, pass `isAdmin` + `isFullAccess`
- `components/layout/user-nav-client.tsx` — add `isAdmin` prop, Admin link in dropdown
- `app/layout.tsx` — fetch user profile, render Capgemini banners

---

## Task 1: Database migration

**Files:**
- Create: `supabase/migrations/20260429000000_add_user_profiles.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/20260429000000_add_user_profiles.sql

-- user_profiles: one row per user, created by trigger on auth.users INSERT
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email                     TEXT        NOT NULL,
  is_admin                  BOOLEAN     NOT NULL DEFAULT false,
  capgemini_status          TEXT        CHECK (capgemini_status IN ('pending', 'approved')),
  capgemini_requested_at    TIMESTAMPTZ,
  capgemini_reviewed_at     TIMESTAMPTZ,
  capgemini_reviewed_by     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id
  ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_capgemini_status
  ON public.user_profiles(capgemini_status);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER helper — runs as DB owner, bypasses RLS.
-- Used inside RLS policies to check if the current user is admin
-- without causing a circular dependency.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profiles WHERE user_id = auth.uid()),
    false
  );
$$;

-- RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can update any profile"
  ON public.user_profiles FOR UPDATE
  USING (public.is_admin());

-- Trigger function — runs as SECURITY DEFINER so it bypasses RLS on INSERT.
-- Stores email (denormalized) so admin dashboard can read it without
-- needing service-role access to auth.users.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email LIKE '%@capgemini.com' THEN
    INSERT INTO public.user_profiles (user_id, email, capgemini_status, capgemini_requested_at)
    VALUES (NEW.id, NEW.email, 'pending', NOW());
  ELSE
    INSERT INTO public.user_profiles (user_id, email)
    VALUES (NEW.id, NEW.email);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

- [ ] **Step 2: Apply the migration**

  If using Supabase CLI locally: `npx supabase db push`
  
  If using Supabase dashboard: open the SQL editor, paste the migration, and run it.

- [ ] **Step 3: Verify the table exists**

  In the Supabase dashboard → Table Editor, confirm `user_profiles` appears with the correct columns. Check the Triggers section under the `auth` schema to confirm `on_auth_user_created` is listed.

---

## Task 2: UserProfile type + getUserProfile()

**Files:**
- Modify: `lib/db/types.ts`
- Create: `lib/db/profile.ts`

- [ ] **Step 1: Add UserProfile to lib/db/types.ts**

  Add after the existing `UsageTracking` interface at the bottom of the file:

```typescript
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  is_admin: boolean;
  capgemini_status: "pending" | "approved" | null;
  capgemini_requested_at: string | null;
  capgemini_reviewed_at: string | null;
  capgemini_reviewed_by: string | null;
  created_at: string;
}
```

- [ ] **Step 2: Create lib/db/profile.ts**

```typescript
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "./types";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data as UserProfile;
}
```

- [ ] **Step 3: Type-check**

```bash
cd mendix-prep && npx tsc --noEmit
```

Expected: no errors relating to `UserProfile` or `profile.ts`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260429000000_add_user_profiles.sql lib/db/types.ts lib/db/profile.ts
git commit -m "feat: add user_profiles table, trigger, RLS, and getUserProfile query"
```

---

## Task 3: hasFullAccess() + update canAnswerQuestion/canTakeExam

**Files:**
- Modify: `lib/stripe/subscription.ts`

- [ ] **Step 1: Add hasFullAccess() and update the two usage functions**

  At the top of `lib/stripe/subscription.ts`, add the import:
```typescript
import { getUserProfile } from "@/lib/db/profile";
```

  Then add `hasFullAccess` as a new export after `hasLifetimeAccess`:
```typescript
export async function hasFullAccess(userId: string): Promise<boolean> {
  const [pro, profile] = await Promise.all([
    isProUser(userId),
    getUserProfile(userId),
  ]);
  if (pro) return true;
  if (!profile) return false;
  return profile.is_admin || profile.capgemini_status === "approved";
}
```

  Update `canAnswerQuestion` — replace `isProUser` with `hasFullAccess`:
```typescript
export async function canAnswerQuestion(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  if (await hasFullAccess(userId)) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const usage = await getTodayUsage(userId);
  const used = usage?.questions_answered || 0;
  const limit = FREE_TIER_LIMITS.questionsPerDay;
  const remaining = Math.max(0, limit - used);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}
```

  Update `canTakeExam` — replace `isProUser` with `hasFullAccess`:
```typescript
export async function canTakeExam(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
}> {
  if (await hasFullAccess(userId)) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const weekExams = await getWeekUsage(userId);
  const limit = FREE_TIER_LIMITS.examsPerWeek;
  const remaining = Math.max(0, limit - weekExams);

  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

  Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/stripe/subscription.ts
git commit -m "feat: add hasFullAccess(), update canAnswerQuestion/canTakeExam to grant unlimited access to admins and approved Capgemini users"
```

---

## Task 4: Update usage-actions.ts + rate-limiter.ts

**Files:**
- Modify: `lib/stripe/usage-actions.ts`
- Modify: `lib/security/rate-limiter.ts`

- [ ] **Step 1: Update usage-actions.ts**

  In `lib/stripe/usage-actions.ts`, update the import line:
```typescript
import {
  canAnswerQuestion,
  canTakeExam,
  incrementQuestionUsage,
  incrementExamUsage,
  hasFullAccess,
} from "./subscription";
```

  Update `getUsageStatus()` to replace `isProUser` with `hasFullAccess`:
```typescript
export async function getUsageStatus(): Promise<UsageStatus | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [isPro, questions, exams] = await Promise.all([
    hasFullAccess(user.id),
    canAnswerQuestion(user.id),
    canTakeExam(user.id),
  ]);

  return {
    isPro,
    questions,
    exams,
  };
}
```

- [ ] **Step 2: Update rate-limiter.ts**

  Replace the entire file:
```typescript
import { createClient } from "@/lib/supabase/server";
import { hasFullAccess } from "@/lib/stripe/subscription";

interface RateLimitConfig {
  freeLimit: number;
  proLimit: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/chat": { freeLimit: 10, proLimit: 30 },
  "/api/explain": { freeLimit: 15, proLimit: 50 },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter?: number;
}

export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[endpoint];
  if (!config) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }

  const supabase = await createClient();
  const fullAccess = await hasFullAccess(userId);
  const limit = fullAccess ? config.proLimit : config.freeLimit;

  const { data, error } = await supabase.rpc("increment_rate_limit", {
    p_user_id: userId,
    p_endpoint: endpoint,
  });

  if (error) {
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: limit, limit };
  }

  const count = data as number;
  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);

  return {
    allowed,
    remaining,
    limit,
    retryAfter: allowed ? undefined : 60,
  };
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

  Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/stripe/usage-actions.ts lib/security/rate-limiter.ts
git commit -m "feat: use hasFullAccess in usage-actions and rate-limiter"
```

---

## Task 5: Detect @capgemini.com in signUpWithEmail

**Files:**
- Modify: `lib/supabase/actions.ts`

- [ ] **Step 1: Update signUpWithEmail**

  Replace the `signUpWithEmail` function in `lib/supabase/actions.ts`:
```typescript
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
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Verify manually**

  Sign up with a test `@capgemini.com` email and confirm the extended success message appears in the UI. Sign up with a non-Capgemini email and confirm the standard message appears.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/actions.ts
git commit -m "feat: show Capgemini-specific success message on signup for @capgemini.com emails"
```

---

## Task 6: Update UserNav — isAdmin prop + Admin link + Pro badge

**Files:**
- Modify: `components/layout/user-nav.tsx`
- Modify: `components/layout/user-nav-client.tsx`

- [ ] **Step 1: Update user-nav.tsx (server component)**

  Replace the entire file:
```typescript
import { getUser } from "@/lib/supabase/actions";
import { hasFullAccess } from "@/lib/stripe/subscription";
import { getUserProfile } from "@/lib/db/profile";
import { UserNavClient } from "./user-nav-client";

export async function UserNav() {
  const user = await getUser();

  if (!user) {
    return <UserNavClient user={null} isFullAccess={false} isAdmin={false} />;
  }

  const [fullAccess, profile] = await Promise.all([
    hasFullAccess(user.id),
    getUserProfile(user.id),
  ]);

  return (
    <UserNavClient
      user={{ email: user.email || "" }}
      isFullAccess={fullAccess}
      isAdmin={profile?.is_admin ?? false}
    />
  );
}
```

- [ ] **Step 2: Update user-nav-client.tsx (client component)**

  Update the props interface and component to accept `isAdmin` and `isFullAccess` (replacing `isPro`):
```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Sparkles, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/actions";

interface UserNavClientProps {
  user: { email: string } | null;
  isFullAccess: boolean;
  isAdmin: boolean;
}

export function UserNavClient({ user, isFullAccess, isAdmin }: UserNavClientProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Sign in
      </Link>
    );
  }

  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "U";

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isFullAccess
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        <span>{initials}</span>
        {isFullAccess && (
          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-background rounded-full flex items-center justify-center shadow-sm border border-border">
            <Sparkles className="w-2 h-2 text-primary" />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
          <div className="px-2 py-1.5 border-b border-border mb-1">
            <p className="text-sm font-medium truncate">{user.email}</p>
            {isFullAccess ? (
              <p className="text-xs text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Pro
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Free plan</p>
            )}
          </div>

          <button
            onClick={() => { router.push("/progress"); setIsOpen(false); }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4" />
            My Progress
          </button>
          <button
            onClick={() => { router.push("/account"); setIsOpen(false); }}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4" />
            Account
          </button>

          {isAdmin && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => { router.push("/admin"); setIsOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-muted transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Dashboard
              </button>
            </>
          )}

          {!isFullAccess && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={() => { router.push("/pricing"); setIsOpen(false); }}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-primary hover:bg-muted transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Upgrade to Pro
              </button>
            </>
          )}

          <div className="my-1 h-px bg-border" />
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

  Expected: no errors. If you see `isPro` referenced elsewhere in the nav components, replace with `isFullAccess`.

- [ ] **Step 4: Commit**

```bash
git add components/layout/user-nav.tsx components/layout/user-nav-client.tsx
git commit -m "feat: add isAdmin prop to UserNav, show Admin Dashboard link for admins, use isFullAccess for Pro badge"
```

---

## Task 7: Capgemini banners in root layout

**Files:**
- Create: `components/layout/capgemini-banner.tsx`
- Create: `components/layout/capgemini-approval-banner.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create capgemini-banner.tsx (static — no `"use client"` needed)**

```typescript
export function PendingBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="mx-auto max-w-5xl px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-medium">Capgemini access pending</span>
          {" — "}your request is awaiting admin approval. Free tier access applies in the meantime.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create capgemini-approval-banner.tsx (`"use client"` must be at top — needs localStorage)**

```typescript
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DISMISSED_KEY = "capgemini_approval_dismissed";

export function ApprovalBannerClient() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="border-b border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="text-sm text-green-800 dark:text-green-200">
          <span className="font-medium">🎉 Capgemini access approved!</span>
          {" "}You now have full pro access as a Capgemini colleague.
        </p>
        <button
          onClick={dismiss}
          className="ml-4 shrink-0 rounded p-0.5 text-green-700 hover:bg-green-100 dark:text-green-300 dark:hover:bg-green-900/40"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update app/layout.tsx**

  Add imports after the existing imports:
```typescript
import { getUser } from "@/lib/supabase/actions";
import { getUserProfile } from "@/lib/db/profile";
import { PendingBanner } from "@/components/layout/capgemini-banner";
import { ApprovalBannerClient } from "@/components/layout/capgemini-approval-banner";
```

  Update `RootLayout` to be async and render banners below `<Header />`:
```typescript
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  const profile = user ? await getUserProfile(user.id) : null;
  const capgeminiStatus = profile?.capgemini_status ?? null;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <TooltipProvider>
          <Header />
          {capgeminiStatus === "pending" && <PendingBanner />}
          {capgeminiStatus === "approved" && <ApprovalBannerClient />}
          <main className="flex-1">
            <Suspense fallback={null}>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </Suspense>
          </main>
          <Footer />
        </TooltipProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/layout/capgemini-banner.tsx app/layout.tsx
git commit -m "feat: add pending and approval banners for Capgemini users in root layout"
```

---

## Task 8: Admin server actions

**Files:**
- Create: `lib/admin/actions.ts`

- [ ] **Step 1: Create lib/admin/actions.ts**

```typescript
"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/actions";
import { getUserProfile } from "@/lib/db/profile";
import { revalidatePath } from "next/cache";

export interface PendingRequest {
  user_id: string;
  email: string;
  capgemini_requested_at: string;
}

export interface ApprovedColleague {
  user_id: string;
  email: string;
  capgemini_reviewed_at: string | null;
  reviewed_by_email: string | null;
}

export interface AdminDashboardData {
  pending: PendingRequest[];
  approved: ApprovedColleague[];
  totalUsers: number;
}

function getAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createSupabaseClient(url, key);
}

async function assertAdmin(): Promise<string> {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");
  const profile = await getUserProfile(user.id);
  if (!profile?.is_admin) throw new Error("Forbidden");
  return user.id;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  await assertAdmin();

  const supabase = await createClient();

  const [pendingResult, approvedResult, totalResult] = await Promise.all([
    supabase
      .from("user_profiles")
      .select("user_id, email, capgemini_requested_at")
      .eq("capgemini_status", "pending")
      .order("capgemini_requested_at", { ascending: true }),

    supabase
      .from("user_profiles")
      .select("user_id, email, capgemini_reviewed_at, capgemini_reviewed_by")
      .eq("capgemini_status", "approved")
      .order("capgemini_reviewed_at", { ascending: false }),

    supabase
      .from("user_profiles")
      .select("user_id", { count: "exact", head: true }),
  ]);

  // Resolve reviewer emails for approved colleagues
  const approvedRaw = (approvedResult.data ?? []) as {
    user_id: string;
    email: string;
    capgemini_reviewed_at: string | null;
    capgemini_reviewed_by: string | null;
  }[];

  const reviewerIds = [...new Set(
    approvedRaw
      .map((r) => r.capgemini_reviewed_by)
      .filter((id): id is string => id !== null)
  )];

  let reviewerEmailMap: Record<string, string> = {};
  if (reviewerIds.length > 0) {
    const { data: reviewerProfiles } = await supabase
      .from("user_profiles")
      .select("user_id, email")
      .in("user_id", reviewerIds);
    reviewerEmailMap = Object.fromEntries(
      (reviewerProfiles ?? []).map((p) => [p.user_id, p.email])
    );
  }

  return {
    pending: (pendingResult.data ?? []) as PendingRequest[],
    approved: approvedRaw.map((r) => ({
      user_id: r.user_id,
      email: r.email,
      capgemini_reviewed_at: r.capgemini_reviewed_at,
      reviewed_by_email: r.capgemini_reviewed_by
        ? (reviewerEmailMap[r.capgemini_reviewed_by] ?? null)
        : null,
    })),
    totalUsers: totalResult.count ?? 0,
  };
}

export async function approveCapgeminiRequest(targetUserId: string): Promise<{ error?: string }> {
  const adminId = await assertAdmin().catch(() => null);
  if (!adminId) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_profiles")
    .update({
      capgemini_status: "approved",
      capgemini_reviewed_at: new Date().toISOString(),
      capgemini_reviewed_by: adminId,
    })
    .eq("user_id", targetUserId)
    .eq("capgemini_status", "pending");

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}

export async function declineCapgeminiRequest(targetUserId: string): Promise<{ error?: string }> {
  const adminId = await assertAdmin().catch(() => null);
  if (!adminId) return { error: "Unauthorized" };

  const adminClient = getAdminSupabaseClient();
  const { error } = await adminClient.auth.admin.deleteUser(targetUserId);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

  Expected: no errors. If you get "cannot find module @supabase/supabase-js", it is already installed (it's a dependency of `@supabase/ssr`).

- [ ] **Step 3: Commit**

```bash
git add lib/admin/actions.ts
git commit -m "feat: add admin server actions — getAdminDashboardData, approveCapgeminiRequest, declineCapgeminiRequest"
```

---

## Task 9: Admin dashboard page

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/admin-client.tsx`

- [ ] **Step 1: Create app/admin/admin-client.tsx**

```typescript
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { PendingRequest, ApprovedColleague } from "@/lib/admin/actions";
import { approveCapgeminiRequest, declineCapgeminiRequest } from "@/lib/admin/actions";

function RelativeTime({ iso }: { iso: string }) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return <>{days} day{days !== 1 ? "s" : ""} ago</>;
  if (hours > 0) return <>{hours} hour{hours !== 1 ? "s" : ""} ago</>;
  return <>{Math.max(1, mins)} minute{mins !== 1 ? "s" : ""} ago</>;
}

function PendingRow({ request, onAction }: { request: PendingRequest; onAction: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveCapgeminiRequest(request.user_id);
      if (result.error) setError(result.error);
      else onAction();
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 text-sm font-medium">{request.email}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <RelativeTime iso={request.capgemini_requested_at} />
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
          Pending
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {error && <span className="text-xs text-destructive">{error}</span>}
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending}
            className="h-7 gap-1 px-2.5 text-xs"
          >
            <Check className="h-3 w-3" />
            Approve
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                className="h-7 gap-1 px-2.5 text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
                Decline
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Decline and delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{request.email}</strong>&apos;s account.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    startTransition(async () => {
                      const result = await declineCapgeminiRequest(request.user_id);
                      if (result.error) setError(result.error);
                      else onAction();
                    });
                  }}
                >
                  Delete account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

interface AdminDashboardClientProps {
  pending: PendingRequest[];
  approved: ApprovedColleague[];
  totalUsers: number;
}

export function AdminDashboardClient({ pending, approved, totalUsers }: AdminDashboardClientProps) {
  const router = useRouter();

  const handleAction = () => {
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending", value: pending.length, color: "text-amber-600" },
          { label: "Approved", value: approved.length, color: "text-green-600" },
          { label: "Total users", value: totalUsers, color: "text-foreground" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Pending table */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Pending requests
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {pending.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No pending requests</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requested</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((r) => (
                  <PendingRow key={r.user_id} request={r} onAction={handleAction} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approved table */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Approved colleagues
        </h2>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {approved.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No approved colleagues yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved by</th>
                </tr>
              </thead>
              <tbody>
                {approved.map((r) => (
                  <tr key={r.user_id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-sm font-medium">{r.email}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {r.capgemini_reviewed_at
                        ? new Date(r.capgemini_reviewed_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {r.reviewed_by_email ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create app/admin/page.tsx**

```typescript
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { getUser } from "@/lib/supabase/actions";
import { getUserProfile } from "@/lib/db/profile";
import { getAdminDashboardData } from "@/lib/admin/actions";
import { AdminDashboardClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const profile = await getUserProfile(user.id);
  if (!profile?.is_admin) redirect("/");

  const data = await getAdminDashboardData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage Capgemini colleague access requests
            </p>
          </div>
        </div>

        <AdminDashboardClient
          pending={data.pending}
          approved={data.approved}
          totalUsers={data.totalUsers}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Type-check + build**

```bash
npx tsc --noEmit && npm run build
```

  Expected: no type errors, build succeeds.

- [ ] **Step 4: Manual verification**

  Start the dev server: `npm run dev`
  
  - Navigate to `/admin` while not logged in → should redirect to `/login`
  - Navigate to `/admin` while logged in as a non-admin → should redirect to `/`
  - After setting admin (Task 10), navigate to `/admin` → should show the dashboard

- [ ] **Step 5: Commit**

```bash
git add app/admin/page.tsx app/admin/admin-client.tsx
git commit -m "feat: add admin dashboard at /admin with approve and decline actions"
```

---

## Task 10: Set david_vos@outlook.com as admin

- [ ] **Step 1: Run this SQL in the Supabase dashboard SQL editor**

```sql
INSERT INTO public.user_profiles (user_id, email, is_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'david_vos@outlook.com'),
  'david_vos@outlook.com',
  true
)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
```

  Uses `ON CONFLICT` because `david_vos@outlook.com` has an existing account — the trigger only fires for new signups, so the profile row may not exist yet.

- [ ] **Step 2: Verify**

  Log in as `david_vos@outlook.com`, open the user nav dropdown, and confirm "Admin Dashboard" appears. Click it and confirm `/admin` loads with the dashboard (not a redirect).

- [ ] **Step 3: Commit the plan as complete**

```bash
git add docs/superpowers/plans/2026-04-29-capgemini-access.md
git commit -m "docs: add Capgemini access implementation plan"
```

---

## Post-implementation checklist

- [ ] Sign up with `test@capgemini.com` — confirm extended success message, pending banner shows on login, user_profiles row has `capgemini_status = 'pending'`
- [ ] Approve the test user from `/admin` — confirm pending banner disappears, approval banner shows once, Pro badge appears in nav, usage limits are gone
- [ ] Sign up with a regular email — confirm standard success message, no banner, free tier limits apply
- [ ] Decline a pending request from `/admin` — confirm confirmation dialog appears, account is deleted, user cannot log in
- [ ] Confirm non-admin user cannot reach `/admin`
- [ ] Confirm AI chat rate limit uses `proLimit` for approved Capgemini users
