# User Authentication & Learning Analytics Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add user authentication and learning analytics to track progress, identify weak topics, and provide smart study recommendations.

**Architecture:** Supabase Auth with email/password and Google OAuth. Server Actions for all data mutations. Middleware-based route protection with redirect flow.

**Tech Stack:** Next.js 16, Supabase Auth, Supabase Database (existing schema), Server Actions, TypeScript

---

## 1. Authentication Architecture

### New Files

```
app/
├── (auth)/
│   ├── login/page.tsx           # Sign in (email/password + Google)
│   ├── signup/page.tsx          # Sign up
│   └── reset-password/page.tsx  # Password reset (receives magic link)
├── auth/
│   └── callback/route.ts        # OAuth + magic link callback handler
├── proxy.ts                     # Auth middleware (Next.js 16 naming)
components/
├── layout/
│   └── user-nav.tsx             # User avatar/sign-out or "Sign in" button
lib/
├── supabase/
│   ├── client.ts                # (exists)
│   ├── server.ts                # (exists)
│   └── actions.ts               # Server Actions: signIn, signUp, signOut
```

### Auth Flow

1. User visits protected route (e.g., `/practice`)
2. `proxy.ts` checks session via Supabase, refreshes if needed (Supabase SSR handles this automatically via `getSession()`)
3. No session → redirect to `/login?redirect=/practice`
4. User signs in (email/password or Google OAuth)
5. Supabase sets auth cookies
6. Callback handler redirects to original URL (from `redirect` param)
7. `proxy.ts` sees valid session → allow through

### Error Handling

- Invalid credentials: Show inline error message on login form
- OAuth rejection/cancellation: Redirect back to login with `?error=oauth_cancelled`
- Network errors: Show toast notification, allow retry
- Session expired mid-action: Redirect to login, preserve form state where possible

### Sign-in Methods

- Email + Password (with email verification)
- Google OAuth
- Password reset via magic link

### Header Behavior

- **Signed out:** "Sign in" button in header
- **Signed in:** Current streak with Flame icon + user avatar + dropdown with "Sign out"

---

## 2. Route Protection

### Routing Table

| Route | Auth Required | Behavior |
|-------|---------------|----------|
| `/` | No | Landing page, pass through |
| `/study/*` | No | Flashcards viewable without auth |
| `/cheatsheet` | No | Reference content, pass through |
| `/login` | No | If already signed in → redirect to `/` |
| `/signup` | No | If already signed in → redirect to `/` |
| `/practice` | **Yes** | No session → `/login?redirect=/practice` |
| `/exam` | **Yes** | No session → `/login?redirect=/exam` |
| `/exam/[id]` | **Yes** | No session → `/login?redirect=/exam/[id]` |
| `/progress` | **Yes** | No session → `/login?redirect=/progress` |

### Redirect Handling

Login page reads `searchParams.redirect` and redirects there after successful auth. Falls back to `/` if no redirect param.

---

## 3. Database Integration

### Existing Schema (No Changes Needed)

The following tables already exist with RLS policies:

- `progress` - Per-topic progress and mastery levels
- `question_attempts` - Individual question attempts with spaced repetition fields
- `exam_sessions` - Exam history and results
- `achievements` - User badges (deferred for v1)
- `streaks` - Learning streak tracking

### New Files

```
lib/
├── db/
│   ├── database.types.ts     # Generated from Supabase CLI
│   ├── queries.ts            # All read operations
│   ├── actions.ts            # All Server Actions (mutations)
│   └── streak-utils.ts       # Streak calculation logic (pure functions)
```

### Type Generation

```bash
supabase gen types typescript --project-id <id> > lib/db/database.types.ts
```

### Key Server Actions

```typescript
// lib/db/actions.ts
'use server'

// Track a question attempt and update progress
async function trackAttempt(data: {
  question_id: string;
  topic_id: string;
  topic_name: string;
  is_correct: boolean;
  time_spent_seconds?: number;
}): Promise<void>

// Create exam session when starting
async function createExamSession(exam_type: string): Promise<string> // returns session id

// Complete exam session with results
async function completeExamSession(data: {
  session_id: string;
  score: number;
  total_questions: number;
  passing_score: number;
  passed: boolean;
  answers: Record<string, boolean>;
  time_spent_seconds: number;
}): Promise<void>
```

### Mastery Calculation

Updated in `trackAttempt()` after each answer:

```typescript
mastery_level = Math.round((correct_answers / completed_questions) * 100)
```

### Streak Logic

```typescript
// lib/db/streak-utils.ts

function calculateStreakUpdate(
  currentStreak: number,
  longestStreak: number,
  lastActivityDate: Date | null,
  today: Date
): StreakUpdate {
  if (lastActivityDate && isSameDay(lastActivityDate, today)) {
    // Already active today, no change
    return { current: currentStreak, longest: longestStreak, changed: false };
  }

  if (lastActivityDate && isYesterday(lastActivityDate, today)) {
    // Continue streak
    const newCurrent = currentStreak + 1;
    return {
      current: newCurrent,
      longest: Math.max(longestStreak, newCurrent),
      changed: true
    };
  }

  // Streak broken or first activity
  return { current: 1, longest: Math.max(longestStreak, 1), changed: true };
}
```

---

## 4. Weak-Topic Identification

### Threshold

- **Weak topic:** < 70% mastery with at least 3 attempts
- **Unexplored topic:** 0 attempts

### Recommendation Logic

```typescript
// lib/db/queries.ts

interface Recommendations {
  unexplored: Topic[];      // Topics never attempted
  weak: TopicStats[];       // Weak topics (max 3, sorted by lowest mastery)
  suggested: Topic | null;  // Single suggested next action
}

function getRecommendations(
  allTopics: Topic[],
  progress: TopicStats[]
): Recommendations {
  const attemptedIds = new Set(progress.map(p => p.topic_id));

  // Topics never attempted
  const unexplored = allTopics.filter(t => !attemptedIds.has(t.id));

  // Weak topics (enough data + below threshold), capped at 3
  const weak = progress
    .filter(p => p.completed_questions >= 3 && p.mastery_level < 70)
    .sort((a, b) => a.mastery_level - b.mastery_level)
    .slice(0, 3);

  // Suggested: lowest mastery weak topic, or first unexplored, or least recent
  let suggested: Topic | null = null;
  if (weak.length > 0) {
    suggested = allTopics.find(t => t.id === weak[0].topic_id) ?? null;
  } else if (unexplored.length > 0) {
    suggested = unexplored[0];
  } else {
    // All good - suggest least recently studied
    const sorted = [...progress].sort((a, b) =>
      (a.last_studied_at?.getTime() ?? 0) - (b.last_studied_at?.getTime() ?? 0)
    );
    if (sorted.length > 0) {
      suggested = allTopics.find(t => t.id === sorted[0].topic_id) ?? null;
    }
  }

  return { unexplored, weak, suggested };
}
```

---

## 5. Page Modifications

### Layout (`app/layout.tsx`)

- Add `<UserNav />` component to header
- UserNav shows streak + user info when signed in

### Practice Page (`app/practice/page.tsx`)

- On answer submit: call `trackAttempt()` Server Action
- Update local state with returned stats

### Exam Pages

**`app/exam/page.tsx`:**
- Show list of past exam attempts (from `exam_sessions`)
- "Start New Exam" button

**`app/exam/[id]/page.tsx`:**
- On mount: call `createExamSession()`
- Track answers in React state during exam
- On submit: call `completeExamSession()` with all data
- Abandoned exams stay incomplete (no `completed_at`)

### Progress Page (`app/progress/page.tsx`)

Complete redesign with:

1. **Summary cards:**
   - Total questions answered
   - Overall accuracy percentage
   - Current streak (with Flame icon)

2. **Weak topics alert** (if any):
   - "Focus on these topics" heading
   - List of up to 3 weakest topics with mastery bars

3. **Unexplored topics** (if any):
   - "Start learning" section
   - List of topics with 0 attempts

4. **All topics grid:**
   - Progress bars showing mastery per topic
   - Format: "70% (14/20 correct)"
   - Color coding:
     - Emerald: >= 70%
     - Amber: 50-69%
     - Rose: < 50%

5. **Suggested action:**
   - Primary CTA: "Practice {topic_name}" button
   - Based on `getRecommendations().suggested` logic

---

## 6. Deferred (Not in v1)

- **Achievements/badges system** - Tables exist, UI deferred
- **Spaced repetition scheduling** - Schema has fields, algorithm deferred
- **Modal-based auth** - Using redirect flow for simplicity
- **Anonymous trial** - Requires localStorage + migration logic

---

## 7. Environment Variables

Required in `.env.local` (already present):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required for Google OAuth (configure in Supabase dashboard):
- Google OAuth Client ID
- Google OAuth Client Secret
- Redirect URL: `{SITE_URL}/auth/callback`

---

## 8. Success Criteria

1. Users can sign up/sign in with email or Google
2. Protected routes redirect to login when unauthenticated
3. Question attempts are tracked in `question_attempts` table
4. Progress page shows per-topic mastery levels
5. Weak topics (< 70% with 3+ attempts) are highlighted
6. Streak is tracked and displayed in header
7. Exam results are saved and viewable
