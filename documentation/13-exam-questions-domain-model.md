# Domain Model - Exam Questions & Key Insights

## Critical Exam Patterns Identified

Based on actual exam questions, these are the **most tested concepts**:

---

## 1. Persistable vs Non-Persistable Entities

### Exam Question Pattern:
> "What happens on commit of a non-persistable entity?"

**Answer**: Current attribute values and association values are stored in memory (NOT database).

### Key Facts to Memorize:

| Aspect | Persistable | Non-Persistable |
|--------|-------------|-----------------|
| Storage | Database table | Runtime memory only |
| Color | Blue | Orange |
| Mendix creates DB table? | Yes | No |
| Indexes possible? | Yes | **No** |
| Validation in domain model? | Yes | **No** |
| Survives restart? | Yes | No |

### Exam Question:
> "For which entity type does Mendix create a database table?"

**Answer**: For persistable entities only.

### Exam Question:
> "Name 2 limitations of non-persistable entities"

**Answer**: No indexes and not possible to use validation in the domain model.

---

## 2. Associations & Ownership

### Exam Question Pattern:
> "Who is the owner of an association between non-persistable entity and persistable entity?"

**Answer**: Non-persistable entity (NPE must always be the owner).

### Exam Question:
> "What is another way of calling an association?"

**Answer**: Reference

### Exam Question:
> "How many associations can you add between two entities?"

**Answer**: Many associations of various multiplicity.

### Exam Question:
> "When should you use multiple associations between 2 entities?"

**Answer**: When there are different relationships between two entities.

### Naming Convention (Exam Question):
> "What is the default naming convention for Associations?"

**Answer**: Automatic `{entity1}_{entity2}`

> "When there are multiple associations between the same two entities?"

**Answer**: `{entity1}_{entity2}_{recognizable purpose}`

---

## 3. Delete Behavior Visual Indicators

### Exam Question:
> "How will the association appearance change after you configure cascade delete?"

**Answer**: The border around the association name will become **RED**.

### Exam Question:
> "How will the association appearance change after you configure conditional delete?"

**Answer**: The border around the association name will become **BLUE**.

### Exam Question:
> "For which delete operation can you set error message for user?"

**Answer**: Conditional delete (not cascade).

---

## 4. Calculated vs Stored Attributes

### Exam Question:
> "What would be a good situation to use a calculated attribute?"

**Answer**: When a value is **viewed more often than it changes**.

### Exam Question:
> "If you were building an app with stock prices, would you make the stock value a calculated or stored attribute?"

**Answer**: Calculated attribute (changes frequently, viewed less often than it changes).

### Remember:
- Calculated = computed on-the-fly via microflow
- Cannot sort or filter by calculated attributes
- Use when: viewed > changed
- Avoid when: changed > viewed

---

## 5. Enumerations

### Exam Question:
> "Can we use space in enum name?"

**Answer**: No.

### Exam Question:
> "Can you change name or caption of enum value after creation?"

**Answer**: Caption can be modified, name **cannot** be modified.

### Why Name Cannot Change:
Changing the name would invalidate existing data in the database.

---

## 6. Event Handlers

### Exam Question:
> "Which event handler always needs to return a boolean return value?"

**Answer**: The **before commit** (and all "before" handlers).

### Exam Question:
> "What is the best alternative to process something immediately after an object is committed?"

**Answer**: Event Handler (specifically, After Commit).

### Exam Question:
> "What would you do if you want to call a microflow on completion of commit operation of an entity?"

**Answer**: Use Event Handlers.

---

## 7. System Members

### Exam Question:
> "Which options list system members that can be stored as indicated in entity properties?"

**Answer**: Created Date, Changed Date, Owner, ChangedBy

### Exam Question:
> "Which term indicates a user that created the object?"

**Answer**: Owner

---

## 8. Generalization/Specialization

### Exam Question:
> "Name a reason why you would use a generalization of the Account entity instead of using the Account entity itself (in System module)"

**Answer**: Because you cannot change access rights in the System module.

### Exam Question:
> "How can you connect a profile picture to the account of a team member?"

**Answer**: Create a ProfilePicture entity and configure Image entity in the System module as its generalization.

---

## 9. Entity Limits & Validation

### Exam Question:
> "Is it possible to limit an entity to only one object?"

**Answer**: Yes, through a Microflow.

### Exam Question:
> "Can you add an error message in the domain model?"

**Answer**: Yes (for validation rules).

### Exam Question:
> "Validation types available in domain model"

**Answer**: Maximum length, Unique, Required, Range, Equals, RegEx

---

## 10. Cross-Module Associations

### Exam Question:
> "When connecting 2 entities of 2 different modules, what do we call that association?"

**Answer**: Cross-module association.

### Exam Question:
> "How do you navigate to the associated entity in another module?"

**Answer**: Right-click the association and select "Go to the other side".

### Exam Question:
> "What alternative to drawing an association can you use to connect two entities in separate domain models?"

**Answer**: Right-click in an entity and select Add > Association.

---

## 11. Information Entities

### Exam Question:
> "What is a good reason to use an Information Entity instead of multiple associations?"

**Answer**: You want to display additional information about an association.

---

## 12. Domain Model - Annotations

### Exam Question:
> "Can you connect annotation to entity in domain model?"

**Answer**: No (unlike microflows where you can).

---

## Quick Reference: Visual Indicators

| Visual | Meaning |
|--------|---------|
| Blue entity | Persistable |
| Orange entity | Non-Persistable |
| Purple entity | External |
| Green entity | View Entity |
| Red border on association | Cascade delete |
| Blue border on association | Conditional delete |
| Arrow direction | Points from owner to non-owner |

---

## Practice Questions

1. You have a Shopping Cart (temporary) linked to Product (permanent). Which entity must own the association? **Answer: Shopping Cart (NPE)**

2. An Order Status changes rarely but is displayed on every order view. Calculated or stored? **Answer: Stored**

3. You want to prevent deleting a Customer who has Orders. Which delete behavior? **Answer: Conditional delete (blue border)**

4. You need to track who created each record. Which system member? **Answer: Owner**

5. Can you sort a data grid by a calculated attribute? **Answer: No**
