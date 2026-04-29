import { createClient } from "@/lib/supabase/server";
import { hasFullAccess } from "@/lib/stripe/subscription";

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
  const fullAccess = await hasFullAccess(userId);
  const limit = fullAccess ? config.proLimit : config.freeLimit;

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
