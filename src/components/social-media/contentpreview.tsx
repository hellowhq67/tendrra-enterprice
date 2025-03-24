import React from "react";
import { Button } from "@/components/ui/button"; // Assuming you have shadcn/ui button
import { useChat } from "ai/react";

interface ContentPreviewProps {
    toolCallId: string;
    content: string;
    platform: string;
    actions: { label: string; value: string; }[];
    topic: string; // Add topic
    tone: string;   // Add tone
    length: string; // Add length
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
    toolCallId,
    content,
    platform,
    actions,
    topic,    // Use topic
    tone,      // Use tone
    length,   // Use length
}) => {
    const { append } = useChat();

    const handleAction = (actionValue: string) => {
        console.log(`Action ${actionValue} clicked for toolCallId: ${toolCallId}`);

        // Create a user message based on the action
        let userMessage = "";
        switch (actionValue) {
            case "edit":
                userMessage = `I want to edit the ${platform} post about ${topic} with a ${tone} tone and ${length} length.`;
                break;
            case "schedule":
                userMessage = `I want to schedule the ${platform} post.`;
                break;
            case "generate_image":
                userMessage = `Generate an image for this ${platform} post about ${topic}.`;
                break;
            default:
                userMessage = `I want to proceed with action: ${actionValue}`; // Fallback
        }

        append({ role: "user", content: userMessage });
    };

    return (
        <div key={toolCallId} className="mt-2">
            <p>GEN TOOL</p>
            <p className="text-sm font-bold">Generated {platform} Post:</p>
            <div className="p-2 border rounded-md bg-gray-100 dark:bg-zinc-700">
                {content}
            </div>
            <div className="flex justify-end mt-2 space-x-2">
                {actions.map((action) => (
                    <Button key={action.value} variant="outline" size="sm" onClick={() => handleAction(action.value)}>
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default ContentPreview;