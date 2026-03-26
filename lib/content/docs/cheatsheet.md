# Mendix Intermediate Exam - Quick Reference Cheatsheet

## MEMORIZE THESE - High Frequency Exam Topics

---

## 1. Entity Colors
| Color | Type | Stored In |
|-------|------|-----------|
| **Blue** | Persistable | Database |
| **Orange** | Non-Persistable | Memory only |
| **Purple** | External | Data Hub |
| **Green** | View Entity | OQL query |

---

## 2. Association Delete Behavior Colors
| Border Color | Behavior |
|--------------|----------|
| **Red** | Cascade delete |
| **Blue** | Conditional delete (can set error message) |

---

## 3. Microflow Prefixes
| Prefix | Purpose |
|--------|---------|
| **DS_** | Data source |
| **ACT_** | Page action |
| **SUB_** | Sub-microflow |
| **VAL_** | Validation |
| **BCO_/ACO_** | Before/After Commit |
| **BCR_/ACR_** | Before/After Create |
| **BDE_/ADE_** | Before/After Delete |
| **CAL_** | Calculated attribute |
| **OCH_** | On Change |

---

## 4. List Operations Returns
| Operation | Returns |
|-----------|---------|
| **Head** | First object |
| **Tail** | List (all except first) |
| **Find** | First matching object |
| **Filter** | List of matching objects |
| **Contains** | Boolean |
| **Equals** | Boolean |
| **Union** | List (combined, no duplicates) |
| **Intersect** | List (in both) |
| **Subtract** | List (first minus second) |

---

## 5. Security Access Locations
| Configure | Location |
|-----------|----------|
| User roles | App Security |
| Connect user roles to module roles | App Security |
| Page access | Module Security |
| Microflow access | Module Security |
| Entity access | Module Security |
| Anonymous users | App Security |

---

## 6. XPath Quick Patterns
```
[Attribute = 'value']                    // Equals
[Attribute != 'value']                   // Not equals
[Attribute = empty]                      // Is empty
[Association = '[%CurrentUser%]']        // Current user
[Attribute = true()]                     // Boolean true
[Attr1 = 'x' and Attr2 > 100]           // Multiple conditions
[not(Association/Entity)]                // No association
```

---

## 7. Key Tokens
| Token | Returns |
|-------|---------|
| `[%CurrentUser%]` | Logged-in user |
| `[%CurrentDateTime%]` | Current date/time |
| `[%CurrentObject%]` | Context object |
| `$VariableName` | Variable reference |

---

## 8. Widgets for Associations
| Relationship | Widget |
|--------------|--------|
| Many-to-One (select one) | Reference Selector |
| Many-to-Many (select multiple) | Reference Set Selector |

---

## 9. Scrum Values
**F**ocus, **C**ourage, **O**penness, **C**ommitment, **R**espect

---

## 10. Daily Scrum
- **Duration**: 15 minutes
- **Responsible**: Scrum Master
- **Purpose**: Share progress, plans, issues

---

## 11. NPE Rules
- NPE must **own** association to persistable entity
- NPE has **no indexes**
- NPE has **no domain model validation**
- NPE stores in **memory only**

---

## 12. Calculated vs Stored Attributes
| Use Calculated When | Use Stored When |
|---------------------|-----------------|
| Viewed > Changed | Changed > Viewed |
| Don't need sort/filter | Need sort/filter |

---

## 13. Key Module Folders
| Folder | Contains |
|--------|----------|
| javasource/Actions | Java actions |
| javasource/Proxies | Generated classes, enums |
| userlib | Java libraries |
| theme | Styling files |

---

## 14. Anonymous Users
- Can have **only ONE** user role
- **DO need** entity access rules
- **DON'T need** username/password

---

## 15. Sub-Microflows
- **Equally capable** as regular microflows
- **Cannot extract**: Start event, End event, Parameters
- **Cannot change** primitive input parameters (Boolean, Integer, DateTime)
- Best practice: **2-3 levels max**

---

## 16. Rules vs Microflows
- Rules can **only return Boolean or Enumeration**
- Rules have **fewer activities**

---

## 17. Layouts
- **One** Main placeholder per layout
- **Master layout** = parent layout
- **Placeholders** = empty areas for pages
- Add dynamic data to layout via **Snippet only**

---

## 18. Event Handlers
- **Before** handlers must return **Boolean**
- **After Commit** = best for post-processing

---

## 19. Enum Names
- **Cannot contain spaces**
- **Cannot be changed** after creation (caption CAN be changed)

---

## 20. Import/Export
| Task | Use |
|------|-----|
| Import Excel | Excel Importer module |
| Export simple | Data grid export button |
| Export complex | Excel Exporter module |
| REST to objects | Import mapping |
| Objects to JSON | Export mapping |

---

## 21. Version Control
| Action | Use Case |
|--------|----------|
| Merge feature branch | Branch → Mainline |
| Advanced merge | Any direction |
| Tagged version | Deployment package |
| Modify-Modify conflict | Both changed same item |

---

## 22. Translation
- **Language format**: en-US (ISO 639)
- **Default language**: What users see
- **Missing translation**: Falls back to default
- **Batch translation**: See all translatable texts

---

## 23. Key Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl + Space | XPath autocomplete |

---

## 24. Data Hub Landscape Lines
| Line | Meaning |
|------|---------|
| Grey **dotted** | Consuming data |
| Grey **solid** | Providing data |

---

## Last-Minute Reminders

1. **Page opened by microflow** doesn't need separate page access
2. **Sub-microflow** doesn't need separate access
3. **XPath in access rules** doesn't apply to CREATE
4. **Annotations** can connect to multiple elements in microflows, but NOT to entities in domain model
5. **Reference Set Selector** requires **many-to-many** association
6. **createdDate descending** = newest first
7. **Marketplace modules** = don't edit directly, copy first
8. **Constants** = environment-specific configuration values
