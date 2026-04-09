import { generateText } from "ai";
import { getUser } from "@/lib/supabase/actions";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export const maxDuration = 30;

interface ExplainRequest {
  question: string;
  category: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
}

const EXPLAIN_SYSTEM_PROMPT = `You are an expert Mendix certification tutor helping students understand why they got a practice question wrong.

Your role is to provide a helpful, educational explanation that:
1. Analyzes WHY the student likely chose their answer (common misconceptions, similar-sounding options, etc.)
2. Clearly explains why the correct answer IS correct with Mendix-specific reasoning
3. Provides a memorable tip or mental model for similar questions

Guidelines:
- Be encouraging but direct - the goal is learning
- Use Mendix-specific terminology correctly
- Keep explanations concise but thorough (150-250 words)
- Focus on the conceptual understanding, not just memorization
- If relevant, mention common exam traps or patterns

Format your response as JSON with these fields:
{
  "whyYouChose": "Analysis of why the selected answer seemed appealing...",
  "whyCorrect": "Explanation of why the correct answer is right...",
  "tip": "A memorable tip or approach for similar questions..."
}`;

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

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

  let body: ExplainRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { question, category, options, correctIndex, selectedIndex } = body;

  if (
    !question ||
    !category ||
    !options ||
    correctIndex === undefined ||
    selectedIndex === undefined
  ) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const selectedAnswer = options[selectedIndex];
  const correctAnswer = options[correctIndex];

  const prompt = `
Category: ${category}

Question: ${question}

Options:
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n")}

Student selected: ${String.fromCharCode(65 + selectedIndex)}. ${selectedAnswer}
Correct answer: ${String.fromCharCode(65 + correctIndex)}. ${correctAnswer}

Analyze why the student chose "${selectedAnswer}" instead of "${correctAnswer}" and provide a helpful explanation.`;

  try {
    const result = await generateText({
      model: "anthropic/claude-sonnet-4",
      system: EXPLAIN_SYSTEM_PROMPT,
      prompt,
      temperature: 0.3,
    });

    // Parse the JSON response
    let explanation;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const text = result.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback if JSON parsing fails
      explanation = {
        whyYouChose: "This answer may have seemed correct due to similar terminology or common misconceptions.",
        whyCorrect: result.text,
        tip: "Review the key differences between related Mendix concepts.",
      };
    }

    return new Response(JSON.stringify(explanation), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Explain API error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate explanation" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
