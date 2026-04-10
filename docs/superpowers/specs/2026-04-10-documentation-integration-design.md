# Documentation Content Integration Design

**Date:** 2026-04-10  
**Status:** Approved  

## Overview

Integrate the 35 new documentation files (topic guides, exam Q&A, cheatsheet) into the existing app to enhance study, practice, and exam features.

## Goals

1. **Updated cheatsheet** - Replace old cheatsheet with comprehensive new version
2. **Study guide accordions** - Add collapsible topic guides alongside flashcards
3. **Enhanced flashcards** - Generate exam-pattern flashcards from Q&A files
4. **Richer explanations** - Merge detailed explanations into practice questions

## Non-Goals

- No new routes (all features enhance existing pages)
- No database schema changes
- No authentication/authorization changes

## Architecture

### File Flow

```
documentation/
├── 01-12-*.md (topic guides) → Study page accordions + flashcards source
├── 13-19-*.md (exam Q&A)     → Exam-pattern flashcards + question explanations
└── 20-cheatsheet.md          → Cheatsheet page content
```

### Existing Infrastructure

The `topics.ts` file already maps topics to documentation files:

```typescript
{
  id: "domain-model",
  sourceFile: "01-domain-model.md",      // topic guide
  questionFiles: ["13-exam-questions-domain-model.md"]  // exam Q&A
}
```

## Feature 1: Cheatsheet Update

### Implementation

Replace `lib/content/docs/cheatsheet.md` with content from `documentation/20-quick-reference-cheatsheet.md`.

### Rationale

Keep content in `lib/content/docs/` for consistency with existing content organization.

### Files Changed

| File | Change |
|------|--------|
| `lib/content/docs/cheatsheet.md` | Replaced with new content (265 lines vs 230 lines) |

## Feature 2: Study Guide Accordions

### User Experience

On `/study/[topic]`, collapsible study guide sections appear above the flashcard area:

```
┌─────────────────────────────┐
│  Study Guide                │
│  [▸ Overview              ] │
│  [▸ Entities              ] │
│  [▸ Attributes            ] │
│  [▾ Associations          ] │
│    Content visible here...  │
├─────────────────────────────┤
│  Flashcards (existing UI)   │
└─────────────────────────────┘
```

### Data Flow

1. Server component reads `documentation/{topic.sourceFile}`
2. Parse markdown into sections (split on `## ` headers)
3. Pass sections to `<StudyGuideAccordion sections={sections} />`
4. Flashcard component renders below (unchanged)

### Markdown Parsing

Split content on H2 headers (`## `):

```typescript
interface StudySection {
  title: string;      // H2 header text
  content: string;    // Markdown content until next H2
}

function parseMarkdownSections(markdown: string): StudySection[] {
  const sections = markdown.split(/^## /gm);
  return sections.slice(1).map(section => {
    const [title, ...content] = section.split('\n');
    return { title: title.trim(), content: content.join('\n').trim() };
  });
}
```

### Components

| Component | Purpose |
|-----------|---------|
| `components/study/study-guide-accordion.tsx` | Renders sections as shadcn Accordion |
| `components/study/study-section.tsx` | Renders markdown content within accordion item |

### Files Changed

| File | Change |
|------|--------|
| `components/study/study-guide-accordion.tsx` | New component (client, uses shadcn Accordion) |
| `app/study/[topic]/page.tsx` | Split into server wrapper + client component |

### Architecture Note

Current `page.tsx` is `"use client"` for flashcard state. New structure:

```
app/study/[topic]/
├── page.tsx           # Server component - reads markdown, passes to client
└── topic-study-client.tsx  # Client component - flashcards + accordion state
```

Server reads markdown at request time (cached by Next.js), passes parsed sections as props.

## Feature 3: Enhanced Flashcards

### Goal

Add exam-focused flashcards extracted from Q&A files (13-19) to `flashcards.json`.

### Source Format

Exam Q&A files have consistent patterns:

