"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Search,
  Send,
  Settings,
  Bot,
  User,
  AlertCircle,
  File as FileIcon,
  Loader2,
  Paperclip,
  Copy,
  Check,
  Hammer,
} from "lucide-react";

// Import the server action
import { Attachment, ChatRequestOptions, CreateMessage , ToolInvocation  } from "ai";
import Image from "next/image";

import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import { randomUUID, UUID } from "crypto";
import { motion } from "framer-motion";
import { AppSidebar } from "@/components/ui/researchsidebar";
import { useToast } from "@/hooks/use-toast"
import { v4 } from "uuid";

interface ChatMessageProps {
  message: CreateMessage;
}

const UserAvatar = () => (
  <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center">
    <User className="h-5 w-5" />
  </div>
);

const BotAvatar = () => (
  <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center p-2">
    <Bot className="h-5 w-5" />
  </div>
);

interface ChatMessageProps {
    message: CreateMessage;
    toolInvocations?: ToolInvocation[]; // Make toolInvocations optional
  }

const ChatMessage: React.FC<ChatMessageProps> = ({ message, toolInvocations }) => {
  const isUser = message.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard.",
      });
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy message to clipboard.",
      });
    }
  };

  return (
    <motion.div
      className={cn(
        "flex w-full py-2 items-start group relative",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      {/* Avatar */}
      {!isUser && <BotAvatar />}
      {isUser && <UserAvatar />}

      <div
        className={cn(
          "ml-2 rounded-xl p-4 text-sm shadow relative",
          isUser
            ? "bg-zinc-500 text-white "
            : "bg-zinc-800 text-gray-100"
        )}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>

        {/* Tool Invocations Display */}
        {toolInvocations && (
          <div className="mt-2">
            {toolInvocations.map((toolInvocation) => (
              <div key={toolInvocation.toolCallId} className="flex items-center gap-2 p-2 bg-zinc-700 rounded-md mt-1">
                <Hammer className="h-4 w-4 text-blue-400" />
                <span>
                  Tool: <strong>{toolInvocation.toolName}</strong>, Status:{" "}
                  <strong>{toolInvocation.state}</strong>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Copy Button */}
        {showCopyButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 p-1 opacity-70 hover:opacity-100 transition-opacity"
            onClick={handleCopyClick}
            disabled={isCopied}
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

interface ChatMessageItem extends CreateMessage {
  timestamp: number;
  toolInvocations?: ToolInvocation[]; // Added toolInvocations to the item type
}

interface AttachmentFile extends File {
  filename?: string; // Make filename optional since it's not a standard File property
}

export default function Page({
    params,
  }: {
    params: Promise<{ slug: string }>
  }) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState(""); // For storing complete report for download
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [researchType, setResearchType] = useState("");
  const [googleDocLink, setGoogleDocLink] = useState("");
const id = params;
  // Modified useChat to include toolInvocations in the message
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } =
    useChat({
      api: "/api/research",
      headers: {
        Authorization: "your_token",
      },
      body: {
        id:id,
        attachments: attachments,
      },
      maxSteps: 5,
      credentials: "same-origin",
      
      onFinish: (message) => {
        console.log("Chat finished:", message);
      }

    });

  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null); // State for file error message
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo");
  const [open, setOpen] = useState(false);



  // Scroll to bottom on new messages, with animation
  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollable = chatContainerRef.current;
      // Wait for the DOM to update before scrolling
      requestAnimationFrame(() => {
        scrollable.scrollTo({
          top: scrollable.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  }, [messages]);

  const uid =
    // Welcome Mess age
    useEffect(() => { }, [messages, hasWelcomeMessage, append]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmitWrapper = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Include attachments in the request
    e.preventDefault(); // Prevent the default form submission
    handleSubmit(e as any); // Cast the event type
    setAttachments([]);
  };

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-sidebar-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-white" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-white" href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#9ca3af]">
                    Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col h-[100vh] bg-black p-2 md:p-20 lg:p-20">
          <ScrollArea ref={chatContainerRef} className=" flex-1 bg-red ">
            {/* Welcome Message */}
            {apiError && (
              <div className="text-red-500 p-2 bg-red-100 rounded-md">
                <AlertCircle className="inline-block mr-1" />
                Error: {apiError}
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} toolInvocations={message.toolInvocations} />
            ))}
            {isLoading && (
              <div className="flex w-full py-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="rounded-xl px-4 py-2 text-sm shadow bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-100 flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="fixed bottom-0  left-0 md:left-[30%] lg:left-[30%] p-4  to-transparent w-[100vw] md:w-[60vw] lg:w-[60vw]">
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message here..."
                  className="resize-none pr-24 pl-10 py-3 min-h-[60px] bg-black bg-opacity-50 backdrop-blur-md border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 rounded-md pointer-events-none"></div>
              </div>
              <Button
                onClick={handleFileUpload}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-transparent hover:bg-gray-700"
                variant="ghost"
                size="icon"
              >
                <Paperclip className="h-4 w-4 text-gray-300" />
              </Button>
              <Button
                onClick={handleSubmit}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white hover:bg-blue-600"
                size="icon"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                // Handle file upload logic here
                console.log(e.target.files);
              }}
            />
          </div>
          {/* Message Input */}
        </div>
      </SidebarInset>
      {/* Right Sidebar - Settings */}
    </SidebarProvider>
  );
}