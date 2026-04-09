# Security Hardening Design Spec

**Date:** 2026-04-09  
**Status:** Approved  
**Approach:** Layered Defense

## Overview

Address security vulnerabilities identified in the Mendix Prep application through a three-layer defense approach: Infrastructure, Gateway, and Application layers.

## Identified Issues

| Issue | Severity | Layer |
|-------|----------|-------|
| npm dependency vulnerabilities | High | Infrastructure |
| Missing security headers | Medium | Infrastructure |
| `/account` route unprotected in proxy | Medium | Gateway |
| No rate limiting on AI endpoints | High | Application |
| Weak password policy (6 chars) | Medium | Application |

## Layer 1: Infrastructure

### 1.1 Fix npm Vulnerabilities

Run `npm audit fix` to address:
- **lodash-es** (HIGH) — Prototype pollution via chevrotain
- **@hono/node-server** (MODERATE) — Path traversal in serveStatic
- **brace-expansion** (MODERATE) — DoS via memory exhaustion

If `audit fix` doesn't resolve all issues, use package overrides in `package.json`.

### 1.2 Security Headers

Add to `next.config.ts`:

```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://www.google-analytics.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
    ].join('; ')
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];
```

**Rationale:**
- `'unsafe-inline'` for styles required by Tailwind patterns
- `blob:` sources needed for Rive WebGL animations
- Trusted domains: Supabase, Stripe, Google Analytics

## Layer 2: Gateway

### 2.1 Enhance proxy.ts

**Current state:** `proxy.ts` protects `/practice`, `/exam`, `/progress`

**Change required:** Add `/account` to `protectedRoutes` array.

```typescript
const protectedRoutes = ["/account", "/practice", "/exam", "/progress"];
```

**API routes:** Keep existing `getUser()` auth checks in individual routes. The proxy handles page redirects; API routes return 401 directly. This separation is correct.

## Layer 3: Application

### 3.1 Rate Limiting

#### Database Schema

```sql
-- Migration: add_rate_limits_table.sql
CREATE TABLE rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (user_id, endpoint, window_start)
);

CREATE INDEX idx_rate_limits_cleanup ON rate_limits(window_start);

-- Cleanup function for old records (run via pg_cron or manual maintenance)
-- Not required for MVP - table will stay small with per-minute windows
-- Consider adding pg_cron job if table grows: SELECT cron.schedule('0 * * * *', 'SELECT cleanup_old_rate_limits()');
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
```

#### Rate Limits by Tier

| Endpoint | Free Tier | Pro Tier |
|----------|-----------|----------|
| `/api/chat` | 10 req/min | 30 req/min |
| `/api/explain` | 15 req/min | 50 req/min |

#### Implementation: `lib/security/rate-limiter.ts`

```typescript
import { createClient } from "@/lib/supabase/server";
import { isProUser } from "@/lib/stripe/subscription";

interface RateLimitConfig {
  endpoint: string;
  freeLimit: number;
  proLimit: number;
  windowMinutes: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  "/api/chat": { endpoint: "/api/chat", freeLimit: 10, proLimit: 30, windowMinutes: 1 },
  "/api/explain": { endpoint: "/api/explain", freeLimit: 15, proLimit: 50, windowMinutes: 1 },
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
  const { data, error } = await supabase.rpc('increment_rate_limit', {
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

#### Supabase RPC Function

```sql
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
$$ LANGUAGE plpgsql;
```

#### Integration in API Routes

```typescript
// In /api/chat/route.ts and /api/explain/route.ts
import { checkRateLimit } from "@/lib/security/rate-limiter";

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const rateLimit = await checkRateLimit(user.id, "/api/chat");
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many requests", retryAfter: rateLimit.retryAfter }),
      { 
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": "0",
        }
      }
    );
  }

  // ... rest of handler
}
```

### 3.2 Password Policy

#### Update: `lib/security/password-validator.ts`

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

#### Update: `components/auth/signup-form.tsx`

- Change `minLength={6}` to `minLength={8}`
- Update help text to "Minimum 8 characters"

#### Update: Supabase Auth Settings

Configure minimum password length to 8 in Supabase Dashboard > Authentication > Policies.

## Implementation Order

| Step | Task | Risk | Dependencies |
|------|------|------|--------------|
| 1 | Run `npm audit fix` | Low | None |
| 2 | Add security headers to `next.config.ts` | Low | None |
| 3 | Add `/account` to proxy.ts protected routes | Low | None |
| 4 | Update password policy (form + Supabase) | Low | None |
| 5 | Create rate_limits table migration | Medium | None |
| 6 | Create increment_rate_limit RPC function | Medium | Step 5 |
| 7 | Create `lib/security/rate-limiter.ts` | Medium | Step 6 |
| 8 | Integrate rate limiter in `/api/chat` | Medium | Step 7 |
| 9 | Integrate rate limiter in `/api/explain` | Medium | Step 7 |

## Testing Strategy

### Infrastructure Layer
- **Headers:** `curl -I https://your-domain.com` to verify all headers present
- **npm audit:** Run `npm audit` after fix to confirm 0 vulnerabilities

### Gateway Layer
- **Auth redirect:** Access `/account` while logged out, verify redirect to `/login`

### Application Layer
- **Rate limiting:** Script 15+ rapid requests to `/api/chat`, verify 429 after limit
- **Password:** Attempt signup with 7-char password, verify rejection

## Rollback Plan

Each layer is independent:

| Layer | Rollback Action |
|-------|-----------------|
| Headers | Revert `next.config.ts` changes |
| Proxy | Remove `/account` from array |
| Rate limiting | Comment out rate limit checks in API routes; table can remain |
| Password | Revert form minLength; update Supabase policy |

## Success Criteria

- [ ] `npm audit` reports 0 high/critical vulnerabilities
- [ ] All security headers present in production responses
- [ ] `/account` redirects to login when unauthenticated
- [ ] AI endpoints return 429 when rate limit exceeded
- [ ] Signup rejects passwords under 8 characters
