# SEO & SEA Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full SEO foundation and SEA tracking infrastructure for organic growth and future paid acquisition.

**Architecture:** Add Google Analytics 4 with custom event tracking, structured data (JSON-LD), UTM parameter capture, and page-specific metadata. Create landing page template for ad campaigns.

**Tech Stack:** Next.js 16, @next/third-parties/google, GA4 Measurement Protocol

---

## File Structure

### New Files
| File | Responsibility |
|------|----------------|
| `lib/analytics.ts` | GA4 event tracking helpers with typed event functions |
| `lib/utm.ts` | UTM parameter capture and retrieval from sessionStorage |
| `lib/structured-data.ts` | JSON-LD schema generators for WebApplication, Course, FAQ |
| `components/providers/analytics-provider.tsx` | Client component to initialize GA4 and capture UTMs |
| `app/lp/layout.tsx` | Minimal layout for landing pages (no header/footer) |
| `app/lp/free-practice-exam/page.tsx` | First ad landing page |
| `app/study/[topic]/layout.tsx` | Dynamic metadata for topic pages |
| `public/favicon.ico` | Browser tab icon |
| `public/apple-touch-icon.png` | iOS home screen icon |
| `public/icon-192.png` | PWA icon small |
| `public/icon-512.png` | PWA icon large |
| `public/og-image.png` | Static OpenGraph fallback |

### Modified Files
| File | Changes |
|------|---------|
| `app/layout.tsx` | Add GA4, Google verification, AnalyticsProvider |
| `app/page.tsx` | Add WebApplication structured data |
| `app/study/page.tsx` | Improve metadata, add Course structured data |
| `app/study/[topic]/page.tsx` | Remove to separate layout for metadata |
| `app/practice/page.tsx` | Improve metadata with keywords |
| `app/exam/page.tsx` | Improve metadata with keywords |
| `app/cheatsheet/page.tsx` | Improve metadata, add FAQ structured data |
| `app/pricing/page.tsx` | Improve metadata, add FAQ structured data |
| `app/manifest.ts` | Add PNG icons |
| `app/api/stripe/checkout/route.ts` | Pass UTM params to Stripe metadata |
| `app/api/stripe/webhook/route.ts` | Add server-side GA4 purchase event |
| `components/layout/footer.tsx` | Add Pricing link for internal linking |

---

## Task 1: Create Analytics Module

**Files:**
- Create: `lib/analytics.ts`

- [ ] **Step 1: Create the analytics module with typed events**

```ts
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
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/analytics.ts | head -20`
Expected: Shows the analytics module with trackEvent function

- [ ] **Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat(seo): add GA4 analytics module with typed events"
```

---

## Task 2: Create UTM Module

**Files:**
- Create: `lib/utm.ts`

- [ ] **Step 1: Create the UTM capture module**

```ts
// lib/utm.ts

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const UTM_STORAGE_KEY = "mendix_prep_utm";

export type UTMParams = Partial<Record<(typeof UTM_PARAMS)[number], string>>;

export function captureUTM(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  for (const key of UTM_PARAMS) {
    const value = params.get(key);
    if (value) {
      utm[key] = value;
    }
  }

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
  }
}

export function getUTM(): UTMParams | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as UTMParams;
  } catch {
    return null;
  }
}

export function clearUTM(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(UTM_STORAGE_KEY);
}
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/utm.ts | head -20`
Expected: Shows UTM module with captureUTM function

- [ ] **Step 3: Commit**

```bash
git add lib/utm.ts
git commit -m "feat(seo): add UTM parameter capture module"
```

---

## Task 3: Create Structured Data Module

**Files:**
- Create: `lib/structured-data.ts`

- [ ] **Step 1: Create JSON-LD schema generators**

```ts
// lib/structured-data.ts

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

export interface FAQItem {
  question: string;
  answer: string;
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mendix Prep",
    description:
      "Free practice exams and study materials for Mendix Intermediate Developer Certification",
    url: SITE_URL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with limited features",
    },
  };
}

