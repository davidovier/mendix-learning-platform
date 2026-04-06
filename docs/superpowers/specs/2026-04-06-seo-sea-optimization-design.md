# SEO & SEA Optimization Design Spec

**Date:** 2026-04-06
**Project:** Mendix Prep
**Scope:** Full SEO foundation + SEA preparation

## Context

Mendix Prep is a Next.js exam preparation app for the Mendix Intermediate Developer Certification. It offers free practice exams, AI-powered explanations, and progress tracking. Monetization is freemium with a one-time purchase option.

### Goals
- **Primary:** Organic SEO growth — rank for "Mendix certification" related searches
- **Secondary:** Prepare infrastructure for paid acquisition (Google Ads) once conversion data exists

### Target Audience
- Individual developers studying for career advancement
- Bootcamp students supplementing formal Mendix training
- Global English-speaking audience

### Differentiators
- Free practice exams (Mendix Academy doesn't offer realistic mocks)
- AI-powered explanations for wrong answers
- Progress tracking to identify weak areas

### Current State
- Basic metadata in `layout.tsx` (title, description, keywords)
- OpenGraph + Twitter cards configured
- `sitemap.ts` and `robots.ts` present
- Dynamic `opengraph-image.tsx` exists
- **Missing:** Google verification, structured data, page-specific metadata, favicon, analytics

---

## Section 1: Technical SEO Foundation

### 1.1 Google Search Console & Verification
- Add `verification.google` to `layout.tsx` metadata export
- Create GSC property for `mendix-prep.vercel.app`
- Submit sitemap URL (`/sitemap.xml`) to GSC after verification

### 1.2 Favicon & App Icons
Create in `/public`:
| File | Size | Purpose |
|------|------|---------|
| `favicon.ico` | 16x16, 32x32 | Browser tab icon |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `icon-192.png` | 192x192 | PWA small |
| `icon-512.png` | 512x512 | PWA large |

Update `app/manifest.ts`:
```ts
icons: [
  { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
  { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
]
```

### 1.3 OpenGraph Image
- Generate static `og-image.png` (1200x630) in `/public` as fallback
- Keep dynamic `opengraph-image.tsx` for page-specific images
- Ensure image shows: logo, tagline, visual that conveys "exam prep"

### 1.4 Canonical URLs
Add to each page's metadata:
```ts
alternates: {
  canonical: 'https://mendix-prep.vercel.app/path',
}
```

---

## Section 2: On-Page SEO Optimization

### 2.1 Page-Specific Metadata

| Route | Title | Description | Priority Keywords |
|-------|-------|-------------|-------------------|
| `/` | "Mendix Prep - Intermediate Certification Study Guide" | (existing, good) | mendix certification, mendix intermediate |
| `/study` | "Study Guide - Mendix Intermediate Certification Topics" | "Master all 6 exam topics with interactive flashcards and AI explanations." | mendix study guide, mendix topics |
| `/practice` | "Practice Quiz - 268 Mendix Exam Questions" | "Test your knowledge with 268 real exam-style questions. Free practice for Mendix Intermediate certification." | mendix practice test, mendix quiz |
| `/exam` | "Mock Exam - Timed Mendix Certification Simulation" | "Simulate the real exam with timed 50-question tests. Track your readiness for Mendix Intermediate certification." | mendix mock exam, mendix exam simulator |
| `/cheatsheet` | "Mendix Cheatsheet - Quick Reference Guide" | "Quick reference for microflows, nanoflows, security, XPath and more. Print-friendly Mendix cheatsheet." | mendix cheatsheet, mendix reference |
| `/pricing` | "Pricing - Mendix Prep Premium" | "Unlock all practice questions and exam simulations. One-time purchase, lifetime access." | (conversion page) |
| `/study/[topic]` | "{Topic Name} - Mendix Study Guide" | Dynamic description per topic | topic-specific |

### 2.2 Heading Hierarchy
- Every page must have exactly one `<h1>` matching page purpose
- Use `<h2>` for major sections, `<h3>` for subsections
- Audit existing pages and fix any violations

### 2.3 Internal Linking
- Add "Related Topics" links on `/study/[topic]` pages
- Practice page links to relevant study topics for wrong answers
- Footer includes links to all main sections
- Add breadcrumbs: Home > Study > {Topic Name}

---

## Section 3: Structured Data (JSON-LD)

### 3.1 WebApplication Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Mendix Prep",
  "description": "Free practice exams and study materials for Mendix Intermediate Developer Certification",
  "url": "https://mendix-prep.vercel.app",
  "applicationCategory": "EducationalApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier with limited features"
  }
}
```

### 3.2 Course Schema (Study Section)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Mendix Intermediate Certification Prep",
  "description": "Comprehensive preparation course covering all exam topics",
  "provider": {
    "@type": "Organization",
    "name": "Mendix Prep",
    "url": "https://mendix-prep.vercel.app"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT30H"
  }
}
```

