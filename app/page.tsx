"use client";

import Link from "next/link";
import { BookOpen, PenLine, Timer, Bot, Check, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Study Mode",
    description: "Interactive flashcards with spaced repetition",
    href: "/study",
    icon: BookOpen,
  },
  {
    title: "Practice Quiz",
    description: "268 real exam questions with instant feedback",
    href: "/practice",
    icon: PenLine,
  },
  {
    title: "Exam Simulation",
    description: "Timed 50-question tests like the real exam",
    href: "/exam",
    icon: Timer,
  },
  {
    title: "AI Tutor",
    description: "Ask questions, get explanations, generate practice",
    href: "/tutor",
    icon: Bot,
  },
];

const examFacts = [
  "50 questions",
  "90 minutes",
  "~70% to pass",
  "Online proctored",
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-16 py-16 px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
          Master the Mendix Intermediate Certification
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Study smarter with AI-powered learning, 268 real exam questions, and
          spaced repetition to help you pass on your first try.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/study" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/cheatsheet" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Quick Reference
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-5xl">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group">
            <div className="h-full p-6 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
              <feature.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full max-w-md">
        <div className="p-6 rounded-lg border border-border bg-card">
          <h2 className="font-medium text-foreground mb-4">Exam Quick Facts</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {examFacts.map((fact) => (
              <li key={fact} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                {fact}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
