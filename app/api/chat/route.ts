import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { TUTOR_SYSTEM_PROMPT } from "@/lib/ai/tutor-prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-4",
    system: TUTOR_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
