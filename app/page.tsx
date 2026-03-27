"use client";

import Link from "next/link";
import { BookOpen, PenLine, Timer, BarChart3, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Study Mode",
    description: "Interactive flashcards",
    href: "/study",
    icon: BookOpen,
  },
  {
    title: "Practice Quiz",
    description: "268 exam questions",
    href: "/practice",
    icon: PenLine,
  },
  {
    title: "Exam Simulation",
    description: "Timed mock exams",
    href: "/exam",
    icon: Timer,
  },
  {
    title: "Progress",
    description: "Track your mastery",
    href: "/progress",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col items-center gap-12 py-16 px-4">
      <div className="text-center space-y-4 max-w-xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
          Mendix Intermediate Certification
        </h1>
        <p className="text-muted-foreground">
          Practice questions and flashcards to help you pass.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link href="/study" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-4xl">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group">
            <div className="h-full p-5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
              <feature.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