export function courseSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Mendix Intermediate Certification Prep",
    description:
      "Comprehensive preparation course covering all exam topics for Mendix Intermediate Developer Certification",
    provider: {
      "@type": "Organization",
      name: "Mendix Prep",
      url: SITE_URL,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT30H",
    },
  };
}

export function faqSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Verify file created**

Run: `cat lib/structured-data.ts | head -30`
Expected: Shows structured data module with webApplicationSchema

- [ ] **Step 3: Commit**

```bash
git add lib/structured-data.ts
git commit -m "feat(seo): add JSON-LD structured data generators"
```

---

## Task 4: Create Analytics Provider Component

**Files:**
- Create: `components/providers/analytics-provider.tsx`

- [ ] **Step 1: Create the client-side analytics provider**

```tsx
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
```

- [ ] **Step 2: Verify file created**

Run: `cat components/providers/analytics-provider.tsx`
Expected: Shows AnalyticsProvider component

- [ ] **Step 3: Commit**

```bash
git add components/providers/analytics-provider.tsx
git commit -m "feat(seo): add analytics provider for UTM capture and page tracking"
```

---

## Task 5: Update Root Layout with GA4 and Verification

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add GA4, verification, and analytics provider to layout**

Add imports at top of file:

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";
import { AnalyticsProvider } from "@/components/providers/analytics-provider";
import { Suspense } from "react";
```

Add Google verification to metadata (after line 74):

```tsx
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
```

Wrap children with AnalyticsProvider and add GoogleAnalytics in body (replace lines 91-95):

```tsx
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <TooltipProvider>
          <Header />
          <main className="flex-1">
            <Suspense fallback={null}>
              <AnalyticsProvider>{children}</AnalyticsProvider>
            </Suspense>
          </main>
          <Footer />
        </TooltipProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
```

- [ ] **Step 2: Install @next/third-parties**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm install @next/third-parties`
Expected: Package installed successfully

- [ ] **Step 3: Verify layout compiles**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | head -30`
Expected: Build starts without import errors

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx package.json package-lock.json
git commit -m "feat(seo): add GA4 and Google verification to root layout"
```

---

## Task 6: Add Structured Data to Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add WebApplication schema to homepage**

Add import at top:

```tsx
import { JsonLd, webApplicationSchema } from "@/lib/structured-data";
```

Add JsonLd component at start of returned JSX (after the opening div on line 37):

```tsx
export default function HomePage() {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16">
      <JsonLd data={webApplicationSchema()} />
      {/* rest of content */}
```

- [ ] **Step 2: Verify the page renders**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | grep -E "(error|Error|page\.tsx)" | head -10`
Expected: No errors related to page.tsx

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(seo): add WebApplication structured data to homepage"
```

---

## Task 7: Improve Study Page Metadata and Add Course Schema

**Files:**
- Modify: `app/study/page.tsx`

- [ ] **Step 1: Update metadata and add structured data**

Replace the metadata export (lines 6-10):

```tsx
export const metadata: Metadata = {
  title: "Study Guide - Mendix Intermediate Certification Topics",
  description:
    "Master all 6 exam topics with interactive flashcards and AI explanations. Free Mendix study guide covering domain models, microflows, security, XPath, and more.",
  keywords: [
    "mendix study guide",
    "mendix topics",
    "mendix flashcards",
    "mendix intermediate certification",
  ],
};
```

Add import for structured data at top:

```tsx
import { JsonLd, courseSchema } from "@/lib/structured-data";
```

Add JsonLd inside the component after opening div:

```tsx
export default function StudyPage() {
  const flashcards = flashcardsData as Record<string, unknown[]>;

  return (
    <div className="container mx-auto px-4 py-8">
      <JsonLd data={courseSchema()} />
      {/* rest of content */}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | grep -E "study" | head -5`
Expected: study page compiles

