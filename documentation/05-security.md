# Security Documentation

## Overview

App Security in Mendix allows you to toggle security on or off and configure authentication settings. Access it via **App Explorer > App > Security**.

---

## Security Levels

Three security levels define how comprehensively security is applied:

| Level | Description | Usage |
|-------|-------------|-------|
| **Off** | No security applied. Users don't sign in and can access everything | Local testing and Free Apps only |
| **Prototype/Demo** | Security applies to authentication, forms, and microflows. Users can access all data | Development/testing |
| **Production** | Full security across all areas | Required for licensed Mendix Cloud |

---

## Core Security Components

### User Roles

User roles aggregate access rights across data, forms, and microflows. Administrators assign roles to end-users.

**User Roles vs Module Roles**: Each user role contains one or more module roles, enabling modules to remain self-contained and reusable.

#### Role Properties

- **Name**: Displayed to administrators
- **Documentation**: Additional descriptive information
- **Module Roles**: List of module roles with accumulated access rights
- **Check Security**: Whether security consistency is verified

#### User Management Properties

- **All**: End-users can manage all users and assign any role
- **Selected**: End-users manage only users with specified roles

**Important**: "The effects of changes to user roles are not immediate."

### Administrator

Configure default credentials and assign a user role specifically for the administrator account.

### Demo Users

"Demo users are a demonstration of each user role existing in your app." Enable testing how the application appears for different roles.

### Anonymous Users

Allow unauthenticated access while restricting data through assigned user roles. Users bypass sign-in but operate within role-based constraints.

**Critical**: Anonymous users can only have **ONE** user role assigned (not multiple).

### Password Policy

Define password requirements including:
- Minimum length
- Required character types (digits, uppercase)

---

## Security Access Locations (Exam Critical)

| Configure | Location |
|-----------|----------|
| User roles | **App Security** |
| Connect user roles to module roles | **App Security** |
| Anonymous users | **App Security** |
| Administrator account | **App Security** |
| Page access | **Module Security** |
| Microflow access | **Module Security** |
| Entity access | **Module Security** |
| OData/REST access | **Module Security** |

**Exam Tip**: Know where each security setting is configured!

---

## Module Security

### Module Roles

Module roles are custom roles created within a module to define access permissions.

Properties:
- **Name**: Identifies the module role
- **Documentation**: For Studio Pro users only

"You can assign multiple module roles to a user role under **App Security** > **User roles** tab."

### Page Access

Defines visibility of pages to different roles through a matrix display.

"A page that is not visible for a specific role will not show up in navigation structures."

**Important**: Page access settings don't prevent access through deeplinks or forced-visible buttons. Use entity and microflow access for data restriction.

### Microflow Access

Controls which microflows users with specific roles can execute.

"A microflow is always allowed to call another microflow and these roles are not checked then." Role checking only applies to client-side execution.

### Nanoflow Access

Similar to microflows, defines execution permissions based on user roles.

### Entity Access

"**Entity Access** defines for each module role whether users are authorized to **Create**, **Read**, **Write** and/or **Delete** objects of the entity."

XPath constraints can restrict access to specific object sets.

### OData/GraphQL & REST Access

Controls service access per role.

REST access is only visible when authentication is required.

### Data Set Access

Three access levels:
- **Full access**: No constraints apply
- **Limited access**: At least one constraint applies
- **No access**: Users cannot access the dataset

---

## Access Rules

Access rules define what end-users can do with entity objects:
- Creating objects
- Deleting objects
- Viewing member values
- Editing member values

### Key Principles

**Additive Rules**: "If multiple access rules apply to the same module role, all access rights of those rules are combined."

**No Inheritance**: Access rules are not inherited from parent entities. Security must be explicitly specified for each entity.

**Production Mode Required**: Access rules editor only appears when App Security is set to Production mode.

### XPath Constraints

Limit which objects users can access:

**Owner Constraint**: `[System.owner='[%CurrentUser%]']`

**Path to User**: Access based on associated User objects

**Important**: XPath constraints only apply to persistable entities and are database-enforced.

**Critical Exam Note**: XPath constraints in access rules do **NOT** apply to CREATE operations - only to Read, Write, and Delete.

### Member Rights Configuration

| Level | Description |
|-------|-------------|
| None | No access |
| Read | Read-only access |
| Read and Write | Full access |

**Note**: "You cannot set Write access to attributes which are calculated."

---

## Security Best Practices

### Entity Access Rules

- **System-determined attributes** (like order status) should never be writable
- Anonymous users should be constrained to objects they own
- Avoid default read-write access; explicitly configure each attribute
- Use entity-level constraints rather than page-level widget restrictions

### Injection Prevention

#### HTML/JavaScript Content
Sanitize user input using XSSSanitize action from Community Commons.

#### Database Queries
Use prepared statements or validate input against strict patterns.

### API Security Configuration

For REST/OData endpoints:
1. **Username/Password Authentication**: Basic auth validated against System.User
2. **Active Session**: CSRF tokens via `mx.session.getConfig("csrftoken")`
3. **Custom Authentication**: Microflow validates headers (JWT, API keys)

### Production Hardening

- Rename default MxAdmin administrator account
- Disable unused endpoints (ws-doc, rest-doc)
- Apply IP restrictions and certificates to sensitive endpoints
- Use SSL for all consumed web services
- Configure HTTP headers to prevent clickjacking
- Enforce strong password policies
- Use third-party identity providers (SAML)

### Additional Protections

- Encrypt sensitive data at rest using Encryption module
- Maintain high app hygiene by removing unused modules
- Scan uploaded files for malware
- Configure user roles restrictively
- Disable anonymous access when unused

---

## Sources

- [App Security](https://docs.mendix.com/refguide/app-security/)
- [Module Security](https://docs.mendix.com/refguide/module-security/)
- [Access Rules](https://docs.mendix.com/refguide/access-rules/)
- [User Roles](https://docs.mendix.com/refguide/user-roles/)
- [Best Practices Security](https://docs.mendix.com/howto9/security/best-practices-security/)
