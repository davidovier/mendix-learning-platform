# Scheduled Events - Audit Findings

## Assessment: Strong

The existing content (2607 bytes, 89 lines) covers scheduled events comprehensively including timing, overlap handling, and operational limits.

## Accuracy Issues

| Current Content | Correct Information | Source |
|-----------------|---------------------|--------|
| None found | Content is accurate | docs.mendix.com/refguide/scheduled-events/ |

## Missing Concepts

| Concept | Priority | Official Source |
|---------|----------|-----------------|
| **Free App limitation** | Critical | Already mentioned - good |
| **Microflow runs with all rights** | Important | Already mentioned - good |
| **No parameters allowed** | Important | Already mentioned - good |
| **UTC time for Mendix Cloud** | Important | Already mentioned - good |

## Recommended Changes

1. **Add Exam Tips callout**:
   ```
   Key Exam Points:
   - Scheduled events run microflows automatically
   - Microflow must have NO parameters
   - Microflow runs with ALL rights (no user context)
   - Free Apps do NOT run scheduled events
   - Mendix Cloud servers use UTC time
   ```

2. **Minor: Add creation path** - Currently says "right-clicking your module" but could be more explicit: **Module** > **Add other** > **Scheduled Event**

## Content Comparison Summary

### Currently Covered (Correctly)
- Overview and purpose
- Free App limitation
- Creation method
- All core properties (Name, Documentation, Microflow, Enabled)
- Note about no parameters and all rights
- All six interval types (Yearly, Monthly, Weekly, Daily, Hourly, Minutes)
- UTC/server time zone options
- Overlap strategies (Skip next, Delay next)
- Concurrent execution limit (10 per node)
- Integer divisor requirements
- Mendix Cloud UTC operation
- ProcessedQueueTask table management
- Cleanup recommendation
- Best practices

### Not Covered (Gaps)
- None significant - very complete coverage

## Rewrite Needed: No

**Justification**: Excellent comprehensive coverage. Only minor enhancement needed for exam tips callout. This is one of the most complete topic files.
