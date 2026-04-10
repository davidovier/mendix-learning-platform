# Security - Exam Questions & Key Insights

## Critical Exam Patterns Identified

Security questions focus on: user roles, module roles, page access, entity access, and anonymous users.

---

## 1. User Roles vs Module Roles

### Exam Question:
> "Where do you connect User roles to Module roles?"

**Answer**: App security

### Exam Question:
> "How many user roles can a user have in a Mendix application?"

**Answer**: Unlimited

### Exam Question:
> "Module Roles can be used to grant access on:"

**Answer**: Pages, Microflows, Entities defined in the module

### Key Concept:
- **User roles** = App-level (assigned to users)
- **Module roles** = Module-level (define permissions within a module)
- One user role can include multiple module roles

---

## 2. Page Access Configuration

### Exam Question:
> "Where in Studio Pro can you assign access to pages?"

**Answer**: Module security

### Exam Question:
> "Where can you configure page access?"

**Answer**: In page properties AND module security

### Exam Question:
> "How are unused pages displayed in the page access tab?"

**Answer**: They are displayed only if they are set to be visible for some role (otherwise not shown).

### Exam Question:
> "How are unused microflows displayed in the microflow access tab?"

**Answer**: Orange, but only if they are set to be visible for some role.

---

## 3. Anonymous Users

### Exam Question:
> "How can you allow users to access parts of an app without needing to log in?"

**Answer**: Set up anonymous users

### Exam Question:
> "After selecting 'allow anonymous user', do we require to set username and password?"

**Answer**: No

### Exam Question:
> "Do you need to configure entity access rules for anonymous users?"

**Answer**: Yes

### Exam Question:
> "How many user roles can anonymous user have?"

**Answer**: One

### Exam Question:
> "What pages need to be changed after allowing anonymous users?"

**Answer**: None (they work with the anonymous user role you configure)

---

## 4. Role-Based Home Pages

### Exam Question:
> "How can you configure different home pages for different users?"

**Answer**: You can configure Role-based home pages

### Exam Question:
> "The default home page does not need to have a module role set. True or false?"

**Answer**: True

---

## 5. Conditional Visibility by Role

### Exam Question:
> "Where should you configure that only selected roles are allowed to see a container on a page?"

**Answer**: In the Conditional visibility property of the container

### Exam Question:
> "Which option provides an easy way to limit access rights for a given role to a specific functionality within an app?"

**Answer**: By adding a separate module

---

## 6. Security Levels

### Exam Question:
> "Is it possible to run a Mendix app locally when App security level is NOT set to production?"

**Answer**: Yes

### Key Security Levels:
- **Off**: No security (local testing only)
- **Prototype/Demo**: Basic security, users can access all data
- **Production**: Full security required

---

## 7. Entity Access & Creating Objects

### Exam Question:
> "What may cause the error 'Creating Object of type MyModule.Entity failed for Security Reasons'?"

**Answer**: Access rules for Entity not configured properly

### Exam Question:
> "What is best practice for securely creating a user account?"

**Answer**: Keep the option 'Default rights for new members' set to 'None'

---

## 8. Single User Role Enforcement

### Exam Question:
> "As Users by default can have multiple UserRoles, which option ensures a user gets restricted to only one user role?"

**Answer**: Adding microflow logic (validation)

### Exam Question:
> "When one user role is allowed, what is best practice when creating a new team member?"

**Answer**: A before commit event handler to check whether one user role is selected. If not, it stops the commit and gives validation feedback message.

---

## 9. Microflow/Page Access Rules

### Exam Question:
> "Which statements are true?
> A. To open a page with microflow, user has to be given access to this page in security tab
> B. To open sub-microflow within a microflow, user has to be given access to that sub-microflow"

**Answer**: None of them

**Key Insight**:
- Pages opened by microflows don't require separate page access (the microflow access is sufficient)
- Sub-microflows inherit the calling microflow's security context

---

## 10. Module Separation for Security

### Exam Question:
> "To make entire notifications functionality unavailable to a user role, what is best practice?"

**Answer**: Build it in a separate module

---

## Quick Reference: Security Configuration Locations

| What to Configure | Where |
|-------------------|-------|
| User roles | App Security > User roles |
| Connect user roles to module roles | App Security > User roles |
| Module roles | Module Security |
| Page access | Module Security > Page access |
| Microflow access | Module Security > Microflow access |
| Entity access | Module Security > Entity access |
| Anonymous users | App Security > Anonymous users |
| Role-based home pages | App Security > Navigation |
| Conditional visibility | Page widget properties |

---

## 11. XPath Constraints in Access Rules (CRITICAL)

### Exam Question:
> "Do XPath constraints in access rules apply to CREATE operations?"

**Answer**: No. XPath constraints only apply to Read, Write, and Delete operations.

### Exam Question:
> "Which operations do XPath access rule constraints apply to?"

**Answer**: Read, Write, Delete (NOT Create)

---

## Common Security Mistakes (Exam Traps)

1. **Assuming sub-microflow needs separate access** - It doesn't
2. **Forgetting entity access for anonymous users** - Required!
3. **Setting default rights to something other than None** - Security risk
4. **Thinking pages opened by microflow need page access** - They don't
5. **Allowing multiple user roles for anonymous** - Only one allowed
6. **Expecting XPath constraints to work on CREATE** - They only apply to Read/Write/Delete

---

## Practice Questions

1. User can see a page but gets security error when loading data. What's missing? **Answer: Entity access rules**

2. You want Admin and User roles to see different home pages. Where configure? **Answer: App Security > Navigation (role-based home pages)**

3. Anonymous user needs to see products. What do you configure?
   - **Answer: Anonymous user role + entity access for Product**

4. Orange microflow in access tab means? **Answer: Unused but visible for some role**

5. User calls microflow that calls sub-microflow. Access needed for sub-microflow? **Answer: No**
