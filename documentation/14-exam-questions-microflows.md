# Microflows - Exam Questions & Key Insights

## Critical Exam Patterns Identified

Microflows have the **highest number of exam questions**. Focus on: prefixes, list operations, expressions, and sub-microflows.

---

## 1. Naming Conventions & Prefixes (HEAVILY TESTED)

### Exam Questions on Prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| **DS_** | Data source microflow | DS_GetActiveOrders |
| **ACT_** | Page-based action | ACT_SubmitOrder |
| **SUB_** | Sub-microflow | SUB_CalculateTotal |
| **VAL_** | Validation microflow | VAL_CheckEmail |
| **BCO_/ACO_** | Before/After Commit | BCO_Order, ACO_Order |
| **BCR_/ACR_** | Before/After Create | BCR_Customer |
| **BDE_/ADE_** | Before/After Delete | BDE_Order |
| **BRO_/ARO_** | Before/After Rollback | BRO_Transaction |
| **CAL_** | Calculated attribute | CAL_FullName |
| **OEN_** | On Enter event | OEN_ValidateField |
| **OCH_** | On Change event | OCH_UpdateTotal |
| **OLE_** | On Leave event | OLE_SaveDraft |

### Exam Question:
> "What is the prefix for datasource Microflows?"

**Answer**: DS_

### Exam Question:
> "What are the 2 prefixes for microflows called within a microflow?"

**Answer**: SUB and VAL

### General Naming Convention:
> "What is the general naming convention for Microflows?"

**Answer**: `{PREFIX}_{Entity}_{Operation}`

---

## 2. Variables & Tokens

### Exam Question:
> "With what sign is a variable indicated in a microflow?"

**Answer**: Dollar sign ($)

### Exam Question:
> "In a microflow, what would be an example of a variable?"

**Answer**: $Customer

### Exam Question:
> "In a microflow, what is a token?"

**Answer**: A system-generated value (like [%CurrentDateTime%], [%CurrentUser%])

### Exam Question:
> "Which of these system variables does NOT exist?"

**Answer**: [%currentPage%] (does not exist)

**Valid tokens**: [%CurrentUser%], [%CurrentObject%], [%CurrentDateTime%]

---

## 3. List Operations (HEAVILY TESTED)

### Exam Question:
> "Name 3 list operations"

**Answer**: Equals, Sort, Filter

### Exam Question:
> "Which operations can be performed on a list?"

**Answer**: Union, Intersect, Subtract

### Complete List Operations Reference:

| Operation | What it does | Returns |
|-----------|--------------|---------|
| **Head** | First object of list | Object |
| **Tail** | All elements except first one | List |
| **Find** | First object with given value | Object |
| **Filter** | All objects matching criteria | List |
| **Sort** | Orders list by attribute | List |
| **Union** | Combines lists, removes duplicates | List |
| **Intersect** | Elements in BOTH lists | List |
| **Subtract** | First list minus elements in second | List |
| **Contains** | Checks if list contains element/list | Boolean |
| **Equals** | Compares two lists | Boolean |

### Key Exam Questions:

> "What will return head list operation?"

**Answer**: First object of a list

> "What will return tail list operation?"

**Answer**: Returns list containing all elements except first one

> "How does list intersection work?"

**Answer**: Returns list containing elements that appear in both parameters

> "How does list subtract work?"

**Answer**: Returns first parameter list without elements of second parameter list

> "What does find list operation return?"

**Answer**: First object that has given value

> "Is there any difference between return values of find and filter?"

**Answer**: Find returns object, filter returns list

> "What does equals list operation return?"

**Answer**: Boolean

> "Can you use associations of objects to sort list?"

**Answer**: No

---

## 4. Sub-Microflows

### Exam Question:
> "What is a limitation of a sub-microflow compared to a regular microflow?"

**Answer**: None. Sub-microflows are equally capable.

### Exam Question:
> "What main benefit do sub-microflows offer?"

**Answer**: Better maintainability (also: readability and reusability)

