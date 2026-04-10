# Agile, Version Control, Translation & UX/UI - Exam Questions

## Part 1: Agile & Scrum

---

### Scrum Values

#### Exam Question:
> "What are the five values of Scrum?"

**Answer**: Focus, Courage, Openness, Commitment & Respect

#### Exam Question:
> "Which of the following is one of the Scrum values?"

**Answer**: Openness

---

### Scrum Team

#### Exam Question:
> "Scrum Team consists of:"

**Answer**: Scrum Master, Product Owner & Dev Team

---

### Scrum Events

#### Exam Question:
> "Name 4 Scrum events"

**Answer**: Planning, Retrospective, Review, and Daily Scrum/Daily Standup

#### Exam Question:
> "Which event is performed at the beginning of the sprint?"

**Answer**: Sprint planning

#### Exam Question:
> "During which Sprint Event does the team determine user stories for the sprint?"

**Answer**: Sprint Planning

---

### Daily Scrum

#### Exam Question:
> "What happens in the daily scrum?"

**Answer**: Team members share their progress, plans, and issues

#### Exam Question:
> "How long does the daily scrum meeting usually take?"

**Answer**: 15 minutes

#### Exam Question:
> "Who is responsible for the daily stand-up?"

**Answer**: Scrum Master

---

### Sprint Review

#### Exam Question:
> "Who should be participating in the review meeting?"

**Answer**: PO, Scrum Master, Developers & Management

---

### Product Backlog

#### Exam Question:
> "What is the purpose of a product backlog meeting?"

**Answer**: Adding detail, estimation and structure to the Product Backlog

#### Exam Question:
> "Which approach needs to be used to sort items in the product backlog?"

**Answer**: Based on the descending priority (highest priority at top)

---

### Story Points

#### Exam Question:
> "What do Story Points associated with a user story indicate?"

**Answer**: The difficulty of the user story

---

### Burndown Chart

#### Exam Question:
> "What is a burndown chart?"

**Answer**: A list of items planned versus items done

---

### Other Agile Terms

#### Exam Question:
> "What does SME mean?"

**Answer**: Subject Matter Expert

#### Exam Question:
> "What is an offshore model?"

**Answer**: A model based on collaboration between multiple time zones

---

## Part 2: Version Control

---

### Branches

#### Exam Question:
> "Why do we use branches?"

**Answer**: This allows you to continue development of functionality without affecting the running app

#### Exam Question:
> "Why do you separate hot fixes from the development of new functionality?"

**Answer**: Because you don't want to push hotfixes together with features that haven't been completed yet

---

### Tagged Version

#### Exam Question:
> "What is a tagged version?"

**Answer**: A revision that has been used to build a Mx deployment package

---

### Merging

#### Exam Question:
> "Which function is used to merge a complete branch into the mainline and is only available on the main line?"

**Answer**: Merge feature branch

#### Exam Question:
> "Which option can be used to merge revisions into and from all lines (main line or branch line)?"

**Answer**: Advanced merge

---

### Conflicts

#### Exam Question:
> "What type of conflict occurs when you and your colleague both modified the microflow implementing delete behavior?"

**Answer**: Modify-Modify

---

### Data Snapshots

#### Exam Question:
> "When working with version control, which concept would you use to share your database with your team?"

**Answer**: By creating a data snapshot and adding it to the deployment directory of your app

---

## Part 3: Translation

---

### Languages

#### Exam Question:
> "Which languages are supported in Mendix Applications?"

**Answer**: Languages from ISO 639

#### Exam Question:
> "Which one is the correct language format for American English?"

**Answer**: en-US

---

### Default Language

#### Exam Question:
> "What does default project language define?"

**Answer**: The language which users will see when using your app

#### Exam Question:
> "When and how does a default language need to be selected?"

**Answer**: Manually at the moment of app creation

---

### Development Language

#### Exam Question:
> "Where can you choose the development language?"

**Answer**: In the toolbar of Studio Pro

---

### Batch Translation

#### Exam Question:
> "Which functionality do you use to show a complete list of all translatable texts of source and destination language?"

**Answer**: Batch translation

#### Exam Question:
> "How many source and destination languages can you specify?"

**Answer**: One source, many destinations

---

### Missing Translations

#### Exam Question:
> "You have 2 languages (English default and Russian). You create a text field without Russian translation. What happens?"

