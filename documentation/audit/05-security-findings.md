# Security - Audit Findings

## Assessment: Strong

The existing content (6498 bytes, 203 lines) is comprehensive and well-organized. It covers all major security concepts including security levels, user/module roles, access rules, XPath constraints, and best practices. Minor additions only needed.

## Accuracy Issues

| Current Content | Correct Information | Source |
|-----------------|---------------------|--------|
| None found | Content is accurate | docs.mendix.com/refguide/security/ |

## Missing Concepts

| Concept | Priority | Official Source |
|---------|----------|-----------------|
| **Anonymous users can only have ONE user role** | Critical | Exam questions - heavily tested |
| **XPath constraints don't apply to CREATE** | Critical | Exam questions - heavily tested |
| **Sub-microflow access** - called microflows don't need separate access | Important | Existing content mentions but could emphasize |
| **Page opened by microflow** - doesn't need separate page access | Important | Exam questions - tested |
| **Where to configure what** - App Security vs Module Security locations | Critical | Exam questions - frequently tested |

## Recommended Changes

1. **Add "Security Access Locations" summary table** - This is heavily tested:
   ```
   | Configure | Location |
   |-----------|----------|
   | User roles | App Security |
   | Connect user roles to module roles | App Security |
   | Anonymous users | App Security |
   | Page access | Module Security |
   | Microflow access | Module Security |
   | Entity access | Module Security |
   ```

2. **Emphasize Anonymous User limitation** - Anonymous users can only have ONE user role (not multiple). Add this as a callout/note.

3. **Add XPath constraint CREATE exception** - XPath constraints in access rules do NOT apply to CREATE operations - only Read, Write, Delete.

4. **Clarify sub-microflow/sub-page access** - Add notes that:
   - Sub-microflows called from another microflow don't need separate access
   - Pages opened by microflow don't need separate page access

5. **Add exam tip section** for security access locations - this is one of the most frequently tested topics.

## Content Comparison Summary

### Currently Covered (Correctly)
- All three security levels (Off, Prototype/Demo, Production)
- User roles vs Module roles distinction
- Module roles properties
- Page access matrix and limitations
- Microflow access and "always allowed to call another microflow"
- Nanoflow access
- Entity access (CRUD)
- OData/GraphQL/REST access
- Data Set access levels
- Access rules principles (additive, no inheritance)
- XPath constraints with examples
- Member rights configuration
- Extensive best practices (injection, API security, hardening)
- Administrator and demo users
- Password policy

### Not Covered (Gaps)
- Anonymous users limited to ONE role
- XPath constraints don't apply to CREATE
- Security access locations summary (App vs Module)
- Sub-microflow/sub-page access rules
- Exam-focused quick reference

## Rewrite Needed: No

**Justification**: The file is excellent and comprehensive. Only minor additions needed for exam-specific details that are frequently tested. Structure and organization are very good.