```markdown
### Exam Question:
> "What is the owner of an association between NPE and persistable entity?"

**Answer**: Non-persistable entity (NPE must always be the owner).
```

Also:

```markdown
### Exam Question Pattern:
> "What happens on commit of a non-persistable entity?"

**Answer**: Current attribute values and association values are stored in memory (NOT database).
```

### Parsing Strategy

1. Find all `### Exam Question` or `### Exam Question Pattern` headers
2. Extract quoted question text from following blockquote
3. Extract answer from `**Answer**:` line
4. Generate flashcard with `exam-pattern` tag

### Output Format

```json
{
  "id": "domain-model-exam-1",
  "topicId": "domain-model",
  "front": "What is the owner of an association between NPE and persistable entity?",
  "back": "Non-persistable entity (NPE must always be the owner).",
  "tags": ["domain-model", "exam-pattern"]
}
```

### Implementation

Build script `scripts/generate-exam-flashcards.ts`:

1. Read all exam Q&A files from `documentation/13-19-*.md`
2. Parse question/answer pairs using regex
3. Map to topic ID using filename or content matching
4. Append to existing `flashcards.json` (preserve existing cards)

### Files Changed

| File | Change |
|------|--------|
| `scripts/generate-exam-flashcards.ts` | New script |
| `lib/content/flashcards.json` | Appended exam-pattern flashcards |

## Feature 4: Enhanced Question Explanations

### Goal

Enrich `questions.json` with detailed explanations from exam Q&A files.

### Current State

```json
{
  "id": "q-47",
  "question": "For which entity type does Mendix create a database table?",
  "explanation": "For persistable entities only."
}
```

### Enhanced State

```json
{
  "id": "q-47",
  "question": "For which entity type does Mendix create a database table?",
  "explanation": "For persistable entities only.",
  "detailedExplanation": "Persistable entities (blue) create database tables. Non-persistable entities (orange) exist only in runtime memory. Key differences: persistable entities support indexes and domain model validation; non-persistable entities do not."
}
```

### Matching Strategy

1. Parse "Key Facts to Memorize" tables and detailed explanations from exam Q&A files
2. For each existing question in `questions.json`:
   - Normalize question text (lowercase, remove punctuation)
   - Check if exam Q&A contains the same or very similar question
   - Match criteria: question text overlap > 80% of words match
   - If match found, merge the detailed explanation
3. Output unmatched questions to console for manual review

### UI Change

`QuestionCard` component prefers `detailedExplanation` over `explanation`:

```typescript
const explanation = question.detailedExplanation || question.explanation;
```

### Files Changed

| File | Change |
|------|--------|
| `scripts/enhance-explanations.ts` | New script |
| `lib/content/questions.json` | Added detailedExplanation field where available |
| `components/practice/question-card.tsx` | Use detailedExplanation if present |

## Scripts Summary

| Script | Purpose | Run |
|--------|---------|-----|
| `scripts/update-cheatsheet.ts` | Copy new cheatsheet | Once |
| `scripts/generate-exam-flashcards.ts` | Parse exam Q&A → flashcards | Once, re-run if docs change |
| `scripts/enhance-explanations.ts` | Parse exam Q&A → enrich questions | Once, re-run if docs change |

## Dependencies

Check if `gray-matter` is needed for frontmatter parsing. If documentation files have frontmatter, add:

```bash
npm install gray-matter
```

Otherwise, simple string splitting suffices.

## Testing

1. **Cheatsheet**: Visual check that new content renders correctly
2. **Study Guide**: 
   - Accordions expand/collapse
   - Markdown renders correctly (tables, code blocks, lists)
   - All topics with sourceFile show guide
3. **Flashcards**: 
   - New exam-pattern cards appear in flashcard deck
   - Tags correctly applied
   - No duplicate cards
4. **Explanations**:
   - Questions with detailedExplanation show richer content
   - Fallback to explanation works for unenhanced questions

## Rollout

All changes are additive and backwards-compatible. Single deployment, no feature flags needed.
