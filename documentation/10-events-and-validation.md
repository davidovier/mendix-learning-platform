# Event Handlers and Validation Rules

## Event Handlers Overview

Event handlers define microflows that automatically execute in response to specific entity-related events.

"Event handlers define microflows that handle certain events related to the entity."

---

## Event Types

| Event | Description |
|-------|-------------|
| **Create** | Microflow executes when object is created |
| **Commit** | Microflow executes when object is committed |
| **Delete** | Microflow executes when object is deleted |
| **Rollback** | Microflow executes when object is rolled back |

---

## Timing: Before and After

| Timing | Description |
|--------|-------------|
| **Before** | Executes prior to event; must return Boolean to permit (true) or prevent (false) |
| **After** | Executes following event; cannot prevent action |

---

## Key Configuration Details

### Parameter Passing
- Before Create handlers cannot receive the object as parameter
- All other event handlers can receive the object

### Return Values
"Microflows that are executed _before_ the event should return a Boolean value that specifies whether the event should continue (true) or be cancelled (false)."

### Error Handling
Before event handlers can raise errors when returning false, allowing validation-like behavior.

---

## Event Handler Naming Conventions (Exam Critical)

Mendix recommends standardized prefixes for event handler microflows:

| Prefix | Event Type | Example |
|--------|------------|---------|
| **BCR_** | Before Create | BCR_Order |
| **ACR_** | After Create | ACR_Order |
| **BCO_** | Before Commit | BCO_Order |
| **ACO_** | After Commit | ACO_Order |
| **BDE_** | Before Delete | BDE_Order |
| **ADE_** | After Delete | ADE_Order |
| **BRO_** | Before Rollback | BRO_Order |
| **ARO_** | After Rollback | ARO_Order |

**Exam Tip**: Know which prefix corresponds to which event timing!

---

## Usage Recommendations

"Event handlers should be used moderately, as they will be triggered every time the corresponding event occurs, so they must be for things you want always to happen."

---

# Validation Rules

## Overview

Validation rules enforce data integrity by defining conditions that objects must satisfy before being committed to the database.

When violated, they generate error messages for end-users or exceptions in microflows.

---

## Creating Validation Rules

Define validation rules through the entity dialog box in the domain model editor.

Each rule includes:
- **Attribute**: The field to validate
- **Error Message**: User-facing text when validation fails
- **Rule Type**: The condition to enforce

---

## Rule Types

| Rule Type | Description |
|-----------|-------------|
| **Required** (default) | Attribute needs a value; cannot be empty |
| **Unique** | Attribute values must differ across all objects |
| **Equals** | Compares to fixed value or another attribute |
| **Range** | Values must fall within specified bounds |
| **Regular Expression** | Matches against stored regex pattern |
| **Maximum Length** | Restricts character count |

---

## Important Constraints

### Non-Persistable Entities
Validation rules are disabled for non-persistable entities since they're designed for database integrity.

### Uniqueness with Generalizations
You cannot define unique validation rules on inherited attributes in specialized entities.

### Rule Ordering
Rules execute in defined order, with all violations recorded and displayed together. Uniqueness constraints execute separately after other validations pass.

---

## Sources

- [Event Handlers](https://docs.mendix.com/refguide/event-handlers/)
- [Validation Rules](https://docs.mendix.com/refguide/validation-rules/)
