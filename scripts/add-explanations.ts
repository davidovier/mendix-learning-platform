/**
 * Script to add explanations to questions.json
 * Run with: npx tsx scripts/add-explanations.ts
 */

import * as fs from "fs";
import * as path from "path";

interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// Load questions
const questionsPath = path.join(__dirname, "../lib/content/questions.json");
const questions: Question[] = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

// Category-specific explanation templates and knowledge
const categoryKnowledge: Record<string, Record<string, string>> = {
  microflows: {
    "sub-microflow": "Sub-microflows in Mendix have the same capabilities as regular microflows. They are used to organize logic into reusable components, improving code maintainability without sacrificing functionality.",
    "maintainability": "Sub-microflows help organize complex logic into smaller, reusable pieces. This makes your application easier to understand, test, and maintain over time.",
    "annotations": "Annotations in Mendix microflows allow developers to add notes and documentation directly in the flow, making it easier for others to understand the logic.",
    "rule": "Rules in Mendix have a smaller selection of activities compared to microflows. They are designed for simple boolean logic and validation purposes.",
    "token": "Tokens in Mendix microflows are system-generated values like [%CurrentDateTime%] or [%CurrentUser%] that provide runtime information.",
    "function": "In microflow expressions, functions like toUpperCase() are built-in operations that transform or process values.",
    "variable": "Variables in microflows are prefixed with $ (e.g., $Customer) and represent objects or values that can be used throughout the flow.",
    "breakpoint": "Breakpoint conditions in Mendix allow you to debug specific scenarios by specifying when the debugger should pause, without affecting other users.",
    "loop": "The iterator in a Mendix loop represents the current object being processed from the list. It changes with each iteration of the loop.",
    "break": "A break event in Mendix loops allows you to exit the loop early when a certain condition is met, instead of processing all items.",
    "aggregate": "Aggregate list functions in Mendix provide efficient ways to calculate totals, counts, averages, and other statistics on lists without manual iteration.",
    "batch": "Batches in Mendix are used for processing large amounts of data efficiently by breaking the work into smaller chunks to manage memory and performance.",
    "equals": "The list equals operation in Mendix returns a Boolean value, indicating whether two lists contain the same objects.",
    "default": "This is the correct answer based on Mendix best practices and documentation."
  },
  "domain-model": {
    "limit": "In Mendix, you can limit an entity to only one object by implementing validation logic in a microflow that checks for existing objects before creating new ones.",
    "generalization": "Generalization in Mendix allows entities to inherit attributes and associations from a parent entity, enabling polymorphism and code reuse.",
    "association": "Associations in Mendix define relationships between entities. The owner of an association determines which entity stores the reference.",
    "delete": "Delete behavior in Mendix controls what happens to associated objects when the parent object is deleted, preventing orphaned data.",
    "default": "This is based on Mendix domain model concepts and best practices."
  },
  security: {
    "anonymous": "Anonymous users in Mendix allow access to specific parts of your application without requiring authentication, such as login pages or public content.",
    "user role": "User roles in Mendix define what users can see and do in your application. Each role has specific module roles and access rights.",
    "module role": "Module roles provide granular security control within a module, defining access to pages, microflows, and entities.",
    "access rule": "Access rules in Mendix define which attributes and associations a user role can read or write for a specific entity.",
    "default": "This is based on Mendix security model best practices."
  },
  pages: {
    "feedback": "The Feedback widget in Mendix provides a built-in, easy way for users to submit feedback directly from your application without custom development.",
    "widget": "Widgets in Mendix are reusable UI components that can be configured and placed on pages to provide specific functionality.",
    "data view": "A Data View in Mendix displays and allows editing of a single object, providing a container for input widgets and object-related actions.",
    "list view": "List Views in Mendix display collections of objects and support dynamic content through iterator widgets.",
    "dynamic image": "The Dynamic Image widget in Mendix displays images that are stored as FileDocument entities or their specializations.",
    "default": "This is based on Mendix page building best practices."
  },
  modules: {
    "account": "Mendix provides built-in Account_Overview pages in the Administration module for managing user accounts without custom development.",
    "exclude": "Excluding a document from a Mendix project removes it from deployment without deleting it, allowing you to test changes safely.",
    "scheduled": "Scheduled events in Mendix allow microflows to run automatically at specified times, ideal for batch processing or periodic tasks.",
    "structure": "Mendix apps should be structured with logical folders for pages, microflows, domain models, and resources to maintain organization.",
    "resources": "The Resources folder in Mendix modules is used for storing enumerations, regular expressions, constants, and other reusable configurations.",
    "default": "This is based on Mendix module organization best practices."
  },
  xpath: {
    "constraint": "XPath constraints in Mendix filter data by specifying conditions that objects must meet. They start with [ and contain attribute comparisons.",
    "auto-complete": "Ctrl + Space opens the XPath auto-complete menu in Mendix Studio Pro, helping you write correct path expressions.",
    "token": "XPath tokens like [%CurrentUser%] are replaced with actual values at runtime, enabling dynamic filtering based on context.",
    "association": "XPath can traverse associations using the path syntax (e.g., Module.Entity_Association/Module.RelatedEntity) to filter on related objects.",
    "empty": "In XPath, you can check for empty values using '= empty' for attributes that have no value assigned.",
    "default": "XPath in Mendix provides powerful query capabilities for filtering and retrieving data based on complex conditions."
  },
  integration: {
    "rest": "REST services in Mendix can be consumed and published, enabling integration with external systems using standard HTTP methods.",
    "mapping": "Import and export mappings in Mendix transform data between external formats (XML, JSON) and your domain model.",
    "odata": "OData in Mendix allows you to expose your data as a standardized feed that can be consumed by external applications.",
    "default": "This is based on Mendix integration best practices."
  },
  nanoflows: {
    "client": "Nanoflows execute on the client (browser/device) and are ideal for offline functionality and responsive user interactions.",
    "offline": "Nanoflows support offline applications because they run locally without requiring server communication.",
    "default": "Nanoflows in Mendix run on the client side, making them faster for simple operations but with limited server access."
  },
  events: {
    "commit": "Before/after commit events in Mendix trigger when objects are saved, allowing you to add validation or automated actions.",
    "validation": "Event handlers in Mendix can be used to implement complex validation logic that goes beyond simple attribute constraints.",
    "default": "Events in Mendix allow you to trigger logic automatically based on object lifecycle changes."
  },
  enumerations: {
    "enum": "Enumerations in Mendix define a fixed set of values that an attribute can have, ensuring data consistency.",
    "constant": "Constants in Mendix store values that can be configured per environment, useful for URLs, keys, and settings.",
    "default": "Enumerations and constants help maintain data consistency and configurability in Mendix applications."
  },
  "scheduled-events": {
    "schedule": "Scheduled events in Mendix run microflows at specified intervals, useful for batch processing and automated tasks.",
    "default": "Scheduled events enable automated, time-based execution of business logic in Mendix."
  },
  agile: {
    "sprint": "Sprint planning is performed at the beginning of each sprint to select and commit to user stories for the iteration.",
    "daily": "The daily scrum (standup) is where team members share progress, plans, and blockers to maintain transparency.",
    "story points": "Story points indicate the relative difficulty or effort required to complete a user story, not time estimates.",
    "default": "This is based on Agile/Scrum methodology as applied in Mendix development."
  }
};

// Generate explanation for a question
function generateExplanation(question: Question): string {
  const correctAnswer = question.options[question.correctIndex];
  const category = question.category.toLowerCase();
  const questionLower = question.question.toLowerCase();

  // Try to find a relevant knowledge snippet
  const knowledge = categoryKnowledge[category] || {};

  // Check for keyword matches in the question or answer
  for (const [keyword, explanation] of Object.entries(knowledge)) {
    if (keyword === "default") continue;
    if (
      questionLower.includes(keyword) ||
      correctAnswer.toLowerCase().includes(keyword)
    ) {
      return explanation;
    }
  }

  // Generate a generic but helpful explanation
  const categoryName = category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  // Create explanation based on the correct answer
  return `The correct answer is "${correctAnswer}" because this aligns with Mendix ${categoryName} best practices and documentation. This concept is important for the Intermediate Certification exam.`;
}

// Add explanations to all questions
let updated = 0;
for (const question of questions) {
  if (!question.explanation) {
    question.explanation = generateExplanation(question);
    updated++;
  }
}

// Save updated questions
fs.writeFileSync(questionsPath, JSON.stringify(questions, null, 2));
console.log(`Added explanations to ${updated} questions.`);
console.log(`Total questions: ${questions.length}`);
