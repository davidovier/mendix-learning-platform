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
    <div className="container mx-auto flex flex-col items-center px-4 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Mendix Intermediate Certification
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-3 sm:mt-4 max-w-md mx-auto">
          Practice questions and flashcards to help you pass.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 max-w-2xl w-full">
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-border bg-background hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
                <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex-shrink-0">
                  <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-sm sm:text-base text-foreground">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{feature.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/study" className={cn(buttonVariants({ size: "lg" }), "gap-2 mt-6 sm:mt-8")}>
        Start Learning
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
