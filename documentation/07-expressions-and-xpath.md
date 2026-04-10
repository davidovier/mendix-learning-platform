# Expressions and XPath Documentation

## Expressions Overview

Expressions in Mendix modify values using functions or combinations of functions. They enable dynamic calculations and conditional logic throughout your application.

---

## Basic Syntax

### Named Items and Variables

- Objects, lists, and variables: `$customer`
- Attributes and associations: `$customer/Name`
- Nested access: `$customer/CRM.Customer_Order/CRM.Order/Number`

### Example Calculation

```
$CurrentPrice/Price - (($CurrentPrice/Price div 100) * $OrderLine/Discount)
```

---

## System Items

Mendix provides built-in session variables:

| Variable | Description |
|----------|-------------|
| `$currentUser` | System.User object with current user attributes |
| `$currentSession` | System.Session object with session information |

**Note**: Both are cached for performance; refresh from database if values change during sessions.

---

## Expression Categories

### Unary Expressions
- Unary minus (`-`)

### Arithmetic Operators

| Operator | Description |
|----------|-------------|
| `*` | Multiplication |
| `div` or `:` | Division |
| `mod` | Modulo |
| `+` | Addition |
| `-` | Subtraction |

### Relational Operators

| Operator | Description |
|----------|-------------|
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal |
| `>=` | Greater than or equal |
| `=` | Equal |
| `!=` | Not equal |

### Boolean Logic

| Operator | Description |
|----------|-------------|
| `and` | Logical conjunction |
| `or` | Logical disjunction |
| `not` | Logical negation |

### Special Checks

- Empty object detection
- Empty object member checking
- `isNew` - Identifies newly created objects
- `isSynced` - Confirms object synchronization status
- `isSyncing` - Detects active synchronization

### Conditional Execution

**If Expressions**: "Performs a conditional action" enabling branches based on evaluation results.

---

## Mathematical Functions

| Function | Purpose |
|----------|---------|
| `max`, `min` | Extrema from number lists |
| `round` | Floating-point rounding with optional precision |
| `floor`, `ceil` | Directional rounding |
| `random` | Random number generation |
| `pow` | Exponentiation |
| `abs` | Absolute value |
| `sqrt` | Square root |

---

## String Functions

| Function | Purpose |
|----------|---------|
| `toLowerCase`, `toUpperCase` | Case conversion |
| `substring` | Extract string portions |
| `find`, `findLast` | Locate substrings |
| `contains`, `startsWith`, `endsWith` | String matching |
| `trim` | Remove whitespace |
| `replaceAll`, `replaceFirst` | Text substitution |
| `isMatch` | Regular expression matching |
| `urlEncode`, `urlDecode` | URL encoding/decoding |
| `+` | String concatenation |

---

## Date/Time Functions

### Creation
- `dateTime` (server calendar)
- `dateTimeUTC` (UTC calendar)

### Beginning/End Calculations
Functions like `beginOfDay`, `endOfMonth` establish temporal boundaries.

### Interval Calculations
- `daysBetween`
- `hoursBetween`
- `weeksBetween`

### Adjustments
- `addDays`, `addMonths`, `addYears`
- Corresponding `subtract` variants

### Formatting
- `parseDateTime`
- `formatDateTime`
- `formatDate`
- `formatTime`

### Epoch Conversion
- `dateTimeToEpoch`
- `epochToDateTime`

---

## Data Type Functions

| Function | Purpose |
|----------|---------|
| `toString` | Convert values to text |
| `length` | String/list size |
| `parseInteger` | Text to integer conversion |
| `parseDecimal`, `formatDecimal` | Decimal formatting |
| `getCaption`, `getKey` | Enumeration operations |

---

## Error Handling in Expressions

When objects are empty, accessing their attributes creates an exception, returning `false`.

**Problematic**:
```
$emptyObject/attribute != $validObject/attribute or $emptyObject = empty
```
(Second statement never evaluates)

**Better**:
```
$emptyObject = empty or $emptyObject/attribute != $validObject/attribute
```
(Ensures first check occurs)

---

## Common Use Cases

- **Conditional pricing**: "If weight < 1kg then 0.00 else 5.00"
- **Date calculations**: Finding dates between intervals
- **String manipulation**: Extracting, formatting, or validating text
- **Business logic**: Multi-condition branching with boolean operators

---

# XPath

## What is XPath?

Mendix XPath is a query language designed to retrieve data from Mendix objects and their attributes or associations.

**Keyboard Shortcut**: Press **Ctrl + Space** to open XPath autocomplete in Studio Pro.

**Syntax Note**: XPath constraints always start with `[` bracket.

---

## Basic Syntax

XPath queries consist of up to four elements:

1. **Aggregate Function (Optional)**: `avg`, `count`, `max`, `min`, `sum` (Java only)
2. **Entity to Retrieve (Required)**: Starts with `//` followed by module and entity name
3. **Constraint (Optional)**: Restrictions in brackets to filter results
4. **Attribute to Retrieve (Optional)**: Specific attribute from retrieved entities

### Example Structure

```
avg(//Sales.Order[IsPaid = true()]/TotalPrice)
```

---

## Key Differences: Studio Pro vs Java

| Context | Approach |
|---------|----------|
| **Studio Pro** | Write only constraints; entity path determined by context |
| **Java** | Complete queries including `//` and entity names |

### Examples

**Studio Pro**: `[Name='Jansen']`

**Java**: `//Sales.Customer[Name='Jansen']`

---

## Common Examples

| Purpose | XPath |
|---------|-------|
| Retrieve all customers | `//Sales.Customer` |
| Customers named 'Jansen' | `//Sales.Customer[Name='Jansen']` |
| Calculate averages | `avg(//Sales.Order/TotalPrice)` |

---

## XPath Tokens (Exam Critical)

Tokens are system-provided values for use in XPath constraints:

| Token | Returns | Usage |
|-------|---------|-------|
| `[%CurrentUser%]` | Logged-in System.User object | Filter by current user |
| `[%CurrentDateTime%]` | Current date and time | Date comparisons |
| `[%CurrentObject%]` | Context object | Self-reference in constraints |
| `$VariableName` | Variable value | Reference microflow variables |

---

## Common XPath Patterns (Exam Critical)

```xpath
[Attribute = 'value']                    // Equals string
[Attribute != 'value']                   // Not equals
[Attribute = empty]                      // Is null/empty
[Attribute = true()]                     // Boolean true
[Attribute = false()]                    // Boolean false
[Attr1 = 'x' and Attr2 > 100]           // Multiple conditions
[Attr1 = 'x' or Attr2 = 'y']            // Either condition
[not(Association/Entity)]                // No associated object
[Association = '[%CurrentUser%]']        // Current user association
[CreatedDate > '[%CurrentDateTime%]']    // Date comparison
```

---

## XPath Components

### Operators
Logical and comparison operations for building complex queries.

### Functions

| Type | Availability |
|------|--------------|
| Aggregate functions | Java only |
| Constraint functions | Both Java and Studio Pro |

---

## Sources

- [Expressions](https://docs.mendix.com/refguide/expressions/)
- [XPath](https://docs.mendix.com/refguide/xpath/)
