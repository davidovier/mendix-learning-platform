# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the Mendix Prep app with layered security: fix vulnerabilities, add security headers, strengthen password policy, and implement rate limiting on AI endpoints.

**Architecture:** Three-layer defense (Infrastructure → Gateway → Application). Each layer is independent and can be tested/rolled back separately. Rate limiting uses Supabase with atomic RPC for race-condition-free counting.

**Tech Stack:** Next.js 16, Supabase (PostgreSQL + RLS), TypeScript

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | npm audit overrides if needed |
| Modify | `next.config.ts` | Security headers |
| Modify | `proxy.ts` | Add `/account` to protected routes |
| Create | `lib/security/password-validator.ts` | Password validation utility |
| Modify | `components/auth/signup-form.tsx` | Client-side password validation |
| Modify | `lib/supabase/actions.ts` | Server-side password validation |
| Create | `supabase/migrations/add_rate_limits.sql` | Rate limits table + RLS + RPC |
| Create | `lib/security/rate-limiter.ts` | Rate limiting utility |
| Modify | `app/api/chat/route.ts` | Integrate rate limiter |
| Modify | `app/api/explain/route.ts` | Integrate rate limiter |

---

## Task 1: Fix npm Vulnerabilities

**Files:**
- Modify: `package.json` (if overrides needed)

- [ ] **Step 1: Run npm audit to see current state**

```bash
npm audit
```

Expected: Shows vulnerabilities in lodash-es, @hono/node-server, brace-expansion

- [ ] **Step 2: Attempt automatic fix**

```bash
npm audit fix
```

Expected: Some or all vulnerabilities resolved

- [ ] **Step 3: Check remaining vulnerabilities**

```bash
npm audit
```

If vulnerabilities remain, proceed to Step 4. If clean, skip to Step 5.

- [ ] **Step 4: Add overrides for stubborn packages (if needed)**

Add to `package.json` after `devDependencies`:

```json
"overrides": {
  "lodash-es": "^4.17.21",
  "brace-expansion": "^2.0.1"
}
```

Then run:

```bash
rm -rf node_modules package-lock.json && npm install
```

- [ ] **Step 5: Verify fix**

```bash
npm audit
```

Expected: 0 high/critical vulnerabilities

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: resolve npm audit vulnerabilities

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Add Security Headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts with security headers**

Replace the entire contents of `next.config.ts` with:

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://www.google-analytics.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts without errors

- [ ] **Step 3: Test headers locally**

```bash
curl -I http://localhost:3000 2>/dev/null | grep -E "(Content-Security|X-Frame|X-Content-Type|Referrer-Policy|Strict-Transport|Permissions-Policy)"
```

Expected: All 6 security headers present in output

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git commit -m "feat: add security headers (CSP, HSTS, X-Frame-Options, etc.)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Protect /account Route in Proxy

**Files:**
- Modify: `proxy.ts:4`

- [ ] **Step 1: Add /account to protected routes**

In `proxy.ts`, change line 4 from:

```typescript
const protectedRoutes = ["/practice", "/exam", "/progress"];
```

to:

```typescript
const protectedRoutes = ["/account", "/practice", "/exam", "/progress"];
```

- [ ] **Step 2: Test protection (manual)**

1. Open browser in incognito mode
2. Navigate to `http://localhost:3000/account`
3. Verify redirect to `/login?redirect=/account`

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: protect /account route in proxy

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Password Validator

**Files:**
- Create: `lib/security/password-validator.ts`

- [ ] **Step 1: Create security directory**

```bash
mkdir -p lib/security
```

- [ ] **Step 2: Create password-validator.ts**

Create `lib/security/password-validator.ts`:

```typescript
export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/security/password-validator.ts
git commit -m "feat: add password validator utility

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update Signup Form with Password Validation

**Files:**
- Modify: `components/auth/signup-form.tsx`

- [ ] **Step 1: Add import for password validator**

At the top of `components/auth/signup-form.tsx`, after the existing imports, add:

```typescript
import { validatePassword } from "@/lib/security/password-validator";
```

- [ ] **Step 2: Add password validation state**

Inside the `SignupForm` component, after the existing state declarations (around line 12), add:

```typescript
const [passwordError, setPasswordError] = useState<string | null>(null);
```

- [ ] **Step 3: Add validation to handleSubmit**

In the `handleSubmit` function, after `setSuccess(null);` (around line 18), add:

```typescript
const password = formData.get("password") as string;
const validation = validatePassword(password);
if (!validation.valid) {
  setPasswordError(validation.errors[0]);
  setLoading(false);
  return;
}
setPasswordError(null);
```

- [ ] **Step 4: Update minLength and help text**

Change the password Input (around line 53-58) from:

```tsx
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
```

to:

```tsx
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
```

- [ ] **Step 5: Test validation (manual)**

1. Navigate to `http://localhost:3000/signup`
2. Enter email and 7-character password
3. Submit form
4. Verify error message appears: "Password must be at least 8 characters"

- [ ] **Step 6: Commit**

