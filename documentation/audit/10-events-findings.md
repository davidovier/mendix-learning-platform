# Events & Validation - Audit Findings

## Assessment: Adequate

The existing content (3103 bytes, 102 lines) covers event handlers and validation rules accurately. Could benefit from more exam-focused details and examples.

## Accuracy Issues

| Current Content | Correct Information | Source |
|-----------------|---------------------|--------|
| None found | Content is accurate | docs.mendix.com/refguide/event-handlers/ |

## Missing Concepts

| Concept | Priority | Official Source |
|---------|----------|-----------------|
| **Before handlers return Boolean** - Must return true/false | Critical | Already mentioned but needs emphasis |
| **After Commit is best for post-processing** | Important | Exam questions |
| **Event handler naming prefixes** - BCO_, ACO_, BCR_, ACR_, BDE_, ADE_ | Important | Best practices |
| **Event handlers with security context** | Nice-to-have | /refguide/event-handlers/ |

## Recommended Changes

1. **Add Event Handler Prefixes section**:
   ```
   | Prefix | Event |
   |--------|-------|
   | BCO_ | Before Commit |
   | ACO_ | After Commit |
   | BCR_ | Before Create |
   | ACR_ | After Create |
   | BDE_ | Before Delete |
   | ADE_ | After Delete |
   ```

2. **Emphasize Before handler Boolean return** - Add a callout/note that all "Before" event handlers MUST return a Boolean value (true to continue, false to cancel).

3. **Add exam tip** - "After Commit" is the best choice when you need to process something immediately after an object is committed.

4. **Add practical examples** - Show when to use each event type:
   - Before Commit: Validation, auto-fill fields
   - After Commit: Send notifications, log changes
   - Before Delete: Check dependencies
   - After Delete: Cleanup related data

## Content Comparison Summary

### Currently Covered (Correctly)
- Event handlers definition
- All event types (Create, Commit, Delete, Rollback)
- Before/After timing
- Boolean return requirement for Before handlers
- Parameter passing rules
- Error handling in Before handlers
- Usage recommendations (use moderately)
- Validation rules overview
- Creating validation rules
- All rule types (Required, Unique, Equals, Range, RegEx, Max Length)
- NPE validation limitation
- Uniqueness with generalizations constraint
- Rule execution order

### Not Covered (Gaps)
- Event handler naming prefixes
- "After Commit is best for post-processing" exam tip
- Practical examples for each event type
- Security context mention

## Rewrite Needed: No

**Justification**: Content is accurate and covers both event handlers and validation rules well. Needs additions for naming prefixes and exam tips.