### Exam Question:
> "What are 3 advantages of sub-microflows?"

**Answer**: Improves readability, maintainability, and reusability

### Exam Question:
> "Max how many levels should you go with sub-microflows?"

**Answer**: 2 to 3 levels max is best practice

### Exam Question:
> "Which 3 items can't you select when extracting a Sub Microflow?"

**Answer**: Start event, end event, parameter

### Exam Question:
> "It is not possible to change primitive input parameters (Boolean, Integer, DateTime) in a sub-microflow. True or False?"

**Answer**: True

---

## 5. Rules

### Exam Question:
> "What is a limitation of a rule compared to a microflow?"

**Answer**: A rule may only return a Boolean (or enumeration).

### Exam Question:
> "What is the outcome of a Rule?"

**Answer**: Boolean or enumeration

---

## 6. Loops

### Exam Question:
> "What is the list object in a loop called?"

**Answer**: An iterator

### Exam Question:
> "What can you use to exit a loop early?"

**Answer**: A break event

### Exam Question:
> "When do you use Loop activity in your microflow?"

**Answer**: When we want to allow certain activities to be executed repeatedly

### Exam Question:
> "Which all three elements can be used inside a loop?"

**Answer**: Retrieve object, list operation, change variable

**Cannot be inside a loop**: Start event, end event

---

## 7. Aggregate Functions

### Exam Question:
> "You want to find the total number of objects in a list. What can you use?"

**Answer**: Use an aggregate list function

### Exam Question:
> "According to best practices, what will be executed as optimized retrieve?"

**Answer**: Retrieve by association, then count list operation

---

## 8. Expressions & Functions

### Exam Question:
> "In a microflow expression, 'toUpperCase' is an example of what?"

**Answer**: A function

### Exam Question:
> "Which function can you use to display DateTime 05/05/2025 as 'Mon, 5 May of 2025'?"

**Answer**: formatDateTime

### Exam Question:
> "Which function can you use to parse String 05.05.2025 to DateTime?"

**Answer**: parseDateTime

### Exam Question:
> "Which function can you use to parse integer into string?"

**Answer**: toString()

### Exam Question:
> "Which function can you use to get first letter of a String?"

**Answer**: (Trick question - there's no direct function. Use substring.)

---

## 9. Annotations

### Exam Question:
> "If you want to leave notes for future developers in a microflow, what can you use?"

**Answer**: Annotations

### Exam Question:
> "Can you connect annotation to element in microflow?"

**Answer**: Yes, to multiple ones

---

## 10. Debugging

### Exam Question:
> "You need to debug a microflow in production but don't want to impact users. How can you trigger debugging only when you personally run it?"

**Answer**: Set a breakpoint condition (e.g., $currentUser/name = 'YourUserName')

---

## 11. Batches

### Exam Question:
> "What are batches used for?"

**Answer**: Processing large amounts of data

---

## 12. Nanoflow Limitations

### Exam Question:
> "In an ACT nanoflow that sorts a list, can I add a rollback activity?"

**Answer**: False (Rollback not available in nanoflows as it's a server action)

---

## Quick Reference: Expression Cheat Sheet

| Task | Function |
|------|----------|
| Format date for display | formatDateTime($date, 'pattern') |
| Parse string to date | parseDateTime($string, 'pattern') |
| Number to string | toString($number) |
| String to integer | parseInteger($string) |
| Uppercase | toUpperCase($string) |
| Lowercase | toLowerCase($string) |
| Get length | length($string) |
| Substring | substring($string, start, length) |

---

## Practice Questions

1. You need a microflow that validates email format before saving. What prefix? **Answer: VAL_**

2. You want all Orders except those in a specific list. Which list operation? **Answer: Subtract**

3. What does $OrderList return in a loop? **Answer: Error - use $IteratorObject or $currentIndex**

4. Can a rule return an Order object? **Answer: No, only Boolean or enumeration**

5. Token for current logged-in user? **Answer: [%CurrentUser%]**