- [ ] **Step 3: Commit**

```bash
git add app/study/page.tsx
git commit -m "feat(seo): improve study page metadata and add Course schema"
```

---

## Task 8: Add Dynamic Metadata for Topic Pages

**Files:**
- Create: `app/study/[topic]/layout.tsx`

- [ ] **Step 1: Create layout with generateMetadata for topic pages**

```tsx
// app/study/[topic]/layout.tsx
import type { Metadata } from "next";
import { getTopicById, topics } from "@/lib/content/topics";

interface LayoutProps {
  params: Promise<{ topic: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic: topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    return {
      title: "Topic Not Found",
    };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://mendix-prep.vercel.app";

  return {
    title: `${topic.name} - Mendix Study Guide`,
    description: `Learn ${topic.name} for Mendix Intermediate Certification. ${topic.description}. Interactive flashcards with AI explanations.`,
    keywords: [
      `mendix ${topic.name.toLowerCase()}`,
      `mendix ${topicId}`,
      "mendix certification",
      "mendix study guide",
    ],
    alternates: {
      canonical: `${siteUrl}/study/${topicId}`,
    },
  };
}

export async function generateStaticParams() {
  return topics.map((topic) => ({
    topic: topic.id,
  }));
}

export default function TopicLayout({ children }: LayoutProps) {
  return children;
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | grep -E "(topic|study)" | head -10`
Expected: Topic pages compile with static params

- [ ] **Step 3: Commit**

```bash
git add app/study/[topic]/layout.tsx
git commit -m "feat(seo): add dynamic metadata for topic study pages"
```

---

## Task 9: Improve Practice Page Metadata

**Files:**
- Modify: `app/practice/page.tsx`

- [ ] **Step 1: Update metadata**

Replace the metadata export (lines 7-11):

```tsx
export const metadata: Metadata = {
  title: "Practice Quiz - 268 Mendix Exam Questions",
  description:
    "Test your knowledge with 268 real exam-style questions. Free practice for Mendix Intermediate certification with instant feedback and progress tracking.",
  keywords: [
    "mendix practice test",
    "mendix quiz",
    "mendix exam questions",
    "mendix certification practice",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add app/practice/page.tsx
git commit -m "feat(seo): improve practice page metadata with keywords"
```

---

## Task 10: Improve Exam Page Metadata

**Files:**
- Modify: `app/exam/page.tsx`

- [ ] **Step 1: Update metadata**

Replace the metadata export (lines 8-12):

```tsx
export const metadata: Metadata = {
  title: "Mock Exam - Timed Mendix Certification Simulation",
  description:
    "Simulate the real exam with timed 50-question tests. Track your readiness for Mendix Intermediate certification under realistic conditions.",
  keywords: [
    "mendix mock exam",
    "mendix exam simulator",
    "mendix certification test",
    "mendix timed exam",
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add app/exam/page.tsx
git commit -m "feat(seo): improve exam page metadata with keywords"
```

---

## Task 11: Improve Cheatsheet Page with FAQ Schema

**Files:**
- Modify: `app/cheatsheet/page.tsx`

- [ ] **Step 1: Update metadata and add FAQ schema**

Replace the metadata export (lines 6-10):

```tsx
export const metadata: Metadata = {
  title: "Mendix Cheatsheet - Quick Reference Guide",
  description:
    "Quick reference for microflows, nanoflows, security, XPath and more. Print-friendly Mendix cheatsheet for exam preparation.",
  keywords: [
    "mendix cheatsheet",
    "mendix reference",
    "mendix quick guide",
    "mendix exam cheatsheet",
  ],
};
```

Add imports at top:

```tsx
import { JsonLd, faqSchema } from "@/lib/structured-data";
```

Add FAQ data and JsonLd after the getCheatsheetContent function:

