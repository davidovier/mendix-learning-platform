# Capgemini Colleague Access & Admin Dashboard

**Date:** 2026-04-29
**Status:** Approved

---

## Overview

Capgemini colleagues get free pro-level access to the app. On signup with a `@capgemini.com` email (or any OAuth provider using that domain), they are automatically placed in a pending state. An admin reviews and approves or declines requests via a dashboard at `/admin`. Approved users bypass all usage limits and Stripe checks. Declined users have their account deleted.

---

## Data Model

### New table: `user_profiles`

One row per user, created automatically on signup via a Postgres trigger.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK, `gen_random_uuid()` |
| `user_id` | UUID | FK → `auth.users` ON DELETE CASCADE, UNIQUE |
| `is_admin` | BOOLEAN | Default `false` |
| `capgemini_status` | TEXT | `CHECK IN ('pending', 'approved')`, null = not a Capgemini request |
| `capgemini_requested_at` | TIMESTAMPTZ | Set by trigger on signup |
| `capgemini_reviewed_at` | TIMESTAMPTZ | Set when admin approves |
| `capgemini_reviewed_by` | UUID | FK → `auth.users` ON DELETE SET NULL — which admin approved |
| `created_at` | TIMESTAMPTZ | Default `NOW()` |

`capgemini_reviewed_by` is only populated on approval. Declined users are deleted, so no row persists.

### Postgres trigger

Fires `AFTER INSERT` on `auth.users` (covers email and all OAuth providers including Google):

```sql
IF NEW.email LIKE '%@capgemini.com' THEN
  INSERT INTO user_profiles (user_id, capgemini_status, capgemini_requested_at)
  VALUES (NEW.id, 'pending', NOW());
ELSE
  INSERT INTO user_profiles (user_id) VALUES (NEW.id);
END IF
```

### RLS

Admin-check circular dependency is broken with a `SECURITY DEFINER` helper:

```sql
CREATE FUNCTION is_admin() RETURNS BOOLEAN
  LANGUAGE sql SECURITY DEFINER
  AS $$ SELECT COALESCE(is_admin, false) FROM user_profiles WHERE user_id = auth.uid() $$;
```

Policies:
- **SELECT own row:** `auth.uid() = user_id` — users can read their own status
- **SELECT all rows:** `is_admin()` — admins see everyone
- **UPDATE any row:** `is_admin()` — admins can approve/change flags

---

## Access Control

### `hasFullAccess(userId)` — new function in `lib/stripe/subscription.ts`

Replaces `isProUser()` at four internal call sites:

```
hasFullAccess(userId) =
  isProUser()                        -- active Stripe subscription
  OR capgemini_status = 'approved'   -- approved Capgemini colleague
  OR is_admin = true                 -- admin user
```

**Call sites to update (replace `isProUser()` with `hasFullAccess()`):**
1. Inside `canAnswerQuestion()` in `lib/stripe/subscription.ts`
2. Inside `canTakeExam()` in `lib/stripe/subscription.ts`
3. `components/layout/user-nav.tsx` — approved Capgemini users and admins show the same existing "Pro" badge, no new badge type needed
4. `lib/security/rate-limiter.ts` — so approved colleagues/admins get unlimited rate limits

---

## Signup Flow

### What users see

1. **Form** — unchanged. No Capgemini-specific UI.
2. **Success message** — `signUpWithEmail` checks if the submitted email ends in `@capgemini.com` and conditionally appends a sentence: *"We detected your Capgemini email. Once confirmed, your request for free colleague access will be reviewed by an admin."* The Postgres trigger independently creates the `user_profiles` row with `capgemini_status = 'pending'` — these are two separate checks for two separate concerns.
3. **After first login (pending)** — a server-rendered persistent amber banner in the root layout below the nav: *"⏳ Capgemini access pending — your request is awaiting admin approval. Free tier access applies in the meantime."* The root layout fetches the user's profile row on every render (server component — no client polling). Banner disappears automatically once `capgemini_status` changes to `'approved'`.
4. **After approval (one-time)** — a dismissible green banner rendered by a `"use client"` component that checks `localStorage` for a `capgemini_approval_dismissed` key. On first render after approval it shows: *"🎉 Capgemini access approved! You now have full pro access as a Capgemini colleague."* Dismissing sets `localStorage.setItem('capgemini_approval_dismissed', 'true')`. No DB column needed.

### Pending state behaviour

Pending Capgemini users have **free tier** access — same limits as regular unsubscribed users. No special restrictions beyond the normal free tier.

### Google OAuth

The trigger fires on all `auth.users` INSERTs regardless of provider, so `@capgemini.com` Google Workspace accounts are auto-detected identically to email signups.

---

## Admin Dashboard (`/admin`)

### Admin nav link

`components/layout/user-nav.tsx` (and its client counterpart) receives an `isAdmin` prop from the server component. When `true`, renders an "Admin" link pointing to `/admin` in the user dropdown menu — only visible to admin users.

### Route protection

Server component. On load:
1. `getUser()` — redirect to `/` if not authenticated
2. Query `user_profiles` for `is_admin = true` — redirect to `/` if not admin

No middleware needed for a single admin route.

### Page layout

- **Stats row** — Pending count, Approved count, Total registered users (count of `user_profiles` rows — accessible via admin RLS, no service-role needed)
- **Pending requests table** — columns: Email, Requested (relative time), Status badge, Actions (Approve / Decline)
- **Approved colleagues table** — columns: Email, Approved date, Approved by

### Approve action (server action)

1. Re-verify caller `is_admin` server-side (independent of page-level guard)
2. `UPDATE user_profiles SET capgemini_status = 'approved', capgemini_reviewed_at = NOW(), capgemini_reviewed_by = <admin_user_id> WHERE user_id = <target_user_id>`
3. Revalidate the `/admin` page

### Decline action (server action)

1. Re-verify caller `is_admin` server-side
2. Show confirmation dialog before firing
3. Call `supabase.auth.admin.deleteUser(userId)` using the service-role key
4. `ON DELETE CASCADE` on `user_profiles.user_id` cleans up the profile row automatically
5. Revalidate the `/admin` page

---

## Setting Initial Admin

After the migration runs, execute in the Supabase SQL editor:

```sql
INSERT INTO user_profiles (user_id, is_admin)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'david_vos@outlook.com'),
  true
)
ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
```

Uses `ON CONFLICT` because the profile row may already exist (trigger fires on new signups; existing users need a manual insert).

---

## What Does NOT Change

- Stripe subscription flow is untouched
- Existing free tier limits remain the same for non-Capgemini, non-admin users
- All other pages and routes are unchanged
- No email notifications — admin checks the dashboard manually
