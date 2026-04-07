# MDX Blog Design Spec

**Date:** 2026-04-07
**Project:** Mendix Prep
**Scope:** SEO-focused blog using MDX files

## Context

Mendix Prep needs a blog section to publish SEO content targeting long-tail keywords. This will help the site rank for searches like "mendix microflow vs nanoflow" and "mendix intermediate exam tips" while the main app pages build authority for head terms.

### Goals
- Rank for long-tail Mendix certification keywords
- Drive organic traffic to the main app
- Establish authority in the Mendix certification prep space

### Constraints
- Keep implementation simple (MDX files, no CMS)
- Reuse existing design system and components
- Minimal ongoing maintenance burden

---

## Architecture

### Approach
Use `@next/mdx` with Next.js App Router. Blog posts are `.mdx` files with frontmatter, stored in `content/blog/`. A utility module parses posts for listing pages.

### File Structure

```
content/
  blog/
    how-to-pass-mendix-intermediate-exam.mdx
    microflows-vs-nanoflows-explained.mdx
    mendix-xpath-cheat-sheet.mdx
    common-mendix-exam-mistakes.mdx
    mendix-security-access-rules.mdx

app/
  blog/
    page.tsx                    # Blog listing page
    [slug]/
      page.tsx                  # Individual post page

lib/
  blog.ts                       # Post parsing utilities

components/
  blog/
    post-card.tsx               # Card for listing page
    post-header.tsx             # Post title, date, category
    post-footer.tsx             # Related posts, CTAs
```

---

## Data Model

### Post Frontmatter

```yaml
---
title: "Post Title"
description: "Meta description for SEO (150-160 chars)"
date: "2026-04-07"
category: "Exam Tips" | "Concept Guide" | "Practice Strategy"
topics: ["microflows", "security", "xpath", ...]
image: "/blog/og-image.png"  # Optional, for social sharing
---
```

### Categories (content type)
- **Exam Tips** — Study strategies, time management, what to expect
- **Concept Guide** — Deep dives on specific Mendix topics
- **Practice Strategy** — How to use practice questions effectively

### Topics (exam topics)
Matches existing study topics: `domain-model`, `microflows`, `nanoflows`, `modules`, `security`, `pages`, `xpath`, `integration`, `java`, `events`, `enumerations`, `scheduled-events`, `agile`

---

## Blog Listing Page (`/blog`)

### Features
- Grid of post cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Category filter (tabs or pill buttons)
- Topic filter (clickable tags)
- Posts sorted by date descending
- Pagination if > 10 posts (future consideration)

### Post Card
- Title (h3, linked)
- Description (truncated to 2 lines)
- Date + category badge
- Topic tags (max 3 shown)

### SEO Metadata
```ts
export const metadata: Metadata = {
  title: "Blog - Mendix Certification Tips & Guides",
  description: "Expert tips, concept guides, and practice strategies for passing the Mendix Intermediate Developer Certification.",
  keywords: ["mendix blog", "mendix certification tips", "mendix guides"],
};
```

---

## Post Page (`/blog/[slug]`)

### Layout
```
┌─────────────────────────────────────┐
│ ← Back to Blog                      │
├─────────────────────────────────────┤
│ Category Badge    Reading Time      │
│                                     │
│ # Post Title                        │
│ Published: April 7, 2026            │
│                                     │
│ Topic tags: [Microflows] [Security] │
├─────────────────────────────────────┤
│                                     │
│ MDX Content                         │
│ (rendered with Tailwind typography) │
│                                     │
├─────────────────────────────────────┤
│ CTA: Try Practice Questions →       │
├─────────────────────────────────────┤
│ Related Posts                       │
│ [Card] [Card] [Card]                │
└─────────────────────────────────────┘
```

### Features
- Full MDX content with custom components available
- Reading time calculated from word count
- Related posts: same category OR overlapping topics (max 3)
- CTA linking to relevant /practice or /study page

### SEO Metadata (dynamic)
```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: [post.category, ...post.topics],
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}
```

### Structured Data (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post Title",
  "description": "Post description",
  "datePublished": "2026-04-07",
  "author": {
    "@type": "Organization",
    "name": "Mendix Prep"
  }
}
```

---

## Blog Utility Module (`lib/blog.ts`)

### Functions

```ts
// Get all posts (for listing page)
export async function getAllPosts(): Promise<Post[]>

