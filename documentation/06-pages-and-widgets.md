# Pages and Widgets Documentation

## Overview

In Mendix, "A page is the basic end-user interface of a Mendix application. It is used to display information to the end-user, allow end-users to create and edit information, and enable end-users to trigger additional automated processing."

The platform functions as a Single Page Application (SPA), meaning all interactions occur within a single browser tab or window.

---

## Page Structure

Every page requires two foundational components:

1. **Layout**: "A frame you put your page in" - provides consistent structure across pages
2. **Page Template**: A basis with predefined elements that simplifies initial page creation

---

## Page Resources

| Resource | Purpose |
|----------|---------|
| **Layout** | Frame providing unified look and feel across platforms |
| **Page Template** | Predefined structure simplifying common design patterns |
| **Snippet** | Reusable interface parts used on pages and layouts |
| **Building Block** | Pre-styled widget sets appearing in editor toolbox |
| **Menu** | Defines menu structures for navigation widgets |
| **Image Collection** | Stores custom images for application use |

---

## Widget Categories

Pages are constructed using widgets organized into:

| Category | Description |
|----------|-------------|
| **Data Containers** | Central to forms; enable viewing and editing data |
| **Text Widgets** | Display textual information |
| **Structure Widgets** | Contain other widgets |
| **Input Elements** | Show and edit attribute values |
| **Images, Videos, Files** | Handle multimedia and file management |
| **Buttons** | Trigger actions |
| **Menus and Navigation** | Enable application navigation |
| **Authentication** | Implement user verification |
| **Charts** | Graphically represent data (add-on widgets) |

---

## Data View

A data view is a container widget designed to display the contents of exactly one object.

### Data Source Options

| Source | Description |
|--------|-------------|
| **Context** | Uses already-available objects from page parameters |
| **Microflow** | Executes microflow and displays return value |
| **Nanoflow** | Runs nanoflow client-side and displays results |
| **Listen to Widget** | Displays details from selected objects in list widgets |

### Key Properties

#### General Section
- **Form Orientation**: Controls label positioning (horizontal/vertical)
- **Label Width**: Bootstrap grid column weight (default: 3)
- **Show Footer**: Toggle footer visibility
- **Empty Entity Message**: Message when no source data available

#### Editability Section
- **Default**: Inherits from containing data container
- **Inherited from snippet call**: Matches parent snippet
- **Never**: Permanently read-only
- **Conditionally**: Based on attribute values or expressions

### Nested Data Views

Data views can contain complex structures including tab containers with nested data grids.

**Note**: "The footer of nested data views is always invisible."

---

## Data Grid

The data grid displays data in table format.

**Note**: Not supported on native mobile pages or React client. Use Gallery or List View for mobile, Data Grid 2 for React.

### Components

1. **Search Bar**: Enables users to search for objects
2. **Control Bar**: Provides buttons to control displayed objects
3. **Grid Columns**: Allows column property configuration

### Data Source Types

| Type | Description |
|------|-------------|
| **Database source** | Retrieves objects directly; supports searching and sorting |
| **Microflow source** | Executes microflow to calculate object list |
| **Association source** | Follows associations to retrieve objects |

### Key Properties

| Property | Description | Default |
|----------|-------------|---------|
| Show Control Bar Buttons | Controls visibility | True |
| Show Paging Bar | Yes (with/without count) or No | Yes (with count) |
| Number of Rows | Rows per page | 20 |
| Show Empty Rows | Displays empty rows for consistent height | False |
| Selection Mode | Single, multi, or no selection | Single |
| Default Button Trigger | Single or double-click | Double click |
| Refresh Time | Auto-refresh interval (seconds) | 0 |

### Selection Modes

- No selection
- Single selection (default)
- Single selection with mandatory selection
- Multi-selection (Ctrl+click)
- Simple multi-selection (click to toggle)

---

## Reference Selector Widgets (Exam Critical)

These widgets are used to select associated objects:

| Widget | Association Type | Use Case |
|--------|------------------|----------|
| **Reference Selector** | Many-to-One | Select ONE associated object (dropdown) |
| **Reference Set Selector** | Many-to-Many | Select MULTIPLE associated objects |

### Reference Selector
- Used for selecting a single associated object
- Displays as dropdown or radio buttons
- Works with `Reference` (many-to-one) associations
- Example: Select one Customer for an Order

### Reference Set Selector
- Used for selecting multiple associated objects
- Displays as a list with checkboxes or multi-select
- Works with `Reference set` (many-to-many) associations
- Example: Select multiple Tags for a Product

**Exam Tip**: Know which widget to use for each association multiplicity!

---

## Snippets

Snippets are reusable interface components that can be incorporated into pages, layouts, and other snippets.

### Creating Snippets

1. **Add new empty snippet** via Page Resources section
2. **Extract from existing content** by right-clicking widget and selecting "Extract snippet"

### Snippet Parameters

- Work similarly to page parameters with restrictions
- "Snippet parameters do not support primitive types and cannot be made optional"
- Configure through **Parameters** button in top bar

### Designer Properties

- **Canvas Width**: Default 800 pixels (editing only)
- **Canvas Height**: Default 600 pixels (editing only)

### Benefits

"By centralizing interface logic in snippets, developers can make changes in fewer places when modifying the interface."

---

## Navigation and Interaction

Pages can be linked to pass data between them. When a second page contains a data widget with a page parameter data source, objects can be passed from current to new page.

Pages open either in current browser pane or popup windows, depending on layout type.

---

## Design Principles

- Layouts support structure-defining widgets but exclude data display widgets
- Snippets can be placed in layouts as indirect method for including additional widget types
- The platform optimizes navigation by refreshing only page data when layouts match

---

## Sources

- [Pages](https://docs.mendix.com/refguide/pages/)
- [Data View](https://docs.mendix.com/refguide/data-view/)
- [Data Grid](https://docs.mendix.com/refguide/data-grid/)
- [Snippet](https://docs.mendix.com/refguide/snippet/)
