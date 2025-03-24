"use client";
import { motion } from "framer-motion";
import type { Message as AI_Message, ToolCall } from "ai";
import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PaperclipIcon,
  SendIcon,
  MonitorStopIcon as StopIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
  BarChartIcon,
  CalendarIcon,
  HashIcon as HashtagIcon,
  FileTextIcon,
  ImageIcon,
  ClockIcon,
  AlertCircle,
  Bot,
  Loader2,
  HashIcon,
} from "lucide-react";
import { MarkdownPreview } from "@/components/social-media/markdown-preview";
import { Markdown } from "@/components/social-media/markdown";
import { SocialMediaAccounts } from "@/components/social-media/accounts";
import { ScheduledPosts } from "@/components/social-media/scheduled-posts";
import { ImageGenerator } from "@/components/social-media/image-generator";
import { SchedulePost } from "@/components/social-media/schedule-post";
import ReactMarkdown from "react-markdown";
import { v4 } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { el } from "date-fns/locale";
import { ConnectedAccounts } from "@/components/account/connected-accounts";

import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { format } from "path";
import { AppSidebar } from "@/components/Dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import ContentPreview from "@/components/social-media/contentpreview";
// Define TypeScript interfaces for better type safety
interface UIAccount {
  platform: string;
  username: string;
}
interface ImagePreviewProps {
  imageUrl: string;
  prompt: string;
  platform: string;
  style: string;
  actions: { label: string; value: string }[];
  toolCallId: string;
  handleAction: (actionValue: string) => void;
}
interface UIPost {
  platform: string;
  scheduledTime: string;
  content: string;
}

type ToolInvocation = {
  toolName: string;
  toolCallId: string;
  state: string;
  result: {
    state?: string;
    platform?: string;
    ui?: any;
  };
};

interface GeneratePostResult {
  content: string;
  platform: "linkedin" | "twitter" | "instagram";
  topic: string;
  tone: "professional" | "casual" | "humorous" | "inspirational";
  length: "short" | "medium" | "long";
  ui: GeneratePostUI;
}

interface GeneratePostUI {
  type: "content_preview"; //  Likely more types later, so use a discriminated union
  content: string; //Redundant but important to match current use
  platform: "linkedin" | "twitter" | "instagram"; //Redundant but important to match current use
  actions: GeneratePostAction[];
}

interface GeneratePostAction {
  label: string; // e.g., "Edit", "Schedule", "Generate Image"
  value: string; // e.g., "edit", "schedule", "generate_image"
}

interface AnalyzeContentResult {
  metrics: any;
  sentiment: string;
  recommendations: string[];
  platform: string;
  ui: {
    type: string;
    metrics: any;
    sentiment: string;
    recommendations: string[];
    platform: string;
    actions: { label: string; value: string }[];
  };
}

interface SuggestHashtagsResult {
  hashtags: string[];
  trending: string[];
  platform: string;
  content: string;
  ui: {
    type: string;
    hashtags: string[];
    trending: string[];
    platform: string;
    actions: { label: string; value: string }[];
  };
}

interface GenerateImageResult {
  imageUrl: string;
  prompt: string;
  platform: string;
  style: string;
  aspectRatio: string;
  ui: {
    type: string;
    imageUrl: string;
    prompt: string;
    platform: string;
    style: string;
    actions: { label: string; value: string }[];
  };
}

interface ScheduleConfirmationProps {
  content: string;
  platform: string;
  scheduledTime: string;
  hasImage: boolean;
  actions: { label: string; value: string }[];
  status?: "scheduled" | "pending";
  message?: string; // Optional message for after scheduling
}

interface ConnectAccountResult {
  platform: string;
  username?: string;
  ui: {
    type: string;
    platform: string;
    message: string;
    fields?: {
      name: string;
      label: string;
      type: string;
      required: boolean;
      value: string;
    }[];
    actions: { label: string; value: string }[];
  };
}

interface ContentCalendarResult {
  calendar: any[];
  platform: string;
  totalDays: number;
  topics: string[];
  ui: {
    type: string;
    calendar: any[];
    platform: string;
    actions: { label: string; value: string }[];
  };
}

interface FeedbackResult {
  question: string;
  ui: {
    type: string;
    question: string;
    actions: { label: string; value: string }[];
  };
}

interface ConfirmationResult {
  message: string;
  actionToConfirm: string;
  ui: {
    type: string;
    message: string;
    actions: { label: string; value: string }[];
  };
}

