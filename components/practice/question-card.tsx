"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnswerOption } from "./answer-option";
import { CheckCircle, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  category: string;
  knowledgePath?: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (correct: boolean, questionId: string) => void;
  onNext: () => void;
  showExplanation?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
  showExplanation = true,
}: QuestionCardProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    onAnswer(selectedIndex === question.correctIndex, question.id);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setSubmitted(false);
    onNext();
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const correctAnswer = question.options[question.correctIndex];
  const selectedAnswer =
    selectedIndex !== null ? question.options[selectedIndex] : null;

  // Generate explanation for why the correct answer is right
  const generateCorrectExplanation = (): string => {
    const q = question.question.toLowerCase();
    const correct = correctAnswer.toLowerCase();
    const category = question.category;

    // Domain Model explanations
    if (category === "domain-model") {
      if (correct.includes("microflow")) {
        return "Microflows provide the flexibility to implement custom business logic and validation that goes beyond simple property settings. They allow you to programmatically control behavior based on complex conditions.";
      }
      if (correct.includes("association") || correct.includes("reference")) {
        return "Associations define relationships between entities. The correct association type ensures data integrity and enables proper navigation between related objects in your domain model.";
      }
      if (correct.includes("attribute")) {
        return "Attributes store the data values for each entity instance. Choosing the correct attribute type ensures proper data storage, validation, and display behavior.";
      }
      if (correct.includes("entity")) {
        return "Entities are the foundation of your data model. They represent real-world concepts and store related data together, making your app's data structure clear and maintainable.";
      }
    }

    // Microflows explanations
    if (category === "microflows") {
      if (correct.includes("retrieve") || correct.includes("database")) {
        return "Microflows execute on the server where they have direct access to the database. This makes them ideal for data retrieval, complex queries, and operations that need to work with multiple records.";
      }
      if (correct.includes("commit") || correct.includes("save")) {
        return "The Commit activity persists changes to the database. Without committing, changes exist only in memory and will be lost when the microflow ends or the session closes.";
      }
      if (correct.includes("exclusive split") || correct.includes("decision")) {
        return "Exclusive splits allow you to branch your logic based on conditions. Each path handles a specific scenario, making your microflow logic clear and maintainable.";
      }
      if (q.includes("validation") || correct.includes("range") || correct.includes("validation")) {
        return "Validation rules ensure data quality at the point of entry. Using appropriate constraints like ranges, regular expressions, or unique checks prevents invalid data from entering your system.";
      }
    }

    // Nanoflows explanations
    if (category === "nanoflows") {
      if (correct.includes("client") || correct.includes("browser") || correct.includes("device")) {
        return "Nanoflows run entirely on the client device, which means they execute instantly without server round-trips. This makes them perfect for offline scenarios and immediate UI feedback.";
      }
      if (correct.includes("offline")) {
        return "Nanoflows are the only flow type that works offline because they execute on the device itself. This is essential for mobile apps that need to function without internet connectivity.";
      }
    }

    // Security explanations
    if (category === "security") {
      if (correct.includes("access") || correct.includes("permission") || correct.includes("role")) {
        return "Mendix security is role-based. By configuring access rules at the entity, page, and microflow level, you ensure users can only see and modify data appropriate to their role.";
      }
      if (correct.includes("xpath") && (q.includes("security") || q.includes("access"))) {
        return "XPath constraints in entity access rules dynamically filter data based on the current user or context. This ensures users only see records they're authorized to access.";
      }
    }

    // Pages explanations
    if (category === "pages") {
      if (correct.includes("widget") || correct.includes("feedback")) {
        return "Mendix provides built-in widgets that handle common functionality out of the box. Using these widgets saves development time and ensures consistent behavior across your app.";
      }
      if (correct.includes("data view") || correct.includes("list view") || correct.includes("data container")) {
        return "Data containers establish the context for their child widgets. A data view shows a single object, while list views show collections. Widgets inside inherit this context automatically.";
      }
      if (correct.includes("template") || correct.includes("layout")) {
        return "Layouts and templates provide consistent structure across pages. They reduce duplication and make it easy to update common elements like navigation in one place.";
      }
    }

    // XPath explanations
    if (category === "xpath") {
      if (correct.includes("[") || correct.includes("constraint")) {
        return "XPath constraints filter data using conditions in square brackets. You can combine multiple constraints, traverse associations, and use functions to precisely select the data you need.";
      }
      if (correct.includes("/") || correct.includes("association")) {
        return "XPath uses forward slashes to traverse associations between entities. This allows you to filter or retrieve data based on related objects in your domain model.";
      }
    }

    // Modules explanations
    if (category === "modules") {
      if (correct.includes("account") || correct.includes("administration")) {
        return "Mendix includes built-in administration functionality. The Account_Overview page provides user management without requiring custom development, saving time and ensuring security best practices.";
      }
      if (correct.includes("marketplace") || correct.includes("app store")) {
        return "The Mendix Marketplace offers pre-built modules that you can add to your app. These modules are tested and maintained, reducing development time for common functionality.";
      }
    }

    // Integration explanations
    if (category === "integration") {
      if (correct.includes("rest") || correct.includes("api")) {
        return "REST services provide a standard way to exchange data with external systems. Mendix can both consume external REST APIs and publish its own services for others to use.";
      }
      if (correct.includes("mapping") || correct.includes("json") || correct.includes("xml")) {
        return "Import and export mappings transform data between external formats (JSON, XML) and your domain model. This decouples your internal structure from external API requirements.";
      }
    }

    // Events and validation
    if (category === "events" || category === "validation") {
      if (correct.includes("before") || correct.includes("after") || correct.includes("event")) {
        return "Event handlers allow you to execute logic automatically when objects are created, changed, committed, or deleted. This centralizes business rules and ensures consistent behavior.";
      }
    }

    // Default explanation based on category
    const categoryDefaults: Record<string, string> = {
      "domain-model": "This answer correctly addresses how Mendix handles data modeling. Understanding entity properties, associations, and constraints is fundamental to building robust applications.",
      "microflows": "This is the correct approach for server-side logic in Mendix. Microflows handle complex operations, database transactions, and integrations effectively.",
      "nanoflows": "This answer reflects how nanoflows work on the client side. Their instant execution and offline capability make them ideal for responsive user interactions.",
      "security": "This correctly implements Mendix's security model. Proper role-based access control protects sensitive data and functionality.",
      "pages": "This is the right approach for building user interfaces in Mendix. Proper widget configuration and data binding create intuitive user experiences.",
      "xpath": "This XPath syntax correctly queries the data you need. Understanding XPath is essential for filtering and retrieving data throughout your app.",
      "modules": "This leverages Mendix's modular architecture effectively. Modules organize functionality and enable reuse across projects.",
      "integration": "This correctly handles external system integration. Proper API design ensures reliable data exchange with other systems.",
      "java": "This correctly uses Java actions to extend Mendix capabilities. Java allows complex operations that aren't possible with standard activities.",
      "events": "This properly implements event-driven behavior. Events ensure business rules execute consistently across your application.",
      "enumerations": "This correctly uses enumerations for fixed value sets. Enumerations provide type safety and clear value options throughout your app.",
      "scheduled-events": "This properly configures scheduled execution. Scheduled events automate recurring tasks reliably.",
      "agile": "This follows Mendix development best practices. Proper version control and collaboration ensure smooth team development.",
    };

    return categoryDefaults[category] || "This answer correctly applies Mendix platform concepts and best practices for the given scenario.";
  };

  // Generate explanation for why the selected wrong answer is incorrect
  const generateIncorrectExplanation = (): string => {
    if (selectedAnswer === null || isCorrect) return "";

    const selected = selectedAnswer.toLowerCase();
    const correct = correctAnswer.toLowerCase();
    const category = question.category;

    // Common incorrect patterns
    if (selected.includes("not possible") || selected.includes("cannot")) {
      return "While this might seem like a limitation, Mendix often provides ways to achieve functionality that isn't immediately obvious. The platform offers multiple approaches to solve most problems.";
    }

    if (selected.includes("manually") || selected.includes("edit") && selected.includes("database")) {
      return "Directly manipulating the database bypasses Mendix's business logic, security rules, and validation. Always use Mendix tools to ensure data integrity and security.";
    }

    if (selected.includes("always") || selected.includes("automatically")) {
      return "Be careful with absolute statements. Mendix provides flexibility, and most features need to be explicitly configured rather than being automatic.";
    }

    // Category-specific incorrect explanations
    if (category === "microflows" && selected.includes("nanoflow")) {
      return "While nanoflows are powerful, they run on the client and have limitations. Server-side operations like database queries and external integrations require microflows.";
    }

    if (category === "nanoflows" && selected.includes("microflow")) {
      return "Microflows require a server connection and introduce latency. For instant client-side feedback or offline functionality, nanoflows are the appropriate choice.";
    }

    if (category === "security" && (selected.includes("everyone") || selected.includes("no restriction"))) {
      return "Unrestricted access creates security vulnerabilities. Always implement proper access controls based on user roles and data ownership.";
    }

    if (selected.includes("page") && correct.includes("microflow")) {
      return "While pages handle user interaction, the business logic you need here requires server-side processing that only microflows can provide.";
    }

    if (selected.includes("microflow") && correct.includes("page")) {
      return "This task is primarily about user interface presentation, which is handled through page configuration rather than microflow logic.";
    }

    // Default explanation
    return "This option doesn't fully address the requirements of the scenario. Consider what the question is specifically asking for and which Mendix feature best solves that exact problem.";
  };

  // Format category name for display
  const formatCategory = (cat: string): string => {
    return cat
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Question {questionNumber} of {totalQuestions}
          </Badge>
          <Badge>{formatCategory(question.category)}</Badge>
        </div>
        <h2 className="text-xl font-medium leading-relaxed">
          {question.question}
        </h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <AnswerOption
              key={index}
              index={index}
              text={option}
              selected={selectedIndex === index}
              correct={index === question.correctIndex}
              showResult={submitted}
              onClick={() => !submitted && setSelectedIndex(index)}
            />
          ))}
        </div>

        {submitted && showExplanation && (
          <div
            className={cn(
              "p-5 rounded-lg space-y-4 border",
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900"
                : "bg-muted/50 border-border"
            )}
          >
            {/* Result header */}
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Correct!
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-rose-500" />
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Incorrect
                  </span>
                </>
              )}
            </div>

            <div className="space-y-4 text-sm">
              {/* Why the correct answer is correct */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">
                      {correctAnswer}
                    </p>
                    <p className="text-muted-foreground">
                      {generateCorrectExplanation()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Why the selected wrong answer is wrong */}
              {!isCorrect && selectedAnswer && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground mb-1">
                        Why not "{selectedAnswer}"?
                      </p>
                      <p className="text-muted-foreground">
                        {generateIncorrectExplanation()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Study reference */}
              {question.knowledgePath && (
                <div className="flex items-start gap-2 pt-2 border-t border-border">
                  <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium">Learn more:</span>{" "}
                    {question.knowledgePath}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={selectedIndex === null}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>Next Question</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