### 3.3 FAQPage Schema
Apply to `/cheatsheet` and selected practice questions:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between microflows and nanoflows?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Microflows run server-side, nanoflows run client-side..."
      }
    }
  ]
}
```

### 3.4 Implementation
Create `lib/structured-data.ts`:
```ts
export function webApplicationSchema() { ... }
export function courseSchema() { ... }
export function faqSchema(questions: FAQ[]) { ... }
```

Add to pages via metadata or script tag in component.

---

## Section 4: Analytics & Tracking Setup

### 4.1 Google Analytics 4 Setup
- Create GA4 property in Google Analytics
- Add env var: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Install via `@next/third-parties/google` (recommended for Next.js)

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

// In body:
<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
```

### 4.2 Event Tracking

| Event Name | Trigger | Parameters |
|------------|---------|------------|
| `sign_up` | Account created | `method` |
| `login` | User logs in | `method` |
| `page_view` | (automatic) | — |
| `start_study` | Opens study topic | `topic_id`, `topic_name` |
| `start_practice` | Begins practice quiz | `question_count` |
| `start_exam` | Starts mock exam | `exam_id` |
| `complete_exam` | Finishes mock exam | `exam_id`, `score`, `duration` |
| `view_pricing` | Views pricing page | — |
| `begin_checkout` | Clicks purchase | `value`, `currency` |
| `purchase` | Payment succeeds | `transaction_id`, `value`, `currency` |

### 4.3 Analytics Module
Create `lib/analytics.ts`:
```ts
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params)
  }
}

export const analytics = {
  signUp: (method: string) => trackEvent('sign_up', { method }),
  startExam: (examId: string) => trackEvent('start_exam', { exam_id: examId }),
  purchase: (transactionId: string, value: number) =>
    trackEvent('purchase', { transaction_id: transactionId, value, currency: 'USD' }),
  // ... etc
}
```

### 4.4 Server-Side Purchase Tracking
In Stripe webhook (`app/api/stripe/webhook/route.ts`):
- On `checkout.session.completed`, send purchase event to GA4 via Measurement Protocol
- Include UTM data stored in Stripe metadata for attribution

### 4.5 Google Search Console
- Verify via HTML meta tag in `layout.tsx`
- Link GSC to GA4 property for search query data

---

## Section 5: SEA Preparation

### 5.1 UTM Parameter Handling
Create `lib/utm.ts`:
```ts
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']

export function captureUTM() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}

  UTM_PARAMS.forEach(key => {
    const value = params.get(key)
    if (value) utm[key] = value
  })

  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem('utm', JSON.stringify(utm))
  }
}

export function getUTM(): Record<string, string> | null {
  if (typeof window === 'undefined') return null
  const stored = sessionStorage.getItem('utm')
  return stored ? JSON.parse(stored) : null
}
```

Call `captureUTM()` in root layout client component on mount.

### 5.2 UTM → Stripe Metadata
When creating checkout session, include UTM data:
```ts
const utm = getUTM()
const session = await stripe.checkout.sessions.create({
  // ...
  metadata: {
    ...utm,
    user_id: userId,
  }
})
```

