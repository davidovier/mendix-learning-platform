# Flashcard Exam Mode Design

## Overview

Add a drag-and-drop matching exam to the study page that appears after a user masters all flashcards in a topic. Users match flashcard titles (left) with their content (right) to reinforce learning.

## User Flow

```
Study Topic → Master all flashcards → Completion Screen
                                           │
                                     "Take Exam" button
                                           │
                                           ▼
                                      Exam Mode
                               (drag content to titles)
                                           │
                              ┌────────────┴────────────┐
                              │                         │
                         Correct                    Incorrect
                      Green + Lock               Red flash, retry
                              │                         │
                              └────────────┬────────────┘
                                           │
                                    All matched?
                                           │
                                           ▼
                                   Success Screen
                              "Back to Topics" button
```

## Requirements

### Triggering Exam Mode
- Appears as "Take Exam" button on the existing completion screen (after 100% mastery)
- Optional — users can skip and go back to topics

### Card Selection
- Randomly select up to 10 flashcards from the topic
- Minimum 2 cards required (if topic has <2 cards, hide exam button)
- Content cards are shuffled randomly on the right side

### Matching Mechanics
- **Left column**: Flashcard titles (fronts) — these are drop targets
- **Right column**: Flashcard content (backs) — these are draggable
- User drags a content card and drops it on the matching title

### Feedback
- **Correct match**: Card locks in place, green highlight on both title and content
- **Incorrect match**: Red flash animation (~300ms), content card stays visually on that title zone (not returned to content column), user can drag it to a different title immediately
- Progress indicator: "3/8 matched"

### Completion
- When all cards matched: Show simple success message
- Single "Back to Topics" button to return to `/study`

### Exit Option
- "Exit Exam" button in header allows returning to completion screen without finishing
- No penalty for exiting early

### Responsive Layout
- **Desktop (md+)**: Side-by-side columns — titles left, content right
- **Mobile**: Stacked — titles on top, content below, vertical scrolling

## Component Architecture

```
TopicStudyClient (existing)
├── Flashcard study mode (existing)
├── Completion screen (existing, modified)
│   └── "Take Exam" button (new)
└── ExamMode (new)
    ├── ExamHeader (progress: "3/8 matched", "Exit Exam" button)
    ├── TitleColumn
    │   └── TitleDropZone[] (drop targets)
    ├── ContentColumn
    │   └── DraggableContent[] (draggables)
    └── ExamSuccess (shown when complete)
```

### New Components

#### `ExamMode`
Main container managing exam state and @dnd-kit context.

Props:
```typescript
interface ExamModeProps {
  cards: FlashcardData[];
  topicName: string;
  onComplete: () => void; // Returns to topic list
  onExit: () => void; // Returns to completion screen
}
```

State:
```typescript
interface ExamState {
  // Selected subset of cards for this exam (max 10, shuffled)
  examCards: FlashcardData[];
  // Shuffled order of content cards (for initial display)
  shuffledContentIds: string[];
  // Which content is placed on which title (contentId or null if empty)
  placements: Record<string, string | null>; // { [titleId]: contentId | null }
  // Which matches are correct (locked in green)
  correctMatches: string[]; // titleIds that are correctly matched
  // Currently showing red flash (for animation, cleared after 300ms)
  incorrectFlash: string | null; // titleId
}
```

**Content visibility logic:**
- Content cards NOT in `Object.values(placements)` appear in the content column
- Content cards that ARE placed appear visually on their title drop zone
- Correctly matched content is locked (green) and not draggable

#### `TitleDropZone`
Individual title card that acts as a drop target.

Props:
```typescript
interface TitleDropZoneProps {
  card: FlashcardData;
  isCorrect: boolean;
  isIncorrectFlash: boolean;
  placedContent: FlashcardData | null;
}
```

Visual states:
- Default: Border with title text
- Drag hover: Highlighted border
- Correct match: Green border/background, shows matched content inline
- Incorrect flash: Red border animation

