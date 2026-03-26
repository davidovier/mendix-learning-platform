import { ChatInterface } from "@/components/tutor/chat-interface";

export default function TutorPage() {
  return (
    <div className="space-y-4">
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
