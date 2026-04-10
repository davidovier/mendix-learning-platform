# Modules Documentation

## Overview

Modules are fundamental organizational units in Mendix applications. A Mendix app consists of modules: a **System** module, a UI resources package, one or more user-defined **app modules**, Marketplace modules, add-on modules, and solution modules.

**Key Concept**: Modules enable developers to partition application functionality into separate, manageable components.

**Example**: "A web shop can put order management in a different module than customer and product management."

---

## Module Types (Exam Critical)

When creating a module, developers can choose from three distinct types:

| Type | Description | Use Case |
|------|-------------|----------|
| **App modules** | Standard modules for primary application development | Regular app development |
| **Add-on modules** | Designed for publishing reusable functionality | Marketplace distribution |
| **Solution modules** | Specialized modules for packaged solutions | ISV solutions |

**Critical Warning**: Converting between module types can cause **data loss**. When you change a module type, certain module-specific settings may be reset or removed. Always backup before converting.

---

## Module Settings

Access module settings by right-clicking the module in the App Explorer and selecting **Settings**.

### General Tab

| Property | Description |
|----------|-------------|
| **Name** | Module identifier (used in code and expressions) |
| **Documentation** | Description for developers |
| **Module Type** | App module, Add-on module, or Solution module |

### Version Tab (Exam Important)

| Property | Description |
|----------|-------------|
| **Module Version** | Semantic versioning (e.g., 1.0.0) |
| **Minimum Supported Mendix Version** | Minimum Studio Pro version required |

**Note**: Versioning is required for publishing modules to the Marketplace.

### Dependencies Tab

Lists other modules this module depends on for functionality.

### Java Dependencies Tab (Exam Critical)

| Property | Description |
|----------|-------------|
| **JAR Files** | External Java libraries required by the module |
| **Location** | Libraries stored in `userlib` folder |

---

## Export Protection Levels (Exam Critical)

When creating add-on or solution modules, you can set export levels for documents:

| Level | Description |
|-------|-------------|
| **Hidden** | Document is not visible or accessible to consumers |
| **Usable** | Document can be used but not viewed or modified |

**Export levels apply to**:
- Entities and attributes
- Microflows
- Constants
- Enumerations
- Pages (for solution modules)

**Default**: Most documents are **Hidden** by default in add-on modules.

---

## Module Export Formats (Exam Critical)

| Format | Extension | Description |
|--------|-----------|-------------|
| **Module Package** | `.mpk` | Complete module export including all documents |
| **Add-on Module** | `.mxmodule` | Protected module for distribution (compiled) |

### Key Differences

| Aspect | .mpk | .mxmodule |
|--------|------|-----------|
| **Source visibility** | Full source access | Protected/compiled |
| **Editable** | Yes | No (read-only) |
| **Use case** | Team sharing, backup | Marketplace distribution |

---

## Module Contents

Modules can contain various document types organized into categories:

### Common Documents
- **Pages**: User interfaces with widgets
- **Microflows**: Server-side application logic
- **Nanoflows**: Client-side application logic
- **Enumerations**: Predefined value sets

### Domain Model
- **Entities**: Data structures
- **Associations**: Relationships between entities
- **Annotations**: Documentation within domain model

### Page Resources
- Layouts
- Menus
- Snippets
- Images
- Building Blocks

### Resources
- Constants
- Datasets
- Java actions
- Rules
- Scheduled events
- Document templates

### Services
- Consumed and published REST services
- OData services
- Web services
- GraphQL services

---

## Java Folder Structure (Exam Critical)

When a module contains Java actions, Studio Pro creates a specific folder structure:

```
project/
├── javasource/
│   └── modulename/
│       ├── actions/          # Custom Java action implementations
│       │   └── MyAction.java
│       └── proxies/          # Auto-generated entity proxies
│           └── MyEntity.java
└── userlib/                  # External JAR dependencies
    └── library.jar
```

### Folder Purposes

| Folder | Purpose | Editable? |
|--------|---------|-----------|
| **javasource/[module]/actions/** | Custom Java action code | Yes |
| **javasource/[module]/proxies/** | Generated entity proxy classes | **No** (auto-generated) |
| **userlib/** | External JAR libraries | Yes |

**Warning**: Never manually edit files in the `proxies` folder - they are regenerated automatically.

---

## Module Security

Modules feature a dedicated security model. Developers can "define module security via module roles and specify the security settings of those module roles for pages, microflows, entities, and datasets."

### Module Roles

- Created within each module
- Linked to user roles at the app level
- Define access to module documents

### Security Settings Per Module Role

| Document Type | Configurable Access |
|---------------|---------------------|
| **Pages** | Visible or not |
| **Microflows** | Executable or not |
| **Entities** | Create, Read, Write, Delete |
| **Datasets** | Full, Limited, or No access |

This portable security model enables secure component reuse across applications.

---

## Importing and Exporting Modules

### Export Module

1. Right-click module in App Explorer
2. Select **Export module package...**
3. Choose export location
4. Select `.mpk` or `.mxmodule` format

### Import Module

1. Right-click app in App Explorer
2. Select **Import module package...**
3. Browse to `.mpk` or `.mxmodule` file
4. Resolve any conflicts

### Conflict Resolution

When importing, you may encounter:
- **Name conflicts**: Rename imported module
- **Dependency issues**: Install required dependencies first
- **Version conflicts**: Update to compatible versions

---

## Best Practices

1. **Modular Design**: Separate concerns into different modules
2. **Clear Naming**: Use descriptive module names
3. **Version Control**: Maintain proper versioning for shared modules
4. **Documentation**: Document module purpose and dependencies
5. **Security**: Configure module roles before deployment

---

## Sources

- [Modules](https://docs.mendix.com/refguide/modules/)
- [Module Settings](https://docs.mendix.com/refguide/module-settings/)
- [Export Levels](https://docs.mendix.com/refguide/export-levels/)
