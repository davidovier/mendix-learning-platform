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
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-8">
      <div className="bg-card border border-border rounded-2xl shadow-sm p-8 sm:p-12 max-w-3xl w-full">
        <div className="flex flex-col items-center gap-10">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-foreground">
              Mendix Intermediate Certification
            </h1>
            <p className="text-muted-foreground">
              Practice questions and flashcards to help you pass.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 w-full">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/study" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
