# Pages & Widgets - Audit Findings

## Assessment: Strong

The existing content (5989 bytes, 176 lines) covers pages, widgets, data views, data grids, and snippets comprehensively. Well-organized with good tables and code examples.

## Accuracy Issues

| Current Content | Correct Information | Source |
|-----------------|---------------------|--------|
| None found | Content is accurate | docs.mendix.com/refguide/pages/ |

## Missing Concepts

| Concept | Priority | Official Source |
|---------|----------|-----------------|
| **Reference Selector widget** - For selecting associated objects | Critical | Exam questions - heavily tested |
| **Reference Set Selector widget** - For many-to-many associations | Critical | Exam questions - heavily tested |
| **Layout placeholders** - Main placeholder, other placeholders | Important | /refguide/layout/ |
| **One Main placeholder per layout** rule | Important | Exam questions |
| **List View widget** - Alternative to data grid for mobile | Important | /refguide/list-view/ |
| **Template Grid widget** - Grid with custom templates | Nice-to-have | /refguide/template-grid/ |

## Recommended Changes

1. **Add Reference Selector section** - Explain this widget is used for many-to-one associations (selecting one associated object). Heavily tested on exam.

2. **Add Reference Set Selector section** - Explain this widget is for many-to-many associations (selecting multiple associated objects). Key exam topic.

3. **Add Widgets for Associations summary table**:
   ```
   | Relationship | Widget |
   |--------------|--------|
   | Many-to-One (select one) | Reference Selector |
   | Many-to-Many (select multiple) | Reference Set Selector |
   ```

4. **Add Layout Placeholders section** - Explain that layouts have ONE main placeholder and can have additional optional placeholders. Pages fill these placeholders with content.

5. **Add List View section** - Brief coverage of List View as mobile-friendly alternative to Data Grid.

## Content Comparison Summary

### Currently Covered (Correctly)
- Page definition and SPA nature
- Page structure (layout + template)
- All page resources (layout, template, snippet, building block, menu, image collection)
- Widget categories (all 9 categories)
- Data View with all data sources
- Data View properties (editability, orientation, footer)
- Data Grid components and data sources
- Data Grid properties (paging, selection modes, refresh)
- Snippets creation and parameters
- Navigation between pages

### Not Covered (Gaps)
- Reference Selector widget (exam critical)
- Reference Set Selector widget (exam critical)
- Layout placeholders (main/other)
- List View widget
- Template Grid widget

## Rewrite Needed: No

**Justification**: Content is accurate and well-structured. Just needs additions for Reference Selector/Reference Set Selector widgets and layout placeholders - all frequently tested on the exam.