### 5.3 Conversion Tracking Setup
Configure in GA4 Admin:
- Mark `sign_up` as conversion
- Mark `begin_checkout` as conversion
- Mark `purchase` as conversion (with value)

These become importable as Google Ads conversions later.

### 5.4 Landing Page Template
Create `/app/lp/[slug]/page.tsx`:

**Structure:**
```
┌─────────────────────────────────────┐
│ Hero: Headline + CTA               │
│ "Free Mendix Practice Exam"        │
│ [Start Now - It's Free]            │
├─────────────────────────────────────┤
│ Value Props (3 columns)            │
│ - 268 Questions                     │
│ - AI Explanations                   │
│ - Progress Tracking                 │
├─────────────────────────────────────┤
│ Social Proof                        │
│ (placeholder for testimonials)      │
├─────────────────────────────────────┤
│ FAQ Section                         │
│ (objection handling)                │
├─────────────────────────────────────┤
│ Final CTA                           │
│ [Start Practicing Free]             │
└─────────────────────────────────────┘
```

**Initial landing page:** `/lp/free-practice-exam`
- No header navigation (reduce distractions)
- Single focused CTA
- UTM-aware (passes attribution through signup)

### 5.5 Remarketing Audiences (GA4 Definitions)
Define these audiences in GA4 for future ad targeting:

| Audience | Definition |
|----------|------------|
| Exam Abandoners | Started exam but didn't complete (7 days) |
| Pricing Viewers | Viewed pricing, no purchase (14 days) |
| Free Users | Signed up, no purchase (30 days) |
| High Engagers | 3+ practice sessions, no purchase |

No ad spend required — audiences build passively from traffic.

---

## Implementation Priority

### Phase 1: Technical Foundation (Day 1)
1. Google Search Console verification
2. Favicon and app icons
3. Static OG image fallback
4. GA4 setup with basic tracking

### Phase 2: On-Page SEO (Day 2)
1. Page-specific metadata for all routes
2. Canonical URLs
3. Heading hierarchy audit
4. Internal linking improvements

### Phase 3: Structured Data (Day 3)
1. Create `lib/structured-data.ts`
2. Add WebApplication schema to homepage
3. Add Course schema to study pages
4. Add FAQ schema to cheatsheet

### Phase 4: Advanced Tracking (Day 4)
1. Full event tracking implementation
2. UTM capture and storage
3. Stripe metadata integration
4. Server-side purchase tracking

### Phase 5: SEA Preparation (Day 5)
1. Landing page template
2. `/lp/free-practice-exam` page
3. GA4 audience definitions
4. Conversion goal configuration

---

## Success Metrics

### SEO (measure after 30-90 days)
- Google Search Console impressions for target keywords
- Organic traffic to `/study`, `/practice`, `/exam`
- Click-through rate from search results
- Indexed pages count

### SEA Readiness (verify before running ads)
- UTM parameters flow through to Stripe
- Purchase events fire with correct value
- Audiences are building in GA4
- Landing page loads < 2s

---

## Files to Create/Modify

### New Files
- `lib/analytics.ts` — GA4 event helpers
- `lib/utm.ts` — UTM capture/retrieval
- `lib/structured-data.ts` — JSON-LD generators
- `app/lp/[slug]/page.tsx` — Landing page template
- `app/lp/free-practice-exam/page.tsx` — First landing page
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/og-image.png`

### Modified Files
- `app/layout.tsx` — Add verification, GA4, UTM capture
- `app/page.tsx` — Add structured data
- `app/study/page.tsx` — Add metadata, structured data
- `app/study/[topic]/page.tsx` — Add dynamic metadata, breadcrumbs
- `app/practice/page.tsx` — Add metadata
- `app/exam/page.tsx` — Add metadata
- `app/cheatsheet/page.tsx` — Add metadata, FAQ schema
- `app/pricing/page.tsx` — Add metadata
- `app/manifest.ts` — Add icons
- `app/api/stripe/checkout/route.ts` — Add UTM to metadata
- `app/api/stripe/webhook/route.ts` — Add server-side purchase tracking
- `.env.local` — Add GA4 measurement ID, Google verification code
