import type { Metadata } from "next";
import Link from "next/link";
import { Check, BookOpen, Brain, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd, faqSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Free Mendix Practice Exam - Start Now",
  description:
    "Practice for your Mendix Intermediate Certification with 268 free exam questions. Instant feedback, progress tracking, and AI explanations.",
  robots: {
    index: true,
    follow: true,
  },
};

const features = [
  {
    icon: BookOpen,
    title: "268 Practice Questions",
    description: "Real exam-style questions covering all topics",
  },
  {
    icon: Brain,
    title: "AI Explanations",
    description: "Understand why answers are correct or wrong",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Identify weak areas and focus your study",
  },
];

const faqs = [
  {
    question: "Is it really free?",
    answer:
      "Yes! You get 10 practice questions per day and 1 exam simulation per week completely free. No credit card required.",
  },
  {
    question: "What topics are covered?",
    answer:
      "All Mendix Intermediate Certification topics: Domain Model, Microflows, Nanoflows, Security, Pages, XPath, Integration, and more.",
  },
  {
    question: "How is this different from Mendix Academy?",
    answer:
      "We offer realistic timed mock exams and AI-powered explanations that Mendix Academy doesn't provide. Perfect for exam-day preparation.",
  },
];

export default function FreePracticeExamLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Free Mendix Practice Exam
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
            268 exam-style questions to help you pass the Mendix Intermediate
            Developer Certification
          </p>
          <Button size="lg" className="text-lg px-8 py-6" render={<Link href="/signup" />}>
            Start Practicing - It&apos;s Free
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-8">
            Trusted by Mendix Developers
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Domain Model", "Microflows", "Security", "XPath", "Integration"].map(
              (topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                >
                  <Check className="h-3 w-3 text-green-500" />
                  {topic}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-muted/30 px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Ready to Pass Your Certification?
          </h2>
          <p className="text-muted-foreground mb-6">
            Join developers who use Mendix Prep to ace their exams
          </p>
          <Button size="lg" render={<Link href="/signup" />}>
            Start Free Practice
          </Button>
        </div>
      </section>
    </div>
  );
}