```tsx
const cheatsheetFAQs = [
  {
    question: "What is the difference between microflows and nanoflows?",
    answer:
      "Microflows run server-side and are used for complex business logic, database operations, and integrations. Nanoflows run client-side in the browser or on mobile devices, making them faster for simple operations and essential for offline functionality.",
  },
  {
    question: "How do access rules work in Mendix?",
    answer:
      "Access rules in Mendix control which users can read, create, update, or delete entity instances based on their user role. They are defined at the entity level in the domain model and can include XPath constraints to limit access to specific records.",
  },
  {
    question: "What XPath functions are commonly used in Mendix?",
    answer:
      "Common XPath functions include contains(), starts-with(), not(), and/or operators, and comparison operators. You can also use tokens like [%CurrentUser%] and [%CurrentDateTime%] for dynamic queries.",
  },
];

export default async function CheatsheetPage() {
  const content = await getCheatsheetContent();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqSchema(cheatsheetFAQs)} />
      {/* rest of content */}
```

- [ ] **Step 2: Commit**

```bash
git add app/cheatsheet/page.tsx
git commit -m "feat(seo): improve cheatsheet metadata and add FAQ schema"
```

---

## Task 12: Improve Pricing Page with FAQ Schema

**Files:**
- Modify: `app/pricing/page.tsx`

- [ ] **Step 1: Update metadata and add FAQ schema**

Replace the metadata export (lines 5-9):

```tsx
export const metadata: Metadata = {
  title: "Pricing - Mendix Prep Premium",
  description:
    "Unlock all practice questions and exam simulations. One-time purchase for lifetime access to Mendix Intermediate Certification prep.",
  keywords: [
    "mendix prep pricing",
    "mendix certification cost",
    "mendix study premium",
  ],
};
```

Add imports at top:

```tsx
import { JsonLd, faqSchema } from "@/lib/structured-data";
```

Add FAQ data and JsonLd (the FAQs are already in the page, extract them):

```tsx
const pricingFAQs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, iDEAL, and Bancontact through our secure payment provider Stripe.",
  },
  {
    question: "Is the free tier really free?",
    answer:
      "Yes! The free tier includes 10 practice questions per day and 1 exam simulation per week. No credit card required.",
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <JsonLd data={faqSchema(pricingFAQs)} />
      {/* rest of content */}
```

- [ ] **Step 2: Commit**

```bash
git add app/pricing/page.tsx
git commit -m "feat(seo): improve pricing metadata and add FAQ schema"
```

---

## Task 13: Update Manifest with PNG Icons

**Files:**
- Modify: `app/manifest.ts`

- [ ] **Step 1: Update manifest to include PNG icons**

Replace the entire file:

```ts
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mendix Prep - Intermediate Certification Study Guide",
    short_name: "Mendix Prep",
    description:
      "Free practice exams and study materials for the Mendix Intermediate Developer Certification",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0595DB",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
    ],
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/manifest.ts
git commit -m "feat(seo): update manifest with PNG icon references"
```

---

## Task 14: Create Icon Assets

**Files:**
- Create: `public/favicon.ico`
- Create: `public/apple-touch-icon.png`
- Create: `public/icon-192.png`
- Create: `public/icon-512.png`
- Create: `public/og-image.png`

- [ ] **Step 1: Create placeholder icons using ImageMagick or similar**

Note: For production, these should be properly designed. For now, create simple placeholders.

Run the following to check if ImageMagick is available:
```bash
which convert || echo "ImageMagick not installed - create icons manually"
```

If ImageMagick is available, create simple gradient icons:
```bash
cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/public

# Create 512x512 base icon (blue gradient with "M")
convert -size 512x512 xc:'#0595DB' -fill white -font Helvetica-Bold -pointsize 300 -gravity center -annotate 0 "M" icon-512.png

# Resize for other sizes
convert icon-512.png -resize 192x192 icon-192.png
convert icon-512.png -resize 180x180 apple-touch-icon.png
convert icon-512.png -resize 32x32 favicon-32.png
convert icon-512.png -resize 16x16 favicon-16.png

# Create favicon.ico with multiple sizes
convert favicon-16.png favicon-32.png favicon.ico
rm favicon-16.png favicon-32.png

# Create OG image (1200x630)
convert -size 1200x630 xc:'#0a0a0a' -fill '#0595DB' -font Helvetica-Bold -pointsize 72 -gravity center -annotate 0 "Mendix Prep\nCertification Study Guide" og-image.png
```

