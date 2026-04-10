# Domain Model Documentation

## Overview

A domain model consists of entities and associations that define an application's data layer. Mendix automatically manages the underlying database, eliminating manual table creation and query writing.

---

## Entities

An entity represents a class of real-world objects (customers, invoices, etc.). Instances of entities are called objects. Entities are defined by their properties, described using **attributes**, which store small pieces of information like names or dates.

### Entity Types

Mendix supports four entity types:

| Type | Description | Color |
|------|-------------|-------|
| **Persistable Entity** | Creates a database table | Blue |
| **Non-Persistable Entity** | Stored in runtime memory only, never committed to database | Orange |
| **External Entity** | Links to datasets from shared data sources in Mendix Catalog | Purple |
| **View Entity** | Read-only result sets from OQL queries | Green |

### Entity Properties

#### General Section

- **Name**: Unique within a module's domain model; used in forms, microflows, queries, and constraints
- **Export Level**: Controls access for add-on/solution modules (Hidden or Usable)
- **Generalization**: Enables inheritance - specialized entity inherits attributes, associations, events, and properties from its generalized entity
- **Image**: Associates a visual representation displayed in domain model
- **Persistable**: Defines whether instances can be stored in the database

#### System Members

Entities can optionally store automatic system information:

- **createdDate**: Records when objects were created
- **changedDate**: Records when objects were last committed
- **owner**: Association to the User entity that created the object
- **changedBy**: Association to the User entity that last modified the object

### Entity Dialog Tabs

- Attributes
- Associations
- Validation Rules
- Event Handlers
- Indexes
- Access Rules
- Documentation

---

## Attributes

Attributes are characteristics that describe and identify entities in Mendix.

### Attribute Types

| Type | Description | Notes |
|------|-------------|-------|
| **AutoNumber** | Automatically generated numbers | Default value determines first number |
| **Binary** | File or raw data storage | Only for persistable entities |
| **Boolean** | True or false values | |
| **Date and time** | Point in time accurate to milliseconds | |
| **Decimal** | High-precision calculations | Use for money amounts |
| **Enumeration** | List of predefined attributes | |
| **Hashed string** | Hashed using app settings algorithm | |
| **Integer** | Whole numbers | Max 2^31-1, Min -2^31 |
| **Long** | Whole numbers | Max 2^63-1, Min -2^63 |
| **String** | Text containing letters, spaces, numbers | |

### Attribute Properties

- **Name**: Identifies the attribute throughout the application
- **Export Level**: Hidden (default) or Usable
- **Localization** (Date and time): Converts to UTC before sending to server
- **String Length**: Limited (default 200) or Unlimited

### Stored vs Calculated Attributes

**Stored**: Value persists in the database with configurable default value

**Calculated**: Calculated via microflow each time object is retrieved
- Not stored in database
- Cannot be sorted on
- Uncommitted associated objects cannot be retrieved

### Attribute Limitations

- **Non-sortable**: Cannot be used in sort bars
- **Non-filterable**: Cannot be used in XPath constraints
- Hashed string: non-filterable
- Binary: non-sortable and non-filterable
- Calculated: non-sortable and non-filterable

---

## Associations

An association describes a relationship between entities in the domain model, represented by a line or arrow between two entities.

### Types of Associations

#### One-to-Many
"One customer is associated with many orders" - the owner (Order) stores the association reference. Created by default when drawing associations.

#### Many-to-Many with Default Ownership
Created by setting type property to `Reference set` with owner as `Default`. Association stored only in owning entity.

#### One-to-One
Created by setting owner property to `Both`. Both entities refer to each other.

#### Many-to-Many with Dual Ownership
Both entities are owners. Association stored in both entities, enabling bidirectional navigation.

### Multiplicity

Indicated by `1` or `*` at either side:
- `1` - One object
- `*` - Many objects

### Ownership

- **Single ownership**: Arrow points from owner to non-owner
- **Dual ownership**: No arrow (both entities own)
- Ownership allows dynamic relationship changes without rebuilding databases

### Key Constraints

- Associations between persistable and non-persistable entities must start from non-persistable entity
- External entities cannot own associations with local entities
- Reversing association direction results in data loss

---

## Creating Entities and Attributes

### Basic Process
1. Open your domain model
2. Drag an **Entity** from the Toolbox into the model
3. Name the entity (e.g., "Customer")
4. Double-click to add attributes
5. Specify attribute name and data type

### Adding Enumerations

1. Right-click module and select "Add other" > "Enumeration"
2. Name the enumeration (e.g., "OrderStatus")
3. Click "New" to add values (Open, Processing, Complete)
4. In entity, add enumeration attribute and select type
5. Set default value if needed

### Creating Associations

**Key Principle**: "Always start with the entity that can have more instances in the system"

Draw a line from one entity's border to another's to establish the relationship.

### Multiplicity Configuration

- **One-to-Many [1 - *]**: Default setting
- **One-to-One [1 - 1]**: Single instances connect
- **Many-to-Many [* - *]**: Multiple instances on both sides

---

## Delete Behavior Configuration

Control what happens when associated objects are deleted:

- **Cascading Delete**: "Delete 'Order' object(s) as well" - removes related objects automatically
- **Prevention of Delete**: "Delete 'Customer' object only if not associated with 'Order' object(s)" - prevents deletion and displays error

**Important**: Delete behavior applies to objects in memory, even before committed to database.

---

## Practical Example: Online Shopping Application

### Data Structure
- **Customer**: Name, address, email, date of birth
- **Product**: Name, description, price, vendor, availability
- **Order**: Status, order number, customer details
- **Order_Line**: Quantity and price per item
- **Order_Confirmation**: Confirmation details and purchase date

### Association Map
- Product_Image <-> Product: One-to-One
- Order <-> Customer: One-to-Many
- Product <-> Order_Line: One-to-Many
- Order <-> Order_Line: One-to-Many
- Order <-> Order_Confirmation: One-to-One

---

## Sources

- [Configuring a Domain Model](https://docs.mendix.com/refguide/configuring-a-domain-model/)
- [Entities](https://docs.mendix.com/refguide/entities/)
- [Attributes](https://docs.mendix.com/refguide/attributes/)
- [Associations](https://docs.mendix.com/refguide/associations/)
