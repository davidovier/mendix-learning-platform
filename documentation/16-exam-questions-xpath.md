# XPath - Exam Questions & Key Insights

## Critical Exam Patterns Identified

XPath questions focus on: syntax, operators, usage locations, and constraint writing.

---

## 1. XPath Basics

### Exam Question:
> "How do you begin typing an XPath?"

**Answer**: `[` (opening square bracket)

### Exam Question:
> "If you want to open the XPath auto-complete menu, you need to press:"

**Answer**: Ctrl + Space

### Exam Question:
> "What is this called: [year-from-dateTime(StartDate)=2020]?"

**Answer**: An XPath constraint

### Exam Question:
> "This is a written syntax that specifies relationships between data properties"

**Answer**: XPath

---

## 2. Where to Use XPath

### Exam Question:
> "Where in Mendix Studio Pro can you configure XPaths?"

**Answer**: List Views (also: Data Grids, Retrieve actions, Access rules)

### Exam Question:
> "Which Widget feature utilizes XPaths?"

**Answer**: Selectable data constraints on Reference Selectors

### Exam Question:
> "Where can you utilize XPaths in microflows?"

**Answer**: In the 'Retrieve' action

### Exam Question:
> "Can you use XPath in Access rules?"

**Answer**: Yes, but it won't apply to create action

---

## 3. XPath Operators

### Exam Question:
> "What is an XPath operator?"

**Answer**: `<, >, =, !=, and, or`

---

## 4. XPath Query Examples

### Exam Question:
> "If you write [Status = 'Cancelled'], what will be returned?"

**Answer**: A list of all requests with the status set to 'Cancelled'

### Exam Question:
> "If you write [VacationRequest.VacationRequest_Submitter='[%CurrentUser%]'], what will be returned?"

**Answer**: A list of all vacation requests submitted by the current user

### Exam Question:
> "What XPath constraint should be used to allow users to only see their own notifications?"

**Answer**: `[Notifications.Notification_Account='[%CurrentUser%]']`

### Exam Question:
> "Which XPath is correct?"

**Answer**: `[Event_Customer/Customer[Name = "James"][Name="Thomas"]]`

NOT: `[Event_Customer/Customer[if name="James" or name="Thomas" then true else false]]`

### Exam Question:
> "If you write [StartDate = empty], what will happen?"

**Answer**: The grid will show all VacationRequests where the StartDate is not populated

---

## 5. Complex XPath with Associations and Conditions

### Exam Question:
> "What will this return: [DaysUsed < 4.5 and not(VacationManagement.VacationRequest_Submitter/Administration.Account)]"

**Answer**: A list of all VacationRequests that are shorter than 4.5 days and do not have a Submitter assigned

---

## XPath Syntax Cheat Sheet

### Basic Structure
```
[attribute = 'value']
[Association/Entity/Attribute = 'value']
[attribute = '[%Token%]']
```

### Common Patterns

| Pattern | Example |
|---------|---------|
| Equals | `[Status = 'Active']` |
| Not equals | `[Status != 'Cancelled']` |
| Greater than | `[Amount > 100]` |
| Less than | `[Amount < 50]` |
| Empty check | `[Name = empty]` |
| Not empty | `[Name != empty]` |
| Current user | `[Entity_User = '[%CurrentUser%]']` |
| Boolean true | `[IsActive = true()]` |
| Boolean false | `[IsActive = false()]` |
| And | `[Status = 'Active' and Amount > 100]` |
| Or | `[Status = 'Active' or Status = 'Pending']` |
| Not | `[not(Association/Entity)]` |

### Association Traversal
```
[Module.Entity_OtherEntity/Module.OtherEntity/Attribute = 'value']
```

### Date Functions
```
[year-from-dateTime(CreatedDate) = 2025]
[month-from-dateTime(CreatedDate) = 3]
[day-from-dateTime(CreatedDate) = 25]
```

---

## Common XPath Mistakes (Exam Traps)

1. **Using `if-then-else` in XPath** - XPath doesn't support this! Use `and`/`or` instead

2. **Forgetting module name in association path** - Must include: `Module.Entity_OtherEntity`

3. **Using single quotes inconsistently** - String values need quotes: `'Active'`

4. **Boolean values** - Use `true()` and `false()` with parentheses

5. **Empty check** - Use `= empty` not `= ''` or `= null`

---

## Practice Questions

1. Show only Orders where TotalAmount > 500 and Status is 'Pending':
   **Answer**: `[TotalAmount > 500 and Status = 'Pending']`

2. Show Products that have no Category assigned:
   **Answer**: `[not(Product_Category/Category)]` or check empty association

3. Show Tasks assigned to current user:
   **Answer**: `[Task_User = '[%CurrentUser%]']`

4. Show Records created in 2025:
   **Answer**: `[year-from-dateTime(createdDate) = 2025]`

5. Can XPath prevent object creation?
   **Answer**: No, XPath in access rules doesn't apply to create action
