// lib/analytics.ts

declare global {
  interface Window {
    gtag: (
      command: "event" | "config" | "set",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

export const analytics = {
  // Auth events
  signUp: (method: string) => trackEvent("sign_up", { method }),
  login: (method: string) => trackEvent("login", { method }),

  // Study events
  startStudy: (topicId: string, topicName: string) =>
    trackEvent("start_study", { topic_id: topicId, topic_name: topicName }),

  // Practice events
  startPractice: (questionCount: number) =>
    trackEvent("start_practice", { question_count: questionCount }),

  // Exam events
  startExam: (examId: string) =>
    trackEvent("start_exam", { exam_id: examId }),

  completeExam: (examId: string, score: number, durationSeconds: number) =>
    trackEvent("complete_exam", {
      exam_id: examId,
      score,
      duration: durationSeconds,
    }),

  // Conversion events
  viewPricing: () => trackEvent("view_pricing"),

  beginCheckout: (value: number, currency: string = "EUR") =>
    trackEvent("begin_checkout", { value, currency }),

  purchase: (transactionId: string, value: number, currency: string = "EUR") =>
    trackEvent("purchase", {
      transaction_id: transactionId,
      value,
      currency,
    }),
};
