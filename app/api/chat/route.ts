import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { TUTOR_SYSTEM_PROMPT } from "@/lib/ai/tutor-prompt";
import { getUser } from "@/lib/supabase/actions";
import { checkRateLimit } from "@/lib/security/rate-limiter";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Bug fix #3: Add authentication check
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  // Bug fix #4: Add input validation
  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = body;
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Messages must be an array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = streamText({
    model: "anthropic/claude-sonnet-4",
    system: TUTOR_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages as UIMessage[]),
  });

  return result.toUIMessageStreamResponse();
}
