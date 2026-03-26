import { ChatInterface } from "@/components/tutor/chat-interface";

export default function TutorPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div>
        <h1 className="text-3xl font-bold">AI Tutor</h1>
        <p className="text-muted-foreground">
          Your personal Mendix certification study assistant
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
