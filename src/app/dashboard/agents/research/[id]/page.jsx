"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Settings,
  Sliders,
  Terminal,
  FileText,
  Upload,
  Brain,
  Search,
  FileQuestion,
  Bot,
  User,
  Loader2,
  Building2,
  Download,
  Sheet,
  Check,
  ChevronRight,
  AlertCircle,
  Circle,
  TrendingUp,
  Target,
  Lightbulb,
  Briefcase,
  MessageCircle,
  Send,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkGfm from "remark-gfm";
import { CodeBlock, dracula } from "react-code-blocks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { Label } from "@radix-ui/react-dropdown-menu";
import { FileUpload } from "@/components/ui/file-upload";
const AgentPlayground = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const chatContainerRef = useRef(null);
  const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportContent, setReportContent] = useState(""); // For storing complete report for download
  const [files, setFiles] = useState([]);
  const [researchType, setResearchType] = useState("");
  const [googleDocLink, setGoogleDocLink] = useState("");

  const handleFileUpload = (files) => {
    setFiles(files);
    console.log(files);
  };
  // Welcome Message Effect
  useEffect(() => {
    if (!hasWelcomeMessage) {
      const welcomeMessage = {
        role: "assistant",
        content: "Hello! I'm your Agent assistant. Ask me anything!",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      setHasWelcomeMessage(true);
    }
  }, [hasWelcomeMessage]);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() && files.length === 0) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setApiError(null);
    setReportContent(""); // Reset before new research

    try {
      const formData = new FormData();
      formData.append("prompt", input);
      formData.append("researchType", researchType);
      formData.append("googleDocLink", googleDocLink);

      // Append files to the FormData object
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/research", {
        // Changed API endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `API request failed with status: ${response.status}`
        );
      }

      const data = await response.json(); // Parse the JSON here

      const assistantMessage = {
        role: "assistant",
        content: data.researchResults["Project Definition"], // Access Project Definition
        timestamp: new Date(),
        competitors: data.analysis.competitors,
        links: data.analysis.links,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setReportContent(data.researchResults["Project Definition"]); // Store for the report
    } catch (error) {
      console.error("Error:", error);
      setApiError("Failed to connect to the API or invalid response.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (message) => {
    return (
      <div>
        {typeof message.content === "object" ? (
          <div>Content is an object (details not shown for brevity)</div>
        ) : (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = (className || "").match(/language-(\w+)/);
                  return !inline && match ? (
                    <CodeBlock
                      text={String(children).replace(/\n$/, "")}
                      language={match[1]}
                      theme={dracula}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.competitors && message.competitors.length > 0 && (
          <div>
            <p className="font-medium mt-2">Competitors:</p>
            <ul>
              {message.competitors.map((competitor, index) => (
                <li key={index}>{competitor}</li>
              ))}
            </ul>
          </div>
        )}
        {message.links && message.links.length > 0 && (
          <div>
            <p className="font-medium mt-2">Links:</p>
            <ul>
              {message.links.map((link, index) => (
                <li key={index}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const generatePdfReport = () => {
    if (!reportContent) {
      alert("No report content available.");
      return;
    }

    setReportLoading(true);
    try {
      const doc = new jsPDF();
      doc.text("Agent Report", 10, 10);
      doc.setFontSize(10);

      // Split the content into manageable chunks
      const textLines = doc.splitTextToSize(
        reportContent,
        doc.internal.pageSize.getWidth() - 20
      ); // Adjust width as needed

      let y = 20; // Starting Y position
      textLines.forEach((line) => {
        if (y > doc.internal.pageSize.getHeight() - 10) {
          // Check for page overflow
          doc.addPage();
          y = 20; // Reset Y position on new page
        }
        doc.text(line, 10, y);
        y += 7; // Line height
      });

      doc.save("agent_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setReportLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat History */}
      <div className="w-68 border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat History
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-60px)]">
          <div className="p-2 space-y-2">
            {messages.map((msg, idx) => (
              <Card key={idx} className="p-3 hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-2">
                  {msg.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {typeof msg.content === "string"
                        ? msg.content.substring(0, 50) + "..."
                        : "Content is not a string"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div
          className="flex-1 p-4 overflow-auto"
          id="chat-container"
          ref={chatContainerRef}
        >
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{apiError}</AlertDescription>
                </Alert>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role !== "user" && (
                    <div className="mt-4">
                      <Bot className="w-6 h-6" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {renderMessageContent(msg)}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="mt-4">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="mt-4">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <Loader2 className="w-6 h-6 animate-spin" /> Generating
                    Report...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your Agent query..."
                rows={3}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading && !input.trim() && files.length == 0}
              className="self-end"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Settings */}
      <div className="w-80 border-l border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Agent Settings
          </h2>
        </div>
        <ScrollArea className="h-[calc(100vh-60px)] flex flex-col gap-2 px-2 py-2">
          <Select onValueChange={(value) => setResearchType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Research Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Research Type</SelectLabel>
                <SelectItem value="Market Research">Market Research</SelectItem>
                <SelectItem value="Deep Research">Deep Research</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-col gap-2 my-2">
            <Input
              type="link"
              placeholder="Google Doc"
              value={googleDocLink}
              onChange={(e) => setGoogleDocLink(e.target.value)}
            />
            <Button>Connect Sheet</Button>
          </div>
          <FileUpload onChange={handleFileUpload} />
          {reportContent && (
            <Button onClick={generatePdfReport} disabled={reportLoading}>
              {reportLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <File className="w-4 h-4" />
              )}
              Download Report
            </Button>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default AgentPlayground;