"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Study Mode",
    description: "Interactive flashcards with spaced repetition",
    href: "/study",
    icon: "📚",
  },
  {
    title: "Practice Quiz",
    description: "268 real exam questions with instant feedback",
    href: "/practice",
    icon: "✍️",
  },
  {
    title: "Exam Simulation",
    description: "Timed 50-question tests like the real exam",
    href: "/exam",
    icon: "⏱️",
  },
  {
    title: "AI Tutor",
    description: "Ask questions, get explanations, generate practice",
    href: "/tutor",
    icon: "🤖",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Master the Mendix Intermediate Certification
        </h1>
        <p className="text-xl text-muted-foreground">
          Study smarter with AI-powered learning, 268 real exam questions, and
          spaced repetition to help you pass on your first try.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/study" className={cn(buttonVariants({ size: "lg" }))}>
            Start Learning
          </Link>
          <Link href="/cheatsheet" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Quick Reference
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-5xl">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <div className="text-4xl mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Exam Quick Facts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> 50 questions
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> 90 minutes
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> ~70% to pass
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">✓</span> Online proctored
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