// Get single post by slug (for post page)
export async function getPostBySlug(slug: string): Promise<Post | null>

// Get posts by category
export async function getPostsByCategory(category: string): Promise<Post[]>

// Get posts by topic
export async function getPostsByTopic(topic: string): Promise<Post[]>

// Get related posts (same category or overlapping topics)
export async function getRelatedPosts(post: Post, limit?: number): Promise<Post[]>

// Get all categories with post counts
export async function getCategories(): Promise<CategoryCount[]>

// Get all topics with post counts
export async function getTopics(): Promise<TopicCount[]>
```

### Post Type

```ts
interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  topics: string[];
  image?: string;
  content: string;        // Raw MDX content
  readingTime: number;    // Minutes
}
```

---

## Navigation Integration

### Footer
Add "Blog" link to footer navigation (after Pricing):
```tsx
<Link href="/blog">Blog</Link>
```

### Sitemap
Update `app/sitemap.ts` to include blog posts:
```ts
const blogPosts = await getAllPosts();
const blogUrls = blogPosts.map(post => ({
  url: `${siteUrl}/blog/${post.slug}`,
  lastModified: new Date(post.date),
  changeFrequency: "monthly",
  priority: 0.6,
}));
```

---

## Seed Posts

### Post 1: How to Pass the Mendix Intermediate Certification Exam
- **Target keyword:** mendix intermediate certification tips
- **Category:** Exam Tips
- **Topics:** general
- **Word count:** ~1200 words
- **Sections:** Exam overview, study timeline, topic priorities, exam day tips, practice strategy

### Post 2: Microflows vs Nanoflows: Complete Comparison
- **Target keyword:** mendix microflow vs nanoflow
- **Category:** Concept Guide
- **Topics:** microflows, nanoflows
- **Word count:** ~1000 words
- **Sections:** What are microflows, what are nanoflows, key differences table, when to use each, common mistakes

### Post 3: Mendix XPath Cheat Sheet with Examples
- **Target keyword:** mendix xpath examples
- **Category:** Concept Guide
- **Topics:** xpath
- **Word count:** ~800 words
- **Sections:** XPath basics, common functions, tokens, example queries, practice exercises

### Post 4: 10 Common Mistakes on the Mendix Intermediate Exam
- **Target keyword:** mendix exam mistakes
- **Category:** Exam Tips
- **Topics:** general
- **Word count:** ~1000 words
- **Sections:** List of 10 mistakes with explanations and how to avoid each

### Post 5: Understanding Mendix Security: Access Rules Explained
- **Target keyword:** mendix access rules
- **Category:** Concept Guide
- **Topics:** security
- **Word count:** ~1000 words
- **Sections:** Security model overview, module roles, entity access, XPath constraints, best practices

---

## Dependencies

### New Packages
- `@next/mdx` — MDX support for Next.js
- `@mdx-js/mdx` — MDX compiler (peer dependency)
- `@tailwindcss/typography` — Prose styling for blog content (if not already installed)

### Existing Packages Used
- `gray-matter` — Already installed, for parsing frontmatter

---

## Files to Create

| File | Purpose |
|------|---------|
| `content/blog/*.mdx` | 5 seed blog posts |
| `app/blog/page.tsx` | Blog listing page |
| `app/blog/[slug]/page.tsx` | Individual post page |
| `lib/blog.ts` | Post parsing utilities |
| `components/blog/post-card.tsx` | Card for listing |
| `components/blog/post-header.tsx` | Post header component |
| `components/blog/post-footer.tsx` | Related posts + CTA |
| `next.config.ts` | Update for MDX support |

## Files to Modify

| File | Changes |
|------|---------|
| `components/layout/footer.tsx` | Add Blog link |
| `app/sitemap.ts` | Include blog posts |
| `package.json` | Add @next/mdx, @tailwindcss/typography |

---

## Success Criteria

1. `/blog` shows all posts with filtering by category/topic
2. `/blog/[slug]` renders MDX content with proper styling
3. All 5 seed posts are published and accessible
4. Blog posts appear in sitemap
5. Each post has proper SEO metadata and Article schema
6. Build passes with no errors
