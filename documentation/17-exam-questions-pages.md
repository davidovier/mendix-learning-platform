# Pages & Widgets - Exam Questions & Key Insights

## Critical Exam Patterns Identified

Pages questions focus on: layouts, widgets, data grids, reference selectors, navigation, and page generation.

---

## 1. Page Generation

### Exam Question:
> "What is the fastest way to create overview pages for all entities in your domain model?"

**Answer**: Right-click an Entity and select "Generate overview pages..." for all entities

---

## 2. Layouts & Placeholders

### Exam Question:
> "Which term refers to the empty areas that form the canvas for any pages that make use of the layout?"

**Answer**: Placeholders

### Exam Question:
> "When a layout is based on another layout, what refers to the parent layout?"

**Answer**: Master layout

### Exam Question:
> "How many 'Main' placeholders can be put into a layout?"

**Answer**: 1

### Exam Question:
> "Which option is used for featuring the navigation menu in a sidebar?"

**Answer**: Atlas Sidebar

### Exam Question:
> "If I want to expand the Atlas UI layout to add a navigation element, what should I do?"

**Answer**: Create a new layout and set the Atlas UI layout as the master layout

---

## 3. Snippets

### Exam Question:
> "You want to re-use a header on multiple pages, which option ensures the content automatically changes after you modify it?"

**Answer**: Snippet

### Exam Question:
> "Is it possible to add dynamic data directly to the navigation layout?"

**Answer**: No, only via a snippet it is possible

---

## 4. Data Grids

### Exam Question:
> "How can you show data from multiple entities in the same data grid?"

**Answer**: Add columns which use associations

### Exam Question:
> "From the buttons on a Data Grid that work with single select mode, which ones need to be configured for multi-select mode?"

**Answer**: Edit, Delete

### Exam Question:
> "You want to allow end-users to delete some extracted result. How can you achieve this?"

**Answer**: Create a microflow which will delete selected rows and configure a delete button to call this microflow

---

## 5. Reference Selectors

### Exam Question:
> "Which widget can be used to select associated objects when multiple select is possible?"

**Answer**: Reference set selector

### Exam Question:
> "What two options do you have of showing objects in a reference set selector?"

**Answer**: Select page and Dropdown

### Exam Question:
> "What association do you need between two entities to use the reference set selector?"

**Answer**: Many to many

---

## 6. Images in List Views

### Exam Question:
> "Which widget needs to be used inside of a List View for visualizing a dynamic image?"

**Answer**: Dynamic Image

---

## 7. Popup Windows

### Exam Question:
> "How is the size of popup windows set to fixed?"

**Answer**: By setting the resizable property of the page to No

### Exam Question:
> "What are the default Mendix options for popups?"

**Answer**: Resizable with size determined automatically, with layout grid as the most outer layer of the page

### Exam Question:
> "How can you ensure that buttons in the footer of a scrollable popup are always visible?"

**Answer**: By removing the outer layout grid (or fixing scroll container)

---

## 8. Sorting & Ordering

### Exam Question:
> "What constraint can you use to show the most recently created items at the top?"

**Answer**: createdDate (descending)

---

## 9. Menu Documents

### Exam Question:
> "What can you use whenever you wish to display a navigation menu, but not the main navigation tree?"

**Answer**: Menu

### Exam Question:
> "Where on the page can the Menu document be displayed?"

**Answer**: Anywhere

### Exam Question:
> "Which widget can use menu document?"

**Answer**: Navigation tree (also: Menu bar, Simple menu bar)

---

## 10. Layout Grid

### Exam Question:
> "What CSS technology is a layout grid based on?"

**Answer**: Bootstrap Framework

---

## 11. Page Naming Convention

### Exam Question:
> "What is the correct naming convention for pages?"

**Answer**: Entity_PageType_User-Role (e.g., Order_Overview_Admin)

---

## 12. Wizard Pages

### Exam Question:
> "Which option indicates a default configuration of a page created using Wizard Progress page template with 4 steps?"

**Answer**: Step 2 is active, Step 1 is visited

---

## 13. Validation in Pages

### Exam Question:
> "Can you add a validation rule in a page?"

**Answer**: Yes, to input widgets

### Exam Question:
> "Validation types available in input widgets"

**Answer**: Required, Custom

(Compare to domain model: Maximum length, Unique, Required, Range, Equals, RegEx)

---

## 14. Page Performance

### Exam Question:
> "A page is taking forever to load. Whose responsibility is it to solve this?"

**Answer**: The Frontend developer

---

## 15. Feedback Widget

### Exam Question:
> "What is the easiest way to collect feedback from users from within your app?"

**Answer**: Use the Feedback widget

---

## Quick Reference: Widgets & Their Uses

| Widget | Use Case |
|--------|----------|
| Data Grid | Tabular data display |
| List View | Custom repeated layouts |
| Template Grid | Grid of repeated templates |
| Data View | Single object detail |
| Reference Selector | Select one associated object |
| Reference Set Selector | Select multiple associated objects (many-to-many) |
| Dynamic Image | Display images from entities |
| Navigation Tree | Show menu structure |
| Snippet | Reusable page part |

---

## Layout Hierarchy

```
Master Layout (Atlas_Default)
    └── Custom Layout (based on Master)
        └── Page (uses Custom Layout)
```

---

## Practice Questions

1. You need a dropdown to select ONE Category for a Product. Which widget?
   **Answer: Reference Selector**

2. Users should select multiple Tags for a Post (many-to-many). Which widget?
   **Answer: Reference Set Selector**

3. You want the company logo on all pages. Where to put it?
   **Answer: In the layout (or snippet in the layout)**

4. Grid shows old orders first. How to show newest first?
   **Answer: Sort by createdDate descending**

5. How to add a navigation sidebar?
   **Answer: Use Atlas Sidebar layout (or create layout with Atlas Sidebar as master)**
