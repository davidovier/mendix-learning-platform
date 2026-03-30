"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy MessageResponse component with all its markdown plugins
// This reduces initial bundle size - plugins only load when this component mounts
export const LazyMarkdown = dynamic(
  () => import("@/components/ai-elements/message").then((mod) => mod.MessageResponse),
  {
    loading: () => (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
    ),
    ssr: false, // Don't SSR - let server send cached HTML, then hydrate with markdown
  }
);
