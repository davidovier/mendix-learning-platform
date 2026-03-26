export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  sourceFile: string;
  questionFiles: string[];
}

export const topics: Topic[] = [
  {
    id: "domain-model",
    name: "Domain Model",
    description: "Entities, attributes, associations, delete behavior",
    icon: "🗃️",
    sourceFile: "01-domain-model.md",
    questionFiles: ["13-exam-questions-domain-model.md"],
  },
  {
    id: "microflows",
    name: "Microflows",
    description: "Server-side logic, activities, decisions, loops",
    icon: "⚙️",
    sourceFile: "02-microflows.md",
    questionFiles: ["14-exam-questions-microflows.md"],
  },
  {
    id: "nanoflows",
    name: "Nanoflows",
    description: "Client-side logic, offline functionality",
    icon: "📱",
    sourceFile: "03-nanoflows.md",
    questionFiles: [],
  },
  {
    id: "modules",
    name: "Modules",
    description: "Module organization and structure",
    icon: "📦",
    sourceFile: "04-modules.md",
    questionFiles: ["18-exam-questions-modules-integration.md"],
  },
  {
    id: "security",
    name: "Security",
    description: "User roles, access rules, module security",
    icon: "🔐",
    sourceFile: "05-security.md",
    questionFiles: ["15-exam-questions-security.md"],
  },
  {
    id: "pages",
    name: "Pages & Widgets",
    description: "Data views, grids, layouts, widgets",
    icon: "📄",
    sourceFile: "06-pages-and-widgets.md",
    questionFiles: ["17-exam-questions-pages.md"],
  },
  {
    id: "xpath",
    name: "XPath & Expressions",
    description: "Query syntax, operators, functions",
    icon: "🔍",
    sourceFile: "07-expressions-and-xpath.md",
    questionFiles: ["16-exam-questions-xpath.md"],
  },
  {
    id: "integration",
    name: "Integration",
    description: "REST, OData, Web Services",
    icon: "🔗",
    sourceFile: "08-integration.md",
    questionFiles: ["18-exam-questions-modules-integration.md"],
  },
  {
    id: "java",
    name: "Java Extensions",
    description: "Custom Java actions",
    icon: "☕",
    sourceFile: "09-extending-with-java.md",
    questionFiles: [],
  },
  {
    id: "events",
    name: "Events & Validation",
    description: "Event handlers, validation rules",
    icon: "⚡",
    sourceFile: "10-events-and-validation.md",
    questionFiles: [],
  },
  {
    id: "enumerations",
    name: "Enumerations & Constants",
    description: "Enums and constant values",
    icon: "📋",
    sourceFile: "11-enumerations-and-constants.md",
    questionFiles: [],
  },
  {
    id: "scheduled-events",
    name: "Scheduled Events",
    description: "Automated processing",
    icon: "🕐",
    sourceFile: "12-scheduled-events.md",
    questionFiles: [],
  },
  {
    id: "agile",
    name: "Agile & Misc",
    description: "Scrum, version control, collaboration",
    icon: "🔄",
    sourceFile: "",
    questionFiles: ["19-exam-questions-agile-misc.md"],
  },
];

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}
