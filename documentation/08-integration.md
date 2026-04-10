# Integration Documentation

## Overview

Mendix supports multiple integration approaches for connecting applications and sharing data.

"Integration with other applications can be done using REST, OData, GraphQL, SOAP/Web Services, or Business Events."

---

## Key Integration Methods

### REST Services

REST services enable API-based communication between applications.

#### Consumed REST Services

Call external REST APIs from your Mendix application.

**Key Features**:
- Import OpenAPI/Swagger contracts to auto-generate service definitions
- Use "Call REST Service" action in microflows
- HttpRequest and HttpResponse System Entities handle communication

#### Published REST Services

Expose your application's functionality as REST endpoints.

**Creating REST Resources**:
- Right-click entity in domain model: "Expose as REST resource"
- Right-click in editor: "Publish as REST service operation"

**Authentication Methods**:

| Method | Description |
|--------|-------------|
| Basic & Active Session | Default when security is Prototype/demo or Production |
| No Authentication | For specific services |
| Anonymous User | When enabled app-wide |
| Custom Microflow | JWT, API keys, etc. |

**Note**: "Web service users cannot access REST services."

**Auto-Generated Documentation**:
- Accessible at `http://yourapp.com/rest-doc/`
- Features interactive Swagger UI
- Available in OpenAPI 3.0 and 2.0 formats

**Monitoring**:
Set log level of REST Publish log node to Trace for detailed logging.

---

### OData Services

OData provides a standardized protocol for data access and manipulation.

#### Consumed OData Services
Integrate data from external OData providers.

#### Published OData/GraphQL Services
Share your data through OData or GraphQL (experimental).

OData services are viewable and manageable through Mendix Connect Catalog.

---

### Web Services (SOAP)

Traditional SOAP-based web services for legacy system integration.

- Consume and publish web services
- Comprehensive XML schema handling

---

### Additional Capabilities

- **Business Event Services**: Event-driven architecture
- **Data Import/Export**: XML and JSON
- **Machine Learning Model Integration**: ML model calls
- **External Database Connectivity**: Downloadable connectors

---

## Mendix Connect Integration

Data integration features are part of "Mendix Connect, a collection of functionalities that allows people in your organization to discover, understand, connect, and govern data securely."

The Catalog component enables registration, management, and governance of data assets.

---

## Call REST Service Activity

The primary microflow action for REST integration.

### Configuration

1. Open microflow where you need REST call
2. Add "Call REST Service" activity
3. Configure:
   - URL/endpoint
   - HTTP method
   - Headers
   - Request body
   - Response handling

### Request/Response Handling

- Use HttpRequest system entity for outgoing requests
- Use HttpResponse system entity for incoming responses
- Parse JSON/XML responses into domain model objects

---

## Import and Export Mappings (Exam Critical)

Mappings transform data between external formats (JSON/XML) and Mendix domain model objects.

### Import Mappings

Convert incoming JSON/XML data into Mendix objects.

| Property | Description |
|----------|-------------|
| **Source** | JSON structure, XML schema, or message definition |
| **Entity** | Target Mendix entity to create/update |
| **Attribute mapping** | How source fields map to entity attributes |
| **Object handling** | Create new, Find by key, or Custom microflow |

**Object Handling Options**:

| Option | Description |
|--------|-------------|
| **Create object** | Always create new objects |
| **Find by key** | Find existing object or create new |
| **Call a microflow** | Custom logic for object handling |

### Export Mappings

Convert Mendix objects into JSON/XML for external systems.

| Property | Description |
|----------|-------------|
| **Source entity** | Mendix entity to export |
| **Target format** | JSON or XML schema |
| **Attribute mapping** | Which attributes to include |
| **Association handling** | How to export related objects |

### Using Mappings in Microflows

| Activity | Mapping Type | Purpose |
|----------|--------------|---------|
| **Import with mapping** | Import mapping | JSON/XML → Mendix objects |
| **Export with mapping** | Export mapping | Mendix objects → JSON/XML |
| **Call REST service** | Both | Automatic request/response mapping |

### Key Points for Exam

1. Import mappings are used to **consume** external data
2. Export mappings are used to **publish** data to external systems
3. Mappings can be reused across multiple integration points
4. **Find by key** prevents duplicate object creation

---

## Best Practices

### Security

1. Use SSL for all consumed web services
2. Implement proper authentication
3. Validate input at system boundaries
4. Apply IP restrictions for sensitive endpoints

### Error Handling

1. Handle HTTP error codes appropriately
2. Log integration failures
3. Implement retry logic for transient failures
4. Use timeouts to prevent hanging connections

### Performance

1. Cache responses when appropriate
2. Use pagination for large datasets
3. Minimize number of API calls
4. Consider asynchronous processing for long-running operations

---

## Sources

- [Integration](https://docs.mendix.com/refguide/integration/)
- [Consumed REST Services](https://docs.mendix.com/refguide/consumed-rest-services/)
- [Published REST Services](https://docs.mendix.com/refguide/published-rest-services/)
