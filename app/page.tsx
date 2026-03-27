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
    <div className="container mx-auto flex flex-col items-center px-4 pt-12 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Mendix Intermediate Certification
        </h1>
        <p className="text-lg text-muted-foreground mt-4">
          Practice questions and flashcards to help you pass.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 sm:p-8 max-w-2xl w-full">
        <div className="grid gap-3 sm:grid-cols-2">
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
      </div>

      <Link href="/study" className={cn(buttonVariants({ size: "lg" }), "gap-2 mt-8")}>
        Start Learning
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