If ImageMagick is not available, the user should create these manually or use an online tool.

- [ ] **Step 2: Verify icons exist**

Run: `ls -la /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/public/*.png /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/public/*.ico 2>/dev/null | wc -l`
Expected: 5 (five icon files)

- [ ] **Step 3: Commit**

```bash
git add public/favicon.ico public/apple-touch-icon.png public/icon-192.png public/icon-512.png public/og-image.png
git commit -m "feat(seo): add favicon and app icons"
```

---

## Task 15: Add UTM to Stripe Checkout

**Files:**
- Modify: `app/api/stripe/checkout/route.ts`

- [ ] **Step 1: Update checkout route to accept UTM from request body**

Replace the entire POST function:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS } from "@/lib/stripe/config";
import { getOrCreateStripeCustomer } from "@/lib/stripe/subscription";

interface CheckoutRequestBody {
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body for UTM params
    let utm: CheckoutRequestBody["utm"] = {};
    try {
      const body = (await request.json()) as CheckoutRequestBody;
      utm = body.utm || {};
    } catch {
      // No body or invalid JSON - continue without UTM
    }

    const priceId = PLANS.pro.price.priceId;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not configured" },
        { status: 500 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card", "ideal", "bancontact"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/account?success=true`,
      cancel_url: `${siteUrl}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        // Include UTM params for attribution tracking
        ...(utm.utm_source && { utm_source: utm.utm_source }),
        ...(utm.utm_medium && { utm_medium: utm.utm_medium }),
        ...(utm.utm_campaign && { utm_campaign: utm.utm_campaign }),
        ...(utm.utm_term && { utm_term: utm.utm_term }),
        ...(utm.utm_content && { utm_content: utm.utm_content }),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/api/stripe/checkout/route.ts
git commit -m "feat(sea): pass UTM parameters to Stripe checkout metadata"
```

---

## Task 16: Add Server-Side Purchase Tracking to Webhook

**Files:**
- Modify: `app/api/stripe/webhook/route.ts`

- [ ] **Step 1: Add GA4 Measurement Protocol tracking**

Add after the imports at top of file:

```ts
// GA4 Measurement Protocol for server-side tracking
async function trackPurchaseServerSide(
  transactionId: string,
  value: number,
  currency: string,
  metadata: Record<string, string>
) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_MEASUREMENT_PROTOCOL_SECRET;

  if (!measurementId || !apiSecret) {
    console.log("GA4 Measurement Protocol not configured, skipping server-side tracking");
    return;
  }

  const payload = {
    client_id: metadata.userId || "server",
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: transactionId,
          value,
          currency,
          // Include UTM for attribution
          ...(metadata.utm_source && { campaign_source: metadata.utm_source }),
          ...(metadata.utm_medium && { campaign_medium: metadata.utm_medium }),
          ...(metadata.utm_campaign && { campaign_name: metadata.utm_campaign }),
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error("GA4 Measurement Protocol error:", response.status);
    }
  } catch (error) {
    console.error("Failed to send GA4 server-side event:", error);
  }
}
```

Update the checkout.session.completed handler to track purchase:

```ts
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Handle one-time payment
        if (session.mode === "payment" && session.payment_status === "paid") {
          const customerId = session.customer as string;
          const paymentIntentId = session.payment_intent as string;
          await grantLifetimeAccess(customerId, paymentIntentId);

          // Track purchase server-side for attribution
          const metadata = (session.metadata || {}) as Record<string, string>;
          const amountTotal = session.amount_total || 0;
          await trackPurchaseServerSide(
            paymentIntentId,
            amountTotal / 100, // Convert cents to currency units
            session.currency?.toUpperCase() || "EUR",
            metadata
          );
        }
        break;
      }
```

- [ ] **Step 2: Commit**

```bash
git add app/api/stripe/webhook/route.ts
git commit -m "feat(sea): add server-side GA4 purchase tracking via Measurement Protocol"
```

---

## Task 17: Add Pricing Link to Footer

**Files:**
- Modify: `components/layout/footer.tsx`

- [ ] **Step 1: Add Pricing link to footer navigation**

Add Pricing link after Cheatsheet in the nav (around line 33):

```tsx
                <Link href="/cheatsheet" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cheatsheet
                </Link>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/footer.tsx
git commit -m "feat(seo): add Pricing link to footer for internal linking"
```

---

## Task 18: Create Landing Page Layout

**Files:**
- Create: `app/lp/layout.tsx`

- [ ] **Step 1: Create minimal layout without header/footer**

```tsx
// app/lp/layout.tsx
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  robots: {
    index: false, // Don't index landing pages by default
    follow: true,
  },
};

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/lp/layout.tsx
git commit -m "feat(sea): create minimal landing page layout"
```

---

## Task 19: Create Free Practice Exam Landing Page

**Files:**
- Create: `app/lp/free-practice-exam/page.tsx`

- [ ] **Step 1: Create the landing page**

```tsx
// app/lp/free-practice-exam/page.tsx
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
    index: true, // Override layout default for this page
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
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/signup">Start Practicing - It&apos;s Free</Link>
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
          <Button size="lg" asChild>
            <Link href="/signup">Start Free Practice</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build 2>&1 | grep -E "(lp|landing)" | head -5`
Expected: Landing page compiles

- [ ] **Step 3: Commit**

```bash
git add app/lp/free-practice-exam/page.tsx
git commit -m "feat(sea): create free practice exam landing page"
```

---

## Task 20: Add Environment Variables Template

**Files:**
- Modify: `.env.local` (document required variables)

- [ ] **Step 1: Document new environment variables**

Create or update `.env.example` with the new variables:

```bash
cat >> /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep/.env.example << 'EOF'

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Search Console Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code

# GA4 Measurement Protocol (for server-side tracking)
GA_MEASUREMENT_PROTOCOL_SECRET=your-api-secret
EOF
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add GA4 and SEO environment variables to example"
```

---

## Task 21: Final Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Verify sitemap includes landing page**

Run: `cd /Users/davidvos/Desktop/Projects/Active/MendixIntermediateCertification/mendix-prep && npm run build && cat .next/server/app/sitemap.xml/route.js 2>/dev/null | grep -o "lp" || echo "Sitemap check - landing pages excluded as expected"`
Expected: Landing pages not in sitemap (they have noindex)

- [ ] **Step 3: Create final commit with all changes**

```bash
git add -A
git status
# If there are any uncommitted changes:
git commit -m "feat(seo): complete SEO and SEA optimization implementation"
```

---

## Summary

This plan implements:

1. **Technical SEO Foundation**
   - GA4 analytics with typed event tracking
   - Google Search Console verification
   - Favicon and app icons
   - Structured data (WebApplication, Course, FAQ schemas)

2. **On-Page SEO**
   - Page-specific metadata for all routes
   - Dynamic metadata for topic pages
   - Keywords optimization

3. **SEA Preparation**
   - UTM parameter capture and storage
   - UTM → Stripe metadata flow
   - Server-side purchase tracking
   - Landing page template and first ad page

**After completing this plan:**
1. Create GA4 property and add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.local`
2. Verify site in Google Search Console and add verification code
3. Create GA4 Measurement Protocol secret for server-side tracking
4. Mark conversions in GA4: sign_up, begin_checkout, purchase
5. Define remarketing audiences in GA4
