# Mendix Intermediate Exam Content - Master Audit Report

**Generated:** 2026-04-10  
**Audited against:** Official Mendix Documentation (docs.mendix.com)

---

## Executive Summary

| # | Topic | Assessment | Critical Issues | Rewrite Needed |
|---|-------|------------|-----------------|----------------|
| 1 | Domain Model | **Strong** | 0 | No |
| 2 | Microflows | **Strong** | 0 | No |
| 3 | Nanoflows | Adequate | 0 | No |
| 4 | Modules | **Weak** | 0 | **Yes** |
| 5 | Security | **Strong** | 0 | No |
| 6 | Pages & Widgets | **Strong** | 0 | No |
| 7 | XPath & Expressions | **Strong** | 0 | No |
| 8 | Integration | Adequate | 0 | No |
| 9 | Java Extensions | Adequate | 0 | No |
| 10 | Events & Validation | Adequate | 0 | No |
| 11 | Enumerations & Constants | **Strong** | 0 | No |
| 12 | Scheduled Events | **Strong** | 0 | No |

**Overall:** 7 Strong, 4 Adequate, 1 Weak. No accuracy issues found. 1 topic needs full rewrite (Modules).

---

## Priority Actions

### Critical (Must Fix - Exam Heavily Tested)

1. **Microflows: Add naming convention prefixes** (02-microflows.md)
   - DS_, ACT_, SUB_, VAL_, BCO_/ACO_, BCR_/ACR_, BDE_/ADE_, CAL_, OCH_
   
2. **Microflows: Add list operation return types** (02-microflows.md)
   - Head→object, Tail→list, Find→object, Filter→list, Contains→boolean, etc.

3. **Security: Add anonymous user ONE role limitation** (05-security.md)
   
4. **Security: Add XPath constraints don't apply to CREATE** (05-security.md)

5. **Security: Add "where to configure what" table** (05-security.md)
   - App Security vs Module Security locations

6. **Pages: Add Reference Selector widget** (06-pages.md)
   - For many-to-one associations

7. **Pages: Add Reference Set Selector widget** (06-pages.md)
   - For many-to-many associations

8. **XPath: Add tokens detail** (07-xpath.md)
   - [%CurrentUser%], [%CurrentDateTime%], [%CurrentObject%]

9. **XPath: Add Ctrl+Space autocomplete** (07-xpath.md)

10. **Enumerations: Emphasize name vs caption rules** (11-enumerations.md)
    - Name: no spaces, cannot change
    - Caption: spaces allowed, can change

### Important (Should Add)

1. **Domain Model: Add external entity association rules** (01-domain-model.md)
   - External entities cannot own associations with local entities

2. **Domain Model: Add association reversal data loss warning** (01-domain-model.md)

3. **Nanoflows: Add offline database performance detail** (03-nanoflows.md)

4. **Modules: Full rewrite required** (04-modules.md)
   - Add module settings, export levels, versioning, data loss warnings

5. **Integration: Add import/export mappings** (08-integration.md)

6. **Integration: Add Excel Importer/Exporter modules** (08-integration.md)

7. **Integration: Add Data Hub visual indicators** (08-integration.md)
   - Dotted=consuming, Solid=providing

8. **Java: Add folder structure** (09-java.md)
   - javasource/Actions, javasource/Proxies, userlib

9. **Events: Add naming prefixes** (10-events.md)
   - BCO_, ACO_, BCR_, ACR_, BDE_, ADE_

### Nice-to-Have

1. Domain Model: View entity OQL details
2. Microflows: BPMN notation mention
3. Nanoflows: Error handling details
4. Pages: Layout placeholders (main/other)
5. XPath: Association path traversal examples

---

## Detailed Findings by Topic

### 1. Domain Model (Strong)
**File:** 01-domain-model.md (7091 bytes)

Content is comprehensive covering entity types, attributes, associations, and delete behavior. Minor gaps:
- External entity association rules
- Association reversal data loss warning
- Export levels for entities

### 2. Microflows (Strong)
**File:** 02-microflows.md (7659 bytes)

Excellent coverage of notation, events, activities, loops, decisions, error handling, and debugging. Critical gaps:
- **Naming convention prefixes** (heavily tested)
- **List operation return types** (heavily tested)
- $latestSoapFault and $latestHttpResponse variables

### 3. Nanoflows (Adequate)
**File:** 03-nanoflows.md (3637 bytes)

Covers essentials correctly but shorter than other files. Needs:
- Offline database performance details
- Performance benchmark (1 activity = 1 network call)
- Error handling information

### 4. Modules (Weak - Rewrite Required)
**File:** 04-modules.md (2010 bytes)

Shortest topic file. Missing critical content:
- Module settings dialog
- Export protection levels (Hidden/Usable)
- Export formats (.mpk vs .mxmodule)
- Data loss on module type conversion
- Versioning requirements
- Java dependencies tab
- Task queues, mapping documents

