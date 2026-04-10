# Nanoflows Documentation

## Overview

Nanoflows are application logic flows similar to microflows that execute directly in the browser or device rather than on a server. This fundamental difference enables them to function in offline environments and provides performance benefits for logic that doesn't require server access.

---

## Key Differences from Microflows

| Aspect | Microflows | Nanoflows |
|--------|------------|-----------|
| **Execution Location** | Server-side | Client-side (browser/device) |
| **Offline Capability** | No | Yes |
| **Performance** | Requires server round-trip | Faster for non-server logic |
| **Database Operations** | Direct database access | Each activity creates network request |

---

## When to Use Nanoflows

### Optimal Use Cases

#### 1. Offline Mobile Applications
Designed specifically for offline-first apps where database operations execute against local offline databases, delivering fast performance.

#### 2. Online Applications Without Database Operations
Work well for:
- UI logic
- Validations
- Calculations
- Navigation

When they contain no database-related activities.

### Database Activities That Create Network Requests

These activities trigger network calls in online apps:
- Create object
- Commit object(s)
- Retrieve object(s)
- Rollback object

### Best Practice Exception

You can use Create object activity with non-persistable entities (NPEs) if they lack:
- Event handlers
- Calculated attributes
- Read-only attributes

These create client-side objects without network requests.

---

## Nanoflow Elements and Structure

Nanoflows use BPMN (Business Process Model and Notation) graphical notation.

### Components

| Component | Description |
|-----------|-------------|
| **Events** | Start/end points and loop operations |
| **Flows** | Connections defining execution order |
| **Decisions** | Conditional branching and path merging |
| **Activities** | Actions executed within the flow |
| **Loops** | Iteration over object lists |
| **Parameters** | Input data for the nanoflow |
| **Annotations** | Comments within the flow |

---

## Activities Available

Nanoflows support various activity categories:

- **Object operations**: create, retrieve, commit, rollback
- **List operations**: aggregate, change, create list
- **Variable management**: create variable, change variable
- **Client-specific actions**: showing messages, showing pages

---

## JavaScript Actions (Exam Critical)

Nanoflows can call **JavaScript actions** - custom client-side code that extends nanoflow capabilities.

### Key Points

| Aspect | Description |
|--------|-------------|
| **Purpose** | Execute custom JavaScript in the browser/device |
| **Location** | Created in module's resources |
| **Parameters** | Can accept and return Mendix objects |
| **Use cases** | Device features, browser APIs, third-party libraries |

### Common Use Cases

- Access device camera or GPS
- Interact with browser localStorage
- Call external JavaScript libraries
- Perform complex client-side calculations

**Note**: JavaScript actions only work in nanoflows, not microflows.

---

## Nanoflow-Only Activities (Exam Critical)

Some activities are **exclusive to nanoflows**:

| Activity | Description |
|----------|-------------|
| **Call JavaScript action** | Execute custom JavaScript code |
| **Log message (client)** | Log to browser console |
| **Synchronize** | Sync offline data with server |
| **Synchronize to device** | Download data to offline database |
| **Show progress bar** | Display progress to user |
| **Hide progress bar** | Remove progress indicator |

### Activities NOT Available in Nanoflows

| Activity | Reason |
|----------|--------|
| **Call web service** | Requires server-side execution |
| **Call REST service** | Requires server-side execution |
| **Import/Export mappings** | Server-side operations |
| **Generate document** | Requires server processing |
| **Java action** | Server-side only |

---

## Security

**Important**: "Nanoflows are executed in the context of the current user. Any operation for which the user is unauthorized will fail."

---

## Converting Nanoflows

You can convert nanoflows to microflows through right-click context menu options:
- "Duplicate as microflow"
- "Convert to microflow"

Warnings will appear about non-replaceable usages.

---

## Best Practices

1. **Use for offline apps**: Primary purpose is offline-first applications
2. **Avoid database operations in online apps**: Each creates a network request
3. **Use for UI logic**: Validations, calculations, navigation
4. **Consider NPEs**: Non-persistable entities without handlers don't create network calls

---

## When to Choose Microflows vs Nanoflows

| Scenario | Use |
|----------|-----|
| Server-side business logic | Microflow |
| Database-heavy operations | Microflow |
| Offline application logic | Nanoflow |
| Quick UI validations | Nanoflow |
| Client-side calculations | Nanoflow |
| Integration with external services | Microflow |

---

## Sources

- [Nanoflows](https://docs.mendix.com/refguide/nanoflows/)
- [Microflows and Nanoflows](https://docs.mendix.com/refguide/microflows-and-nanoflows/)
