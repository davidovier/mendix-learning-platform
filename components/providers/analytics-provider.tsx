// components/providers/analytics-provider.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUTM } from "@/lib/utm";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Capture UTM params on mount and URL changes
  useEffect(() => {
    captureUTM();
  }, [searchParams]);

  // Track page views on route change
  useEffect(() => {
    // GA4 handles page_view automatically with enhanced measurement
    // But we track custom events for specific pages
    if (pathname === "/pricing") {
      trackEvent("view_pricing");
    }
  }, [pathname]);

  return <>{children}</>;
}
