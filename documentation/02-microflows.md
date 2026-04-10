# Microflows Documentation

## Overview

Microflows enable developers to express application logic visually rather than through traditional code. They allow you to perform actions like creating/updating objects, displaying pages, and making conditional choices.

**Key Constraint**: Microflows execute on the runtime server and cannot function in offline applications. For offline logic, use Nanoflows instead.

---

## Microflow Notation

Microflows use Business Process Model and Notation (BPMN), a standardized graphical format.

### Events

| Event | Description |
|-------|-------------|
| **Start Event** | Single entry point for every microflow |
| **End Event** | Defines where microflows terminate; may require return values |
| **Error Event** | Stops execution and throws accumulated errors |
| **Continue Event** | Skips current loop iteration (loop-only) |
| **Break Event** | Exits loops entirely (loop-only) |

### Flows & Connections

- **Sequence Flow**: Arrows connecting elements, defining execution order
- **Annotation Flow**: Dashed lines linking comments to elements

### Decisions

| Decision Type | Description |
|---------------|-------------|
| **Decision** | Branches based on conditions; follows one path only |
| **Object Type Decision** | Branches by object specialization |
| **Merge** | Combines multiple paths into one |

### Core Components

- **Activities**: Executable actions within microflows
- **Loop**: Iterates over object lists
- **Parameter**: Input data for microflows
- **Annotation**: Comments within microflows

---

## Activities (Executable Actions)

### Object Activities

| Activity | Description |
|----------|-------------|
| **Create Object** | Creates a new entity instance |
| **Change Object** | Changes the members of an object |
| **Commit Object(s)** | Stores objects persistently in database |
| **Delete Object(s)** | Removes objects permanently |
| **Retrieve Object(s)** | Gets objects from database |
| **Rollback Object** | Undoes uncommitted changes |
| **Cast Object** | Changes object type from generalized to specialized |

### List Activities

| Activity | Description |
|----------|-------------|
| **Aggregate List** | Calculates aggregated values over a list |
| **Change List** | Adds/removes objects from a list |
| **Create List** | Creates an empty list |
| **List Operation** | Performs actions on a list |

### Variable Activities

| Activity | Description |
|----------|-------------|
| **Create Variable** | Initialize new variable with initial value |
| **Change Variable** | Modify existing variable's value |

### Call Activities

- Call Java Action
- Call JavaScript Action
- Call Microflow

### Client Activities

- Call Nanoflow
- Show Message
- Close Page
- Download File
- Show Page
- Synchronization operations
- Validation Feedback

### Integration Activities

- REST/Web Service calls
- External database queries
- File imports/exports
- Document generation

### Specialized Activities

- Log Message
- Metrics operations
- ML Model calls
- Workflow activities

---

## Loops

Loops execute repeated actions and iterate either over a list or based on a Boolean condition.

### Loop Variable

Within loops, `$currentIndex` contains the current iteration number, starting at zero.

### Loop Types

#### For Each (Item in the List)
Iterates over list objects. Configure:
- **Iterate over**: Specifies the list
- **Loop object name**: Renames the iterator

**Example**: Set purchase date for every OrderLine object.

#### While (Condition Is True)
Repeats until condition evaluates to `false`, evaluated before each iteration.

**Example**: Log numbers between 1 and 5.

### Loop Constraints

- Loops cannot contain start or end events
- Only loops can contain break and continue events
- Condition expressions must return Boolean values

---

## Decisions

Decisions are elements that split or merge sequence flows based on conditions. They have a diamond shape.

### Decision Types

1. **Decision**: Makes a choice based on a condition and follows one path only
2. **Object Type Decision**: Makes a choice based on the type of an object
3. **Merge**: Merges incoming flows into single path

---

## Parameters & Return Values

**Parameters**: Data that serves as input for a microflow. Populated when microflows are triggered from other locations.

**Return Values**: Depend on microflow configuration. End events may require specified return values based on the microflow's return type.

---

## Error Handling

### Error Handling Options

#### 1. Rollback (Default)
All changes revert to savepoint created at microflow start, flow aborts, system error message displays.

#### 2. Custom with Rollback
Create error handling flows that execute when failures occur. Everything rolls back to savepoint.

#### 3. Custom without Rollback
Preserves data changes made before the failure point.

