# Enumerations and Constants

## Enumerations Overview

An enumeration defines "a list of predefined values" used for enumeration attribute types.

**Example**: An order status might have values like _Open_, _Closed_, or _In Progress_.

---

## Enumeration Properties

| Property | Description |
|----------|-------------|
| **Name** | The enumeration identifier |
| **Documentation** | Information for developers (not visible to end-users) |
| **Export level** | For add-on modules (Hidden or Usable) |
| **Enumeration values** | One or more options representing choices |

---

## Enumeration Value Properties

### Caption
"The text the end-user sees for this enumeration value."
- Translatable
- Can contain any character including spaces

### Name
The technical identifier:
- Must start with a letter
- Can only contain letters, digits, and underscores
- Reserved words cannot be used (`abstract`, `boolean`, `class`, `enum`, etc.)

**Critical**: Changing a value's name is prohibited since it would "invalidate the data in your database."

### Name vs Caption (Exam Critical)

| Property | Can contain spaces? | Can be changed after creation? |
|----------|---------------------|-------------------------------|
| **Name** | No | **No** |
| **Caption** | Yes | Yes |

**Exam Tip**: This distinction is frequently tested. Name is technical (no spaces, immutable), Caption is user-facing (any characters, editable).

### Image
Optional image displayed in data grid columns when enumeration format is set to **Image**.

---

## Creating an Enumeration

1. Right-click in App Explorer and select **Add other** > **Enumeration**
2. Name the enumeration
3. Click **New** to add enumeration values with Name, Caption, and optional Image
4. Save each value and the enumeration

---

## Localization

Captions are translatable text, accessible through the Language Menu for multiple language support.

---

# Constants

## Overview

Constants define configuration values that can vary per environment. They're accessible in expressions, web services, and can be configured differently across deployments.

---

## Creating and Configuring Constants

### Environment-Specific Configuration

| Platform | Method |
|----------|--------|
| Licensed Mendix Cloud, SAP BTP, Kubernetes | "Model Options" tab in Environment Details |
| Other Cloud Foundry platforms | Environment variables using `module.constant` format |
| Local/Free App | Values defined in Studio Pro |

### Local Overrides
Constants can be overridden in configurations for local testing without modifying defaults.

---

## Key Properties

| Property | Description |
|----------|-------------|
| **Name** | Identifier used to reference the constant |
| **Documentation** | Development purposes only |
| **Export Level** | Hidden (default) or Usable |
| **Data Types** | String, Boolean, date/time, decimal, integer/long |
| **Default Value** | Used when running locally or in Free App |
| **Exposed to Client** | When "Yes", constant is accessible in nanoflows and page expressions |

---

## Critical Security Consideration

**"When a constant is exposed to the client...you should not use sensitive data or secrets such as passwords."**

This applies to:
- Web apps
- Offline-first PWAs
- Native applications

---

## Use Cases

Constants work in:
- Expressions (prefixed with `@`)
- Consumed web services (specifying environment-specific URLs)
- Configuration values that change between environments

---

## Sources

- [Enumerations](https://docs.mendix.com/refguide/enumerations/)
- [Constants](https://docs.mendix.com/refguide/constants/)