### 5. Security (Strong)
**File:** 05-security.md (6498 bytes)

Comprehensive coverage including levels, roles, access rules, and best practices. Critical gaps:
- Anonymous users limited to ONE role
- XPath constraints don't apply to CREATE
- Security access locations table (App vs Module)

### 6. Pages & Widgets (Strong)
**File:** 06-pages-and-widgets.md (5989 bytes)

Well-organized coverage of pages, data views, data grids, and snippets. Critical gaps:
- **Reference Selector widget** (heavily tested)
- **Reference Set Selector widget** (heavily tested)
- Layout placeholders

### 7. XPath & Expressions (Strong)
**File:** 07-expressions-and-xpath.md (5904 bytes)

Excellent coverage of both expressions and XPath. Critical gaps:
- **XPath tokens with details** (heavily tested)
- **Ctrl+Space autocomplete** (frequently tested)
- empty keyword, true()/false() functions

### 8. Integration (Adequate)
**File:** 08-integration.md (3903 bytes)

Good REST and OData coverage. Gaps:
- Import/export mappings
- Excel Importer/Exporter modules
- Data Hub visual indicators

### 9. Java Extensions (Adequate)
**File:** 09-extending-with-java.md (2867 bytes)

Covers basics well. Gaps:
- Folder structure (javasource, userlib)
- Proxy classes explanation
- Common use cases

### 10. Events & Validation (Adequate)
**File:** 10-events-and-validation.md (3103 bytes)

Good coverage of both topics. Gaps:
- Event handler naming prefixes
- Exam tips for event handler usage

### 11. Enumerations & Constants (Strong)
**File:** 11-enumerations-and-constants.md (3229 bytes)

Comprehensive coverage. Minor gap:
- Clearer emphasis on Name vs Caption rules (exam critical)

### 12. Scheduled Events (Strong)
**File:** 12-scheduled-events.md (2607 bytes)

Excellent comprehensive coverage. Very complete - only needs exam tips callout.

---

## Exam Objectives Coverage

Based on the official Mendix Intermediate exam objectives:

| Official Objective | Current Coverage | Gap |
|--------------------|------------------|-----|
| Domain Model & Data Management | Full | Minor additions |
| Microflows | Full | Add prefixes, list ops |
| Nanoflows | Partial | Expand content |
| Modules | **Partial** | **Significant rewrite** |
| Security | Full | Add exam tips |
| Pages & Widgets | Full | Add Reference Selectors |
| XPath & Expressions | Full | Add tokens, shortcuts |
| Integration | Partial | Add mappings |
| Java Extensions | Partial | Add folder structure |
| Events & Validation | Partial | Add prefixes |
| Enumerations & Constants | Full | Emphasize rules |
| Scheduled Events | Full | Minor additions |
| Version Control | Covered in question files | - |
| Agile/Scrum | Covered in question files | - |

---

## Implementation Priority

### Phase 1: Critical Exam Topics (Do First)
1. Add microflow prefixes and list operations (02)
2. Rewrite modules documentation (04)
3. Add security exam tips (05)
4. Add Reference Selector widgets (06)
5. Add XPath tokens and shortcuts (07)

### Phase 2: Important Additions
6. Domain model external entity rules (01)
7. Expand nanoflows (03)
8. Add integration mappings (08)
9. Add Java folder structure (09)
10. Add event handler prefixes (10)

### Phase 3: Polish
11. Enumerations emphasis (11)
12. Scheduled events tips (12)
13. Update question files (13-19)
14. Update cheatsheet (20)

---

## Files Summary

| File | Bytes | Lines | Action |
|------|-------|-------|--------|
| 01-domain-model.md | 7091 | 204 | Add 3 sections |
| 02-microflows.md | 7659 | 252 | Add 2 critical sections |
| 03-nanoflows.md | 3637 | 126 | Expand +1500 bytes |
| 04-modules.md | 2010 | 78 | **Full rewrite** |
| 05-security.md | 6498 | 203 | Add 3 exam tips |
| 06-pages-and-widgets.md | 5989 | 176 | Add 2 widget sections |
| 07-expressions-and-xpath.md | 5904 | 256 | Add tokens, shortcuts |
| 08-integration.md | 3903 | 148 | Add mappings section |
| 09-extending-with-java.md | 2867 | 96 | Add folder structure |
| 10-events-and-validation.md | 3103 | 102 | Add prefixes |
| 11-enumerations-and-constants.md | 3229 | 117 | Emphasize rules |
| 12-scheduled-events.md | 2607 | 89 | Add exam tips |

**Total current:** ~54,497 bytes  
**Estimated after updates:** ~65,000 bytes (+20%)