#### 4. Continue
Available only for Call Microflow activities and loops. Execution proceeds as if no error occurred.

**Warning**: "You should be very careful with using the Continue option since it can make it very difficult to understand when something goes wrong."

### Error Inspection Variables

| Variable | Description |
|----------|-------------|
| `$latestError` | Contains ErrorType, Message, and Stacktrace |
| `$latestSoapFault` | Specific to SOAP faults with Code, Reason, Node, Role, Detail |
| `$latestHttpResponse` | Available for REST errors |

### Best Practices

1. **Always log errors**: Use a log activity to print error message and stack trace
2. **Target third-party integrations**: Add custom handling to external system activities
3. **Prefer Custom without Rollback**: Where feasible, instead of Continue
4. **Avoid complexity**: Excessive error handling makes behavior harder to predict

---

## Debugging Microflows

### Three Main Debugging Panes

1. **Breakpoints Pane**: Displays all microflows containing breakpoints
2. **Debugger Pane**: Walks through microflow step by step during execution
3. **Variables Pane**: Shows all variables, objects, and lists involved

### Using Breakpoints

1. Run your application locally
2. Open target microflow in Studio Pro
3. Right-click any activity and select "Add breakpoint" (red dot)

**Limitation**: "Debugging with breakpoints is not supported for microflows executed during application startup."

### Debugger Controls

| Control | Action |
|---------|--------|
| **Step Into** | Enter sub-microflows or loops |
| **Step Over** | Move to next step without entering sub-flows |
| **Step Out** | Exit current sub-flow or loop |
| **Continue** | Resume until next breakpoint |
| **Continue All** | Resume all paused flows |

### Breakpoint Conditions

Configure conditions using expressions to break only when specific criteria are met.

**Example**: `$currentUser/name = 'YourUserName'`

---

## Naming Convention Prefixes

Mendix recommends standardized prefixes for microflows to indicate their purpose:

| Prefix | Purpose | Example |
|--------|---------|---------|
| **DS_** | Data source microflow | DS_GetActiveOrders |
| **ACT_** | Page action (button click) | ACT_SubmitOrder |
| **SUB_** | Sub-microflow (called by others) | SUB_CalculateTotal |
| **VAL_** | Validation microflow | VAL_CheckOrderValid |
| **BCO_** | Before Commit event handler | BCO_Order |
| **ACO_** | After Commit event handler | ACO_Order |
| **BCR_** | Before Create event handler | BCR_Order |
| **ACR_** | After Create event handler | ACR_Order |
| **BDE_** | Before Delete event handler | BDE_Order |
| **ADE_** | After Delete event handler | ADE_Order |
| **CAL_** | Calculated attribute microflow | CAL_TotalPrice |
| **OCH_** | On Change event handler | OCH_CustomerChanged |

---

## List Operations

List operations perform actions on lists and return specific result types:

| Operation | Returns | Description |
|-----------|---------|-------------|
| **Head** | Single object | First item in the list |
| **Tail** | List | All items except the first |
| **Find** | Single object | First item matching expression |
| **Filter** | List | All items matching expression |
| **Contains** | Boolean | True if object exists in list |
| **Equals** | Boolean | True if lists have same objects |
| **Union** | List | Combined lists (no duplicates) |
| **Intersect** | List | Objects present in both lists |
| **Subtract** | List | First list minus second list |
| **Sort** | List | Sorted by specified attribute |

**Exam Tip**: Know what each operation returns (single object vs. list vs. boolean).

---

## Best Practices

- Follow standardized naming conventions (see prefixes above)
- Create maintainable, efficient logic
- Optimize microflow design for performance
- Leverage proven community patterns

---

## Additional Features

**Format Conversion**: Microflows can be converted to Nanoflows through "Duplicate as nanoflow" or "Convert to nanoflow" options.

**Export**: Microflows can be exported as PNG images via File > Export as image.

---

## Sources

- [Microflows](https://docs.mendix.com/refguide/microflows/)
- [Debugging Microflows and Nanoflows](https://docs.mendix.com/refguide/debug-microflows-and-nanoflows/)
- [Error Handling in Microflows](https://docs.mendix.com/refguide/error-handling-in-microflows/)
- [Decisions](https://docs.mendix.com/refguide/decisions/)
- [Loop](https://docs.mendix.com/refguide/loop/)