**Answer**: Text field displays the text in English (falls back to default)

---

### Fixing Translations

#### Exam Question:
> "Your app has 2 languages and some French translation is incorrect. What should you do?"

**Answer**: All of the above (Use batch translate, Export/Import Excel, Use batch replace)

---

## Part 4: UX/UI & Styling

---

### Research Methods

#### Exam Question:
> "What is the most suitable technique if you want an overview of what a user feels and experiences?"

**Answer**: Empathy Map

#### Exam Question:
> "What is the main aim of using Customer Value Curve?"

**Answer**: To find out what shortcomings there are in the general market that you can improve on

#### Exam Question:
> "What qualitative technique focuses on how users group different items?"

**Answer**: Card Sorting

#### Exam Question:
> "Which are considered qualitative research methods?"

**Answer**: Competitor Analysis, Card Sorting, Expert Review

---

### Wireframes & Prototypes

#### Exam Question:
> "What should you always do in your wireframe?"

**Answer**: Add annotations

#### Exam Question:
> "What is the purpose of a prototype? It should be a representation of..."

**Answer**: Your application to test with

#### Exam Question:
> "What type of prototype can you do on paper?"

**Answer**: Low fidelity

---

### Styling & CSS

#### Exam Question:
> "A client wants their application to have a very specific color scheme. Who's work is most likely affected?"

**Answer**: The UX/UIer

#### Exam Question:
> "You want to use different styling for different parts of the app. What is the best setting?"

**Answer**: Show styling for: App and all modules

#### Exam Question:
> "What is the Styling Editor used for?"

**Answer**: Styling and JavaScript actions

#### Exam Question:
> "What part of CSS syntax references the object that is to be styled?"

**Answer**: Selector

---

### SASS

#### Exam Question:
> "What is the correct naming convention for Sass partials?"

**Answer**: _partial-name.scss

#### Exam Question:
> "In the Atlas framework, under which folder should you add partials?"

**Answer**: Web

#### Exam Question:
> "Where should $variables be kept according to best practices?"

**Answer**: In any partial with the name variable

#### Exam Question:
> "How should you change the font size of H1 headers?"

**Answer**: By changing the variable in custom-variable.scss

---

### CSS Inspector

#### Exam Question:
> "You notice a property in the inspector has been crossed through. What does this mean?"

**Answer**: The property has been overwritten

---

## Part 5: App Directory

---

### Folder Structure

#### Exam Question:
> "Which folders contain source information tied to a specific module?"

**Answer**: Javascriptsource and Javasource folders

#### Exam Question:
> "The VerifyPassword.java file in the System module is stored in which JavaSource sub-folder?"

**Answer**: Actions

#### Exam Question:
> "The Microflows.java file is stored in which sub-folder of JavaSource directory?"

**Answer**: Proxies

#### Exam Question:
> "Which sources are typically stored in the Resources folder?"

**Answer**: Configuration files, HTML and Java files

#### Exam Question:
> "Files and folders that form the styling of your application are typically stored in which folder?"

**Answer**: Theme

#### Exam Question:
> "Where does Mendix store your Java libraries?"

**Answer**: userlib

#### Exam Question:
> "What is in the deployment folder?"

**Answer**: Deployment files needed to run locally

#### Exam Question:
> "Where are enumerations located in the app directory?"

**Answer**: Proxies

---

### Userlib Best Practice

#### Exam Question:
> "What is a best practice for your userlib?"

**Answer**: Clean up manually after deleting a module

---

## Quick Reference Tables

### Scrum Events
| Event | Purpose | Duration |
|-------|---------|----------|
| Sprint Planning | Determine sprint work | ~4 hours |
| Daily Scrum | Share progress, plans, issues | 15 minutes |
| Sprint Review | Demo to stakeholders | ~2 hours |
| Sprint Retrospective | Team improvement | ~1.5 hours |

### App Directory Structure
| Folder | Contains |
|--------|----------|
| javasource | Java actions, proxies |
| javascriptsource | JavaScript actions |
| userlib | Java libraries |
| resources | Config files, HTML, Java |
| theme | Styling files |
| deployment | Local run files |

### Version Control Actions
| Action | Use Case |
|--------|----------|
| Merge feature branch | Complete branch to mainline |
| Advanced merge | Any merge direction |
| Port fix | Hotfix to multiple branches |
| Create branch | New feature isolation |