interface Props {
  messages: Array<
    AI_Message & {
      toolInvocations?: Array<ToolCall<string, any>>;
    }
  >;
  onUserAction: (action: string, data?: any) => void;
}

interface SocialMediaAIPageProps {} // add props if needed

// Define the type for the activeTab state
type ActiveTab = "chat" | "preview" | "images" | "accounts" | "scheduled";
interface ScheduleConfirmationProps {
  content: string;
  platform: string;
  scheduledTime: string;
  hasImage: boolean;
  actions: { label: string; value: string }[];
  status?: "scheduled" | "pending";
  message?: string; // Optional message for after scheduling
}

const ScheduleConfirmation: React.FC<ScheduleConfirmationProps> = ({
  content,
  platform,
  scheduledTime,
  hasImage,
  actions,
  status,
  message,
}) => {
  // Format the ISO date

  return (
    <div className="mt-4 p-4 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Schedule Confirmation</h3>
      {message && <div className="text-green-500 mb-2">{message}</div>}
      <p className="text-sm text-gray-600">
        Platform: <span className="font-medium">{platform}</span>
      </p>
      <p className="text-sm text-gray-600">
        Scheduled Time: <span className="font-medium"></span>
      </p>
      {hasImage && (
        <p className="text-sm text-gray-600">
          Image: <span className="font-medium">Included</span>
        </p>
      )}
      <p className="text-sm text-gray-600">
        Content Preview:
        <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm">{content}</div>
      </p>

      <div className="mt-4 flex justify-end space-x-2">
        {actions.map((action) => (
          <Button
            key={action.value}
            variant="outline"
            onClick={() => {
              // Implement your action handling logic here
              // e.g., dispatch an event or call a function
              console.log(`Action triggered: ${action.value}`);
            }}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
const suggestedActions = [
  {
    title: "Generate LinkedIn post",
    label: "about digital marketing trends",
    action:
      "Generate a professional LinkedIn post about the latest digital marketing trends",
    icon: <LinkedinIcon className="h-4 w-4" />,
  },
  {
    label: "on AI in business",
    action:
      "Create a Twitter thread about how AI is transforming business operations",
    icon: <TwitterIcon className="h-4 w-4" />,
  },
  {
    title: "Suggest hashtags",
    label: "for my Instagram post",
    action:
      "Suggest relevant hashtags for my Instagram post about sustainable fashion",
    icon: <HashtagIcon className="h-4 w-4" />,
  },
  {
    title: "Generate image",
    label: "for product announcement",
    action:
      "Generate an image for a LinkedIn post announcing our new software product",
    icon: <ImageIcon className="h-4 w-4" />,
  },
  {
    title: "Create content calendar",
    label: "for the next week",
    action:
      "Generate a content calendar for Twitter covering product updates, industry news, and customer testimonials for the next 7 days",
    icon: <CalendarIcon className="h-4 w-4" />,
  },
  {
    title: "Schedule post",
    label: "for tomorrow morning",
    action:
      "I want to schedule a post for tomorrow morning on LinkedIn about our company's recent award",
    icon: <ClockIcon className="h-4 w-4" />,
  },
];
export default function SocialMediaAIPage({}: SocialMediaAIPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [isToolRunning, setIsToolRunning] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [accounts, setAccounts] = useState<UIAccount[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<UIPost[]>([]);
  const [generatedImage, setGeneratedImage] = useState<any | null>(null);
  const [generatedcontent, setGeneratedContent] = useState({});
  const id = v4();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authorizationCode, setAuthorizationCode] = useState<string>(""); // Initialize with empty string, can be populated from other source
  const [tokenFetching, setTokenFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = (action: string, data?: any) => {
    append({
      role: "user",
      content: `Action: ${action}`,
    });
  };
  const handleLinkedInConnect = async () => {
    await signIn("linkedin", {
      callbackUrl: "/",
    });
  };
  const { data: session } = useSession();

  const isLinkedInConnected = !!session?.user?.linkedinAccessToken;

  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    append,
    stop,
    handleSubmit,
  } = useChat({
    api: "/api/ai/social-media",
    headers: {
      Authorization: "your_token",
    },
    body: {
      id: id,
    },
    maxSteps: 10,
    credentials: "same-origin",

    onFinish: (message) => {
      console.log("Chat finished:", message);
      setIsToolRunning(false);
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsToolRunning(true);
    handleSubmit(e);
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollable = chatContainerRef.current;
      // Wait for the DOM to update before scrolling
      requestAnimationFrame(() => {
        scrollable.scrollTo({
          top: scrollable.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [messages]);

  // Extract content from the last message for preview
  const getContentForPreview = () => {
    if (messages.length === 0) return "";

    const lastAssistantMessage = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    return lastAssistantMessage?.content || "";
  };

  // Handle account connected

  // Handle post scheduled
  const handlePostScheduled = (postData: any) => {
    const post: UIPost = {
      platform: postData.platform,
      scheduledTime: postData.scheduledTime,
      content: postData.content,
    };
    setScheduledPosts((prev) => [post, ...prev]);
    setActiveTab("chat");
    append({
      role: "user",
      content: `I've scheduled a post on ${post.platform} for ${new Date(
        post.scheduledTime
      ).toLocaleString()}`,
    });
  };

  const handelsu = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
       <SidebarProvider>
          <AppSidebar className="border-r border-sidebar-border" />
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
                      <BreadcrumbPage className="text-[#9ca3af]">Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="h-[calc(100vh-2rem)]">
            <CardHeader className="pb-2">
              <CardTitle>Social Media AI Assistant</CardTitle>
              <CardDescription>
                Generate content, analyze posts, and get insights for your
                social media strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100vh-15rem)] flex flex-col">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as ActiveTab)}
                className="w-full"
              >
                <div className="w-full border-gray-400">
                  <TabsList className="w-full flex p-2 z-[9999] rounded-md outlin bg-sidebar text-muted-foreground text-md ">
                    <TabsTrigger value="chat" className="flex-1">
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex-1">
                      Content Preview
                    </TabsTrigger>
                    <TabsTrigger value="images" className="flex-1">
                      Images
                    </TabsTrigger>
                    <TabsTrigger value="accounts" className="flex-1">
                      Accounts
                    </TabsTrigger>
                    <TabsTrigger value="scheduled" className="flex-1">
                      Scheduled
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent
                  value="chat"
                  className="flex-1 flex flex-col relative"
                >
                  <div className="flex flex-col h-[60vh]">
                    <ScrollArea ref={scrollToBottom} className="flex-1">
                      <div className="space-y-4">
                        {messages.length === 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                            {suggestedActions.map((action, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 * index }}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full h-auto flex flex-col items-start p-4 gap-1 text-left"
                                  onClick={() =>
                                    append({
                                      role: "user",
                                      content: action.action,
                                    })
                                  }
                                >
                                  <div className="flex items-center gap-2 font-medium">
                                    {action.icon}
                                    <span>{action.title}</span>
                                  </div>
                                  <span className="text-muted-foreground text-sm">
                                    {action.label}
                                  </span>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <Card className={`w-fit `}>
                              <CardContent className="p-3">
                                <Markdown>{message.content}</Markdown>
                                {message.toolInvocations?.map(
                                  (toolInvocation) => {
                                    const { toolName, toolCallId, state } =
                                      toolInvocation;

                                    if (state === "result") {
                                      if (toolName === "generatePost") {
                                        const { result } = toolInvocation;

                                        if (
                                          result &&
                                          result.ui &&
                                          result.ui.type === "content_preview"
                                        ) {
                                          const { content, platform, actions } =
                                            result.ui;
                                          return (
                                            <div
                                              key={toolCallId}
                                              className="mt-2"
                                            >
                                              <p className="text-sm font-bold">
                                                Generated {platform} Post:
                                              </p>
                                              <div className="p-2 bg-muted rounded-md mt-1">
                                                {content}
                                              </div>
                                              <div className="flex justify-end mt-2 space-x-2">
                                                {actions.map((action: any) => (
                                                  <Button
                                                    key={action.value}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleAction(action.value)
                                                    }
                                                  >
                                                    {action.label}
                                                  </Button>
                                                ))}
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (toolName === "generateImage") {
                                        const { result } = toolInvocation;

                                        if (
                                          result &&
                                          result.ui &&
                                          result.ui.type === "image_preview"
                                        ) {
                                          const {
                                            imageUrl,
                                            prompt,
                                            platform,
                                            style,
                                            actions,
                                          } = result.ui;
                                          return (
                                            <div
                                              key={toolCallId}
                                              className="mt-2"
                                            >
                                              <p className="text-sm font-bold">
                                                Generated {platform} Image:
                                              </p>
                                              <div className="mt-1">
                                                {imageUrl ? (
                                                  <div className="relative w-full">
                                                    <img
                                                      src={
                                                        imageUrl ||
                                                        "/placeholder.svg"
                                                      }
                                                      alt={prompt}
                                                      className="rounded-md object-contain max-h-48 w-full"
                                                    />
                                                  </div>
                                                ) : (
                                                  <p>Loading image...</p>
                                                )}

                                                <div className="mt-2 text-sm">
                                                  <p>Prompt: {prompt}</p>
                                                  <p>Style: {style}</p>
                                                </div>

                                                <div className="flex justify-end mt-2 space-x-2">
                                                  {actions.map(
                                                    (action: any) => (
                                                      <Button
                                                        key={action.value}
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                          handleAction(
                                                            action.value
                                                          )
                                                        }
                                                      >
                                                        {action.label}
                                                      </Button>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (
                                        toolName === "analyzeContent"
                                      ) {
                                        const { result } = toolInvocation;
                                        if (
                                          result &&
                                          result.ui &&
                                          result.ui.type === "content_analysis"
                                        ) {
                                          const {
                                            metrics,
                                            sentiment,
                                            recommendations,
                                            platform,
                                            actions,
                                          } = result.ui;
                                          return (
                                            <div
                                              key={toolCallId}
                                              className="mt-2"
                                            >
                                              <p className="text-sm font-bold">
                                                Content Analysis:
                                              </p>
                                              <div className="p-2 bg-muted rounded-md mt-1">
                                                <p>Platform: {platform}</p>
                                                <p>Sentiment: {sentiment}</p>
                                                <div className="mt-1">
                                                  <p className="font-semibold">
                                                    Metrics:
                                                  </p>
                                                  <ul className="list-disc pl-5 text-sm">
                                                    {Object.entries(
                                                      metrics
                                                    ).map(([key, value]) => (
                                                      <li key={key}>{key}:</li>
                                                    ))}
                                                  </ul>
                                                </div>
                                                {recommendations.length > 0 && (
                                                  <div className="mt-1">
                                                    <p className="font-semibold">
                                                      Recommendations:
                                                    </p>
                                                    <ul className="list-disc pl-5 text-sm">
                                                      {recommendations.map(
                                                        (
                                                          rec: string,
                                                          i: number
                                                        ) => (
                                                          <li key={i}>{rec}</li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex justify-end mt-2 space-x-2">
                                                {actions.map((action: any) => (
                                                  <Button
                                                    key={action.value}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleAction(action.value)
                                                    }
                                                  >
                                                    {action.label}
                                                  </Button>
                                                ))}
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (
                                        toolName === "suggestHashtags"
                                      ) {
                                        const { result } = toolInvocation;
                                        if (
                                          result &&
                                          result.ui &&
                                          result.ui.type ===
                                            "hashtag_suggestions"
                                        ) {
                                          const {
                                            hashtags,
                                            trending,
                                            platform,
                                            actions,
                                          } = result.ui;
                                          return (
                                            <div
                                              key={toolCallId}
                                              className="mt-2"
                                            >
                                              <p className="text-sm font-bold">
                                                Suggested Hashtags for{" "}
                                                {platform}:
                                              </p>
                                              <div className="p-2 bg-muted rounded-md mt-1">
                                                <div className="flex flex-wrap gap-2">
                                                  {hashtags.map(
                                                    (
                                                      tag: string,
                                                      i: number
                                                    ) => (
                                                      <span
                                                        key={i}
                                                        className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                                                      >
                                                        {tag}
                                                      </span>
                                                    )
                                                  )}
                                                </div>
                                                {trending.length > 0 && (
                                                  <div className="mt-2">
                                                    <p className="text-sm font-semibold">
                                                      Trending:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                      {trending.map(
                                                        (
                                                          tag: string,
                                                          i: number
                                                        ) => (
                                                          <span
                                                            key={i}
                                                            className="px-2 py-1 bg-primary/20 rounded-full text-sm"
                                                          >
                                                            {tag}
                                                          </span>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="flex justify-end mt-2 space-x-2">
                                                {actions.map((action: any) => (
                                                  <Button
                                                    key={action.value}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleAction(action.value)
                                                    }
                                                  >
                                                    {action.label}
                                                  </Button>
                                                ))}
                                              </div>
                                            </div>
                                          );
                                        }
                                      } else if (toolName === "schedulePost") {
                                        const { result } = toolInvocation;
                                        if (
                                          result &&
                                          result.ui &&
                                          result.ui.type ===
                                            "schedule_confirmation"
                                        ) {
                                          return (
                                            <ScheduleConfirmation
                                              content={result.ui.content}
                                              platform={result.ui.platform}
                                              scheduledTime={
                                                result.ui.scheduledTime
                                              }
                                              hasImage={result.ui.hasImage}
                                              actions={result.ui.actions}
                                              status={result.ui.status}
                                              message={result.ui.message}
                                            />
                                          );
                                        }
                                      }
                                    }
                                    return null;
                                  }
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        ))}

                        {isLoading && (
                          <div className="flex w-full py-2 justify-start">
                            <div className="">
                              <img
                                src="https://www.tendrra.com/_next/static/media/logo.2f21e9ad.png"
                                alt=""
                                width={50}
                                height={50}
                              />
                            </div>
                            <Card className="">
                              <CardContent className="p-3 flex items-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Thinking...
                              </CardContent>
                            </Card>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <form
                      onSubmit={handleFormSubmit}
                      className="mt-4 fixed bottom-10 w-[50vw] flex-1 "
                    >
                      <div className="relavtive ">
                        <Textarea
                          ref={textareaRef}
                          value={input}
                          onChange={handleInputChange}
                          placeholder="Send a message..."
                          className="pr-24 resize-none border rounded-md shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500 bg-zinc-900 border-zinc-700 text-zinc-100"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              if (!isToolRunning) {
                                setIsToolRunning(true);
                                handleSubmit(e as any);
                              }
                            }
                          }}
                          disabled={isToolRunning}
                        />

                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                        />

                        <div className="absolute right-2 bottom-2 flex gap-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={handelsu}
                            disabled={isToolRunning}
                          >
                            <PaperclipIcon className="h-4 w-4" />
                          </Button>

                          {isLoading || isToolRunning ? (
                            <Button
                              type="button"
                              size="icon"
                              onClick={stop}
                              disabled={!isLoading}
                            >
                              <StopIcon className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              size="icon"
                              disabled={input.trim() === "" || isToolRunning}
                            >
                              <SendIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </TabsContent>
                <TabsContent value="preview"></TabsContent>
                <TabsContent value="images">
                  <ImageGenerator onGenerateImage={generatedImage} />
                </TabsContent>

                <TabsContent value="scheduled">
                  <div className="flex flex-col h-full">
                    {/* Schedule Post Component */}
                    <SchedulePost onPostScheduled={handlePostScheduled} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </ScrollArea>
        </div>

        <div className="hidden lg:block">
          <Card className="h-[calc(100vh-2rem)]  overflow-y-scroll">
            <CardHeader>
              <CardTitle>Social Media Dashboard</CardTitle>
              <CardDescription>
                Overview of your social media activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Connected Accounts</h3>
                  <button
                    onClick={handleLinkedInConnect}
                    className="bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Connect LinkedIn
                  </button>
                  <div className="space-y-6">
                    <div></div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Upcoming Posts</h3>
                <div className="space-y-3">
                  {scheduledPosts.length > 0 ? (
                    scheduledPosts.slice(0, 2).map((post, index) => (
                      <div key={index} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {post.platform === "linkedin" && (
                              <LinkedinIcon className="h-4 w-4 text-blue-600" />
                            )}
                            {post.platform === "twitter" && (
                              <TwitterIcon className="h-4 w-4 text-sky-500" />
                            )}
                            {post.platform === "instagram" && (
                              <InstagramIcon className="h-4 w-4 text-pink-600" />
                            )}
                            <span className="text-sm font-medium">
                              {post.platform.charAt(0).toUpperCase() +
                                post.platform.slice(1)}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.scheduledTime).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <LinkedinIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">
                              LinkedIn
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Tomorrow, 9:00 AM
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          Our latest blog post on digital marketing trends is
                          now live! Check it out to stay ahead of the curve.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TwitterIcon className="h-4 w-4 text-sky-500" />
                            <span className="text-sm font-medium">Twitter</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Today, 5:00 PM
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2">
                          Just launched our new feature! RT if you're excited to
                          try it out. #ProductLaunch #Innovation
                        </p>
                      </div>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setActiveTab("scheduled")}
                  >
                    View All Scheduled Posts
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      setActiveTab("chat");
                      append({
                        role: "user",
                        content:
                          "Generate a LinkedIn post about our company culture",
                      });
                    }}
                  >
                    <FileTextIcon className="h-4 w-4" />
                    Create Post
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      setActiveTab("images");
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Generate Image
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      setActiveTab("chat");
                      append({
                        role: "user",
                        content:
                          "Analyze my recent Twitter posts for engagement",
                      });
                    }}
                  >
                    <BarChartIcon className="h-4 w-4" />
                    Analyze Content
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      setActiveTab("chat");
                      append({
                        role: "user",
                        content:
                          "Create a content calendar for the next two weeks",
                      });
                    }}
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Content Calendar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
          </SidebarInset>
        </SidebarProvider>

  );
}
