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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface BusinessLead {
    title: string;
    address: string;
    website: string;
    phoneNumber: string;
    email: string;
}

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    isStreaming?: boolean;
    type?: "conversational" | "lead_gen";
    leads?: BusinessLead[];
}

export default function StudioPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [temperature, setTemperature] = useState([0.7]);
    const [maxTokens, setMaxTokens] = useState([2048]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [customPrompt, setCustomPrompt] = useState("");
    const [streamedText, setStreamedText] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [hasWelcomeMessage, setHasWelcomeMessage] = useState(false);
    const [sheetUrl, setSheetUrl] = useState("");
    const [sheetLoading, setSheetLoading] = useState(false);


    // Welcome Message Effect
    useEffect(() => {
        if (!hasWelcomeMessage) {
            const welcomeMessage: Message = {
                role: "assistant",
                content: "Hello! I'm your assistant. I can help with general inquiries or finding business information. How can I help you today?",
                timestamp: new Date(),
                type: 'conversational'
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
    }, [messages, streamedText]);

    const simulateStreaming = async (text: string) => {
        const words = text.split(' ');
        let currentText = '';

        for (let word of words) {
            currentText += word + ' ';
            setStreamedText(currentText);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
        }
        return currentText.trim();
    };

    const handleSubmit = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setStreamedText("");

        try {
            // Add temporary streaming message
            const streamingMessage: Message = {
                role: "assistant",
                content: "",
                timestamp: new Date(),
                isStreaming: true,
            };

            setMessages((prev) => [...prev, streamingMessage]);

            // Simulate API call
            const response = await fetch("/api/v1/agents/lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: input }),
            });

            const data = await response.json();

            if (data.type === "lead_gen" && Array.isArray(data.data)) {
                // Handle lead generation response
                const leadsContent = data.data
                    .map(
                        (lead: BusinessLead) =>
                            `🏢 ${lead.title}\n` +
                            `📍 ${lead.address}\n` +
                            `🌐 ${lead.website}\n` +
                            `📞 ${lead.phoneNumber}\n` +
                            `📧 ${lead.email}\n`
                    )
                    .join("\n");

                // Replace streaming message with lead gen results
                setMessages((prev) =>
                    prev.map((msg, index) => {
                        if (index === prev.length - 1) {
                            return {
                                role: "assistant",
                                content: leadsContent,
                                timestamp: new Date(),
                                type: "lead_gen",
                                leads: data.data,
                                isStreaming: false,
                            };
                        }
                        return msg;
                    })
                );
            } else {
                // Handle conversational response
                const streamedResponse = await simulateStreaming(data.response);

                setMessages(prev => prev.map((msg, index) => {
                    if (index === prev.length - 1) {
                        return {
                            role: "assistant",
                            content: streamedResponse,
                            timestamp: new Date(),
                            type: "conversational",
                            isStreaming: false
                        };
                    }
                    return msg;
                }));
            }
        } catch (error) {
            console.error("Error:", error);
            // Handle error gracefully
            setMessages((prev) =>
                prev.map((msg, index) => {
                    if (index === prev.length - 1) {
                        return {
                            role: "assistant",
                            content:
                                "I apologize, but I encountered an error processing your request. Please try again.",
                            timestamp: new Date(),
                            isStreaming: false,
                        };
                    }
                    return msg;
                })
            );
        } finally {
            setLoading(false);
            setStreamedText("");
        }
    };

    const getMessageIcon = (role: string, type?: string, isStreaming?: boolean) => {
        if (role === "user") {
            return <User className="w-6 h-6 text-primary" />;
        }
        if (isStreaming) {
            return <Loader2 className="w-6 h-6 text-primary animate-spin" />;
        }
        if (type === "lead_gen") {
            return <Building2 className="w-6 h-6 text-primary" />;
        }
        return <Bot className="w-6 h-6 text-primary" />;
    };

    const renderMessageContent = (message: Message) => {
        if (message.isStreaming) {
            return streamedText;
        }

        if (message.type === "lead_gen" && message.leads) {
            return (
                <div className="space-y-4">
                    {message.leads.map((lead, index) => (
                        <div key={index} className="p-3 bg-background rounded-lg">
                            <h3 className="font-semibold">{lead.title}</h3>
                            <div className="space-y-1 text-sm">
                                <p>📍 {lead.address}</p>
                                <p>🌐 <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{lead.website}</a></p>
                                <p>📞 {lead.phoneNumber}</p>
                                {lead.email !== "N/A" && <p>📧 {lead.email}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return message.content;
    };

    const exportLeadsToPdf = () => {
        const leadsToExport = messages.filter(
            (msg) => msg.type === "lead_gen" && msg.leads
        ).flatMap((msg) => msg.leads) as BusinessLead[];

        if (leadsToExport.length === 0) {
            alert("No leads to export.");
            return;
        }

        const doc = new jsPDF();
        const headers = ["Title", "Address", "Website", "Phone Number", "Email"];
        const data = leadsToExport.map(lead => [
            lead.title,
            lead.address,
            lead.website,
            lead.phoneNumber,
            lead.email
        ]);

        (doc as any).autoTable({
            head: [headers],
            body: data,
            didDrawPage: function (data: any) {
                doc.setFontSize(10);
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.getHeight();
                const pageNumber = `Page ${(doc as any).internal.getNumberOfPages()}`;
                doc.text(pageNumber, pageSize.getWidth() / 2, pageHeight - 10, { align: 'center' });
            }
        });

        doc.save("business_leads.pdf");
    };


    const exportLeadsToGoogleSheet = async () => {
        if (!sheetUrl.trim()) {
            alert("Please enter the Google Apps Script URL first");
            return;
        }

        const leadsToExport = messages
            .filter((msg): msg is Message & { leads: BusinessLead[] } => 
                msg.type === "lead_gen" && Array.isArray(msg.leads))
            .flatMap(msg => msg.leads);

        if (leadsToExport.length === 0) {
            alert("No leads to export.");
            return;
        }

        setSheetLoading(true);
        try {
            const response = await fetch(sheetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leads: leadsToExport
                }),
                mode: 'no-cors' // Add this for Google Apps Script
            });

            // Since no-cors mode doesn't return response details
            alert("Export request sent! Check your Google Sheet.");
            
        } catch (error) {
            console.error("Error exporting leads:", error);
            alert("Failed to export leads. Make sure your Apps Script URL is correct and deployed as a web app.");
        } finally {
            setSheetLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Left Sidebar - Chat History */}
            <div className="w-64 border-r border-border">
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
                                    {getMessageIcon(msg.role, msg.type, msg.isStreaming)}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {msg.role === "user" ? "You" : "Assistant"}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {msg.content.substring(0, 50)}...
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {msg.timestamp.toLocaleTimeString()}
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
                <div className="flex-1 p-4 overflow-auto" id="chat-container" ref={chatContainerRef}>
                    <ScrollArea className="h-full">
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {msg.role !== "user" && (
                                        <div className="mt-4">
                                            {getMessageIcon(msg.role, msg.type, msg.isStreaming)}
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] p-4 rounded-lg ${msg.role === "user"
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
                                            {getMessageIcon(msg.role)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message... (Try asking about businesses or locations)"
                            className="flex-1"
                            rows={3}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !input.trim()}
                            className="self-end"
                        >
                            {loading ? "Sending..." : "Send"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Parameters */}
            <div className="w-80 border-l border-border">
                <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Parameters
                    </h2>
                </div>
                <ScrollArea className="h-[calc(100vh-60px)]">
                    <div className="p-4 space-y-6">

                        <Separator />
                        {/* Temperature */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sliders className="w-4 h-4" />
                                Temperature
                            </label>
                            <Slider
                                value={temperature}
                                onValueChange={setTemperature}
                                max={1}
                                step={0.1}
                                className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                                Value: {temperature[0]}
                            </p>
                        </div>
                       
                        {/* Max Tokens */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Terminal className="w-4 h-4" />
                                Max Tokens
                            </label>
                            <Slider
                                value={maxTokens}
                                onValueChange={setMaxTokens}
                                max={4096}
                                step={64}
                                className="w-full"
                            />
                            <p className="text-sm text-muted-foreground">
                                Value: {maxTokens[0]}
                            </p>
                        </div>

                        <Separator />


                        <Separator />
                        {/* Export Leads Button */}
                        {messages.some(msg => msg.type === 'lead_gen' && msg.leads) && (
                            <div className="mt-4">
                                <Button onClick={exportLeadsToPdf} className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Leads to PDF
                                </Button>
                            </div>
                        )}
                        {messages.some(msg => msg.type === 'lead_gen' && msg.leads) && (
                            <div className="mt-4">
                                <Button
                                    onClick={exportLeadsToGoogleSheet}
                                    disabled={sheetLoading}
                                    className="w-full"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Leads to Google Sheets
                                </Button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Sheet className="w-4 h-4" />
                                Google Apps Script Web App URL
                            </label>
                            <Input
                                type="url"
                                placeholder="Paste your Apps Script deployment URL here"
                                value={sheetUrl}
                                onChange={(e) => setSheetUrl(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Deploy your Apps Script as a web app and paste the URL here
                            </p>
                        </div>

                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}