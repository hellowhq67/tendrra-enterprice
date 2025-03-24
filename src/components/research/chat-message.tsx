// ChatMessage.tsx
"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react"; // Added useRef
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, User, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
    message?: {
        id: string;
        role: "user" | "assistant" | "system" | "data";  // Include all possible roles
        content: string;
    };
    isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const isUser = message?.role === "user";
    const isAssistant = message?.role === "assistant";

    useEffect(() => {
        console.log("ChatMessage received message:", message); // Debug: Log the entire message object

        if (message?.content && typeof message.content === 'string' && !isLoading && isAssistant) {
            let i = 0;
            setDisplayedText(""); // Reset to an empty string before typing
            const typingEffect = setInterval(() => {
                if (i < message.content.length) {
                    setDisplayedText((prev) => prev + message.content[i]);
                    i++;
                } else {
                    clearInterval(typingEffect);
                }
            }, 20);

            return () => clearInterval(typingEffect);
        } else if (message?.content && typeof message.content === 'string') {
            setDisplayedText(message.content);
        } else {
            // Handle cases where message.content is null, undefined, or not a string
            console.warn("ChatMessage: message.content is not a valid string:", message?.content);
            setDisplayedText(""); // Or set a default message
        }
    }, [message?.content, isLoading, isAssistant]);

    const handleCopy = () => {
        if (message?.content) {
            navigator.clipboard.writeText(message.content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (!message || (!isUser && !isAssistant && message.role !== "system" && message.role !== "data")) {
        return null;
    }

    return (
        <motion.div
            className={cn("flex w-full py-2 items-start gap-2", isUser ? "justify-end" : "justify-start")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {isAssistant && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                </div>
            )}
            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                    <User className="h-4 w-4" />
                </div>
            )}
            <div className="flex flex-col max-w-[80%]">
                <div
                    className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-100",
                    )}
                >
                    <ReactMarkdown>{displayedText || ""}</ReactMarkdown> {/* Ensure ReactMarkdown receives a string */}
                </div>
                {isAssistant && (
                    <div className="flex justify-end mt-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            onClick={handleCopy}
                        >
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                )}
            </div>

        </motion.div>
    );
};

export default ChatMessage;