```bash
git add components/auth/signup-form.tsx
git commit -m "feat: enforce 8-char password minimum in signup form

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Add Server-Side Password Validation

**Files:**
- Modify: `lib/supabase/actions.ts`

- [ ] **Step 1: Add import**

At the top of `lib/supabase/actions.ts`, after the existing imports, add:

```typescript
import { validatePassword } from "@/lib/security/password-validator";
```

- [ ] **Step 2: Add validation to signUpWithEmail**

In the `signUpWithEmail` function, after the existing validation checks (around line 46), add:

```typescript
const validation = validatePassword(password);
if (!validation.valid) {
  return { error: validation.errors[0] };
}
```

- [ ] **Step 3: Add validation to updatePassword**

In the `updatePassword` function, after the existing validation check (around line 127), add:

```typescript
const validation = validatePassword(password);
if (!validation.valid) {
  return { error: validation.errors[0] };
}
```

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/actions.ts
git commit -m "feat: add server-side password validation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Create Rate Limits Database Migration

**Files:**
- Create: `supabase/migrations/20260409000000_add_rate_limits.sql`

- [ ] **Step 1: Create migrations directory**

```bash
mkdir -p supabase/migrations
```

- [ ] **Step 2: Create migration file**

Create `supabase/migrations/20260409000000_add_rate_limits.sql`:

```sql
-- Rate limiting table for API abuse prevention
CREATE TABLE rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_cleanup ON rate_limits(window_start);

-- Enable RLS - users can only access their own rate limit records
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rate limits"
  ON rate_limits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limits"
  ON rate_limits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate limits"
  ON rate_limits FOR UPDATE
  USING (auth.uid() = user_id);

-- Atomic increment function for race-condition-free rate limiting
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_user_id UUID,
  p_endpoint TEXT
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO rate_limits (user_id, endpoint, window_start, request_count)
  VALUES (p_user_id, p_endpoint, date_trunc('minute', NOW()), 1)
  ON CONFLICT (user_id, endpoint, window_start)
  DO UPDATE SET request_count = rate_limits.request_count + 1
  RETURNING request_count INTO v_count;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old records (optional, run via pg_cron)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
```

- [ ] **Step 3: Apply migration to Supabase**

Option A - Via Supabase CLI:
```bash
supabase db push
```

Option B - Via Supabase Dashboard:
1. Go to SQL Editor
2. Paste the migration SQL
3. Click "Run"

- [ ] **Step 4: Verify table exists**

In Supabase Dashboard > Table Editor, confirm `rate_limits` table exists with correct columns.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260409000000_add_rate_limits.sql
git commit -m "feat: add rate_limits table with RLS and atomic increment RPC

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Create Rate Limiter Utility

**Files:**
- Create: `lib/security/rate-limiter.ts`

- [ ] **Step 1: Create rate-limiter.ts**

Create `lib/security/rate-limiter.ts`:

```typescript
import { createClient } from "@/lib/supabase/server";
import { isProUser } from "@/lib/stripe/subscription";

interface RateLimitConfig {
  freeLimit: number;
  proLimit: number;
}

// All rate limits use 1-minute windows (defined in SQL function)
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
  const isPro = await isProUser(userId);
  const limit = isPro ? config.proLimit : config.freeLimit;

  // Atomic upsert - no race conditions
  const { data, error } = await supabase.rpc("increment_rate_limit", {
    p_user_id: userId,
    p_endpoint: endpoint,
  });

  if (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if rate limiting fails
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

- [ ] **Step 2: Commit**

```bash
git add lib/security/rate-limiter.ts
git commit -m "feat: add rate limiter utility with tier-based limits

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Integrate Rate Limiter in /api/chat

**Files:**
- Modify: `app/api/chat/route.ts`

- [ ] **Step 1: Add import**

At the top of `app/api/chat/route.ts`, add:

```typescript
import { checkRateLimit } from "@/lib/security/rate-limiter";
```

- [ ] **Step 2: Add rate limit check after auth**

In the `POST` function, after the auth check (after line 16), add:

```typescript
// Rate limiting
const rateLimit = await checkRateLimit(user.id, "/api/chat");
if (!rateLimit.allowed) {
  return new Response(
    JSON.stringify({ error: "Too many requests", retryAfter: rateLimit.retryAfter }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(rateLimit.retryAfter),
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
```

- [ ] **Step 3: Test rate limiting (manual)**

Use curl or a script to send 11+ rapid requests to /api/chat while logged in. Verify 429 response after limit.

- [ ] **Step 4: Commit**

```bash
git add app/api/chat/route.ts
git commit -m "feat: add rate limiting to /api/chat endpoint

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Integrate Rate Limiter in /api/explain

**Files:**
- Modify: `app/api/explain/route.ts`

- [ ] **Step 1: Add import**

At the top of `app/api/explain/route.ts`, add:

```typescript
import { checkRateLimit } from "@/lib/security/rate-limiter";
```

- [ ] **Step 2: Add rate limit check after auth**

In the `POST` function, after the auth check (after line 41), add:

```typescript
// Rate limiting
const rateLimit = await checkRateLimit(user.id, "/api/explain");
if (!rateLimit.allowed) {
  return new Response(
    JSON.stringify({ error: "Too many requests", retryAfter: rateLimit.retryAfter }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(rateLimit.retryAfter),
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/explain/route.ts
git commit -m "feat: add rate limiting to /api/explain endpoint

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Final Verification

- [ ] **Step 1: Run full test suite**

```bash
npm run lint
npm run build
```

Expected: No errors

- [ ] **Step 2: Verify all success criteria**

| Criterion | How to verify |
|-----------|---------------|
| npm audit clean | `npm audit` shows 0 high/critical |
| Security headers | `curl -I localhost:3000` shows all headers |
| /account protected | Incognito → /account → redirects to /login |
| Rate limiting works | 11 rapid requests to /api/chat → 429 |
| Password policy | 7-char password rejected on signup |

- [ ] **Step 3: Create summary commit**

```bash
git add -A
git status
```

If any uncommitted changes remain, commit them:

```bash
git commit -m "chore: security hardening complete

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Manual Step (Outside Code)

**Update Supabase Dashboard Password Policy:**
1. Go to Supabase Dashboard > Authentication > Providers
2. Under "Email", set minimum password length to 8
3. Save changes

This provides defense-in-depth alongside client and server validation.
