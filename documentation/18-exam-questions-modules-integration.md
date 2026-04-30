# Modules & Data Integration - Exam Questions & Key Insights

## Part 1: Modules

---

### 1. Module Basics

#### Exam Question:
> "How many modules does an app have when you build it?"

**Answer**: 3: Administration (accounts), System (what makes app run: users, files, sessions), and MyFirstModule

#### Exam Question:
> "Why does Mendix use modules?"

**Answer**: To be able to reuse them in other projects

#### Exam Question:
> "When do you create a new module?"

**Answer**: It is up to you to choose logical modules for your application

---

### 2. Module Naming

#### Exam Question:
> "What is the recommended naming convention for Modules in Mendix?"

**Answer**: UpperCamelCase

---

### 3. Structuring Modules

#### Exam Question:
> "What is the correct way of structuring resources within the App Explorer?"

**Answer**: Manually

#### Exam Question:
> "When structuring the App Explorer, which subfolder would be best to store Enumerations and Regular Expressions?"

**Answer**: Resources

#### Exam Question:
> "Which principle needs to be utilized to reduce duplication of already created elements?"

**Answer**: DRY (Don't Repeat Yourself)

---

### 4. Marketplace Modules

#### Exam Question:
> "Why shouldn't you make changes to Marketplace modules?"

**Answer**: Updating to a new version of the module erases your changes

#### Exam Question:
> "What is best practice if you want to customize a page from a downloaded Marketplace module?"

**Answer**: Copy the contents to another module in your app and use that module instead

#### Exam Question:
> "Where can you download File Dropper widget for your app?"

**Answer**: Marketplace

---

### 5. Module Versioning

#### Exam Question:
> "When can you add version numbers to your module?"

**Answer**: After enabling an add-on module, in the module settings

---

### 6. Excluding/Including

#### Exam Question:
> "You've replaced a microflow with newer functionality and want to test it without deleting the old one. How?"

**Answer**: Exclude it from the project

---

### 7. Constants

#### Exam Question:
> "What are constants?"

**Answer**: Constants are used to define configuration values that can differ per environment, allowing you to change service location without redeploying

---

### 8. Module Export Formats (CRITICAL)

#### Exam Question:
> "What is the difference between .mpk and .mxmodule export formats?"

**Answer**: .mpk contains full source code (editable), .mxmodule is protected/compiled (read-only)

#### Exam Question:
> "Which export format should you use for Marketplace distribution?"

**Answer**: .mxmodule (Add-on module)

---

### 9. Export Protection Levels (CRITICAL)

#### Exam Question:
> "What are the export protection levels for add-on modules?"

**Answer**: Hidden (not visible to consumers) and Usable (can use but not view/modify)

#### Exam Question:
> "What is the default export level for documents in add-on modules?"

**Answer**: Hidden

---

### 10. Java Folder Structure

#### Exam Question:
> "Where are custom Java action implementations stored?"

**Answer**: javasource/[modulename]/actions/

#### Exam Question:
> "Which folder should you NEVER manually edit?"

**Answer**: javasource/[modulename]/proxies/ (auto-generated)

#### Exam Question:
> "Where do external JAR libraries go?"

**Answer**: userlib folder

---

## Part 2: Data Integration & Exchange

---

### 8. Excel Import/Export

#### Exam Question:
> "What does your app need to import Excel data into a Mendix app?"

**Answer**: The Excel Importer module from the Marketplace

#### Exam Question:
> "What are the 2 ways to export data with Excel?"

**Answer**: Use the excel button in a data grid OR use the Excel Exporter module

#### Exam Question:
> "What are the limitations of the export to excel button in a data grid?"

**Answer**: Only possible to export data accessible to the data grid, can't manipulate data, only works on XPath data source data grid

#### Exam Question:
> "You want to manipulate your data as you import it. What method would be best?"

**Answer**: Excel Importer module

#### Exam Question:
> "When transforming, why should you import large datasets into a flat structure first?"

**Answer**: To not overrun available memory

---

### 9. Mx Model Reflection

#### Exam Question:
> "What does the Mx Model Reflection module do?"

**Answer**: It shows the configuration of your domain model in the client

---

### 10. JSON & REST

#### Exam Question:
> "What is JSON and what does it stand for?"

**Answer**: JavaScript Object Notation, a lightweight format for storing and transporting data

#### Exam Question:
> "What does a JSON structure document do?"

**Answer**: It stores a JSON snippet and converts it into a schema structure that can be used in Import/Export mappings to convert JSON into Mendix objects

#### Exam Question:
> "What are JSON structures converted to in Mendix?"

**Answer**: Objects

#### Exam Question:
> "How do you add downloaded JSON structure to your app?"

**Answer**: Right-click on folder or module, add other, and select JSON structure

#### Exam Question:
> "How do you get REST data using a microflow?"

**Answer**: Use a Call REST Service action

#### Exam Question:
> "What are HTTP headers?"

**Answer**: HTTP headers are used to pass meta-data in REST calls

---

### 11. Import/Export Mappings

#### Exam Question:
> "What do you use to interpret XML or JSON into Mendix objects?"

**Answer**: Import mappings (Import/Export data)

#### Exam Question:
> "What are export mappings used to accomplish?"

**Answer**: Converting Mendix objects to XML or JSON

#### Exam Question:
> "What are import mappings?"

**Answer**: Import mappings define how incoming XML or JSON is converted into Mendix objects according to a specific XML schema or JSON structure

#### Exam Question:
> "What is the most appropriate prefix for Import Mapping name?"

**Answer**: ImM_

---

### 12. External Entities & Data Hub

#### Exam Question:
> "What is a piece of data from Data Hub called?"

**Answer**: External Entity

#### Exam Question:
> "What is an external entity?"

**Answer**: An entity that is connected to a dataset in Data Hub

#### Exam Question:
> "Where can published data be found?"

**Answer**: Data Hub Catalog

#### Exam Question:
> "Where can you edit the properties of an External Entity?"

**Answer**: In the domain model of the app where the External Entity is defined

#### Exam Question:
> "What would you use to save changes to an external entity?"

**Answer**: A Send external object activity

#### Exam Question:
> "Can you modify data in an External Entity?"

**Answer**: Yes, if the Updatable(write) property of its public resource settings is checked

---

### 13. OData

#### Exam Question:
> "Why is the version number assigned to OData service important?"

**Answer**: There can be multiple versions of a service and users can connect to a specific one using it

#### Exam Question:
> "What source type is used within Microsoft Excel to connect to a dataset in Data Hub?"

**Answer**: OData Feed

---

### 14. Data Hub Landscape

#### Exam Question:
> "How do you get the Data Hub Landscape?"

**Answer**: Clicking the Landscape tab

#### Exam Question:
> "An app connected by a grey dotted line to your service in the Data Hub Landscape means what?"

**Answer**: The app is consuming data from your service

#### Exam Question:
> "An app connected by a grey solid line to your service in the Data Hub Landscape means what?"

**Answer**: The app is providing data to your service

---

### 15. Regular Data Import

#### Exam Question:
> "If you need to import data regularly, what is the best way to do so?"

**Answer**: Services such as SOAP, REST, and OData

#### Exam Question:
> "What are some alternative methods for importing files into a Mendix app?"

**Answer**: Flat files, CSV, Excel

---

### 16. Export Hidden Columns

#### Exam Question:
> "How can you export columns in a data grid without showing them to the user?"

**Answer**: By setting the class on the column to display: none

---

### 17. CRUD

#### Exam Question:
> "What does the D in CRUD stand for?"

**Answer**: Delete

---

## Quick Reference: Integration Options

| Method | Best For |
|--------|----------|
| Excel Importer | One-time imports, data manipulation |
| Data Grid Export | Quick exports, simple data |
| Excel Exporter | Complex exports, formatting |
| REST Services | Regular data exchange, APIs |
| OData | Sharing data between apps |
| External Entities | Real-time data from other apps |

---

## Practice Questions

1. You need to import customer data from Excel and transform names to uppercase. Best approach?
   **Answer: Excel Importer module (allows manipulation)**

2. Other apps need to access your Product data in real-time. Best approach?
   **Answer: Publish as OData service**

3. You want to consume an external REST API in a microflow. Which activity?
   **Answer: Call REST Service**

4. Grey dotted line in Data Hub Landscape means?
   **Answer: App is consuming data from your service**

5. What converts JSON response to Mendix objects?
   **Answer: Import mapping**