#### `DraggableContent`
Draggable content card.

Props:
```typescript
interface DraggableContentProps {
  card: FlashcardData;
  isPlaced: boolean; // If placed on a title (even incorrectly)
  isCorrect: boolean; // If correctly matched (locked)
}
```

Visual states:
- Default: Card with full content, draggable
- Dragging: Slight opacity, cursor grab
- Placed incorrectly: Normal appearance, still draggable
- Placed correctly: Green background, not draggable

## Data Flow

1. **Initialization**:
   - Take `cards` prop from parent
   - Randomly select min(cards.length, 10) cards
   - Shuffle content order
   - Initialize empty placements map

2. **On drag end**:
   ```
   if (dropped on valid title zone):
     if (content.id matches title.id):
       Add to correctMatches
       Lock the pair
     else:
       Trigger incorrectFlash animation
       Keep content where it was dropped
   ```

3. **Completion check**:
   - When `correctMatches.size === examCards.length`, show success

## Dependencies

Add to `package.json`:
```json
{
  "@dnd-kit/core": "^6.x"
}
```

@dnd-kit provides:
- `DndContext` — wraps the drag-and-drop area
- `useDraggable` — makes content cards draggable
- `useDroppable` — makes title zones accept drops
- Touch support, accessibility, keyboard navigation built-in

## File Structure

```
components/study/
├── flashcard.tsx (existing)
├── flashcard-controls.tsx (existing)
├── topic-card.tsx (existing)
└── exam/
    ├── exam-mode.tsx
    ├── title-drop-zone.tsx
    ├── draggable-content.tsx
    └── exam-success.tsx
```

## UI Mockup (ASCII)

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Domain Model Exam                           3/8 matched    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │ Entity Types        │    │ Mendix supports four entity │ │
│  │ [drop zone]         │    │ types: Persistable, Non-... │ │
│  │                     │    │ [draggable]                 │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │ Attributes     ✓    │    │ An entity represents a      │ │
│  │ ┌─────────────────┐ │    │ class of real-world...      │ │
│  │ │ Attributes are  │ │    │ [draggable]                 │ │
│  │ │ characteristics │ │    └─────────────────────────────┘ │
│  │ └─────────────────┘ │                                    │
│  └─────────────────────┘    ┌─────────────────────────────┐ │
│                             │ A domain model consists     │ │
│  ┌─────────────────────┐    │ of entities and...          │ │
│  │ Overview            │    │ [draggable]                 │ │
│  │ [drop zone]         │    └─────────────────────────────┘ │
│  └─────────────────────┘                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌─────────────────────────┐
│ Domain Model Exam       │
│ 3/8 matched             │
├─────────────────────────┤
│                         │
│ MATCH TITLES:           │
│ ┌─────────────────────┐ │
│ │ Entity Types        │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Attributes     ✓    │ │
│ └─────────────────────┘ │
│                         │
│ WITH CONTENT:           │
│ ┌─────────────────────┐ │
│ │ Mendix supports...  │ │
│ │ [draggable]         │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ An entity is...     │ │
│ │ [draggable]         │ │
│ └─────────────────────┘ │
│                         │
└─────────────────────────┘
```

## Edge Cases

1. **Topic has <2 flashcards**: Hide "Take Exam" button
2. **Very long content**: Content cards have max-height with scroll, or truncate with expand
3. **Code examples**: Render in monospace, include in content card
4. **Touch devices**: @dnd-kit handles touch natively; long-press to drag

## Accessibility

- Keyboard navigation via @dnd-kit (arrow keys, Enter to pick up/drop)
- ARIA labels: "Drag [content preview] to match with a title"
- Focus indicators on drop zones
- Screen reader announcements for correct/incorrect matches

## Testing Considerations

- Unit test: Card selection and shuffling logic
- Unit test: Match validation (correct vs incorrect)
- Integration test: Full exam flow from completion screen to success
- Visual regression: Responsive layouts at breakpoints
