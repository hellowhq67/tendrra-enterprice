"use client"

import * as React from "react"
import { Copy, RefreshCcw, Wand2, Download } from "lucide-react"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "../../hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { useTheme } from 'next-themes';

const templateTypes = [
    {
        value: "customer-support",
        label: "Customer Support",
        description: "Professional responses to customer inquiries",
    },
    {
        value: "sales-follow-up",
        label: "Sales Follow-up",
        description: "Follow up with potential customers",
    },
    {
        value: "meeting-schedule",
        label: "Meeting Schedule",
        description: "Schedule or confirm meetings",
    },
    {
        value: "thank-you",
        label: "Thank You",
        description: "Express gratitude to customers or partners",
    },
    {
        value: "html-template",
        label: "HTML Email Template",
        description: "Generate a full HTML email template",
    },
]

const toneOptions = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "formal", label: "Formal" },
    { value: "casual", label: "Casual" },
    { value: "persuasive", label: "Persuasive" },
    { value: "technical", label: "Technical" },
    { value: "humorous", label: "Humorous" },
]

const formSchema = z.object({
    image: z.any().optional(),
});

export function TemplateGenerator() {
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [template, setTemplate] = React.useState("")
    const [templateType, setTemplateType] = React.useState("")
    const [tone, setTone] = React.useState("professional")
    const [keywords, setKeywords] = React.useState("")
    const { toast } = useToast()
    const [useMarkdown, setUseMarkdown] = React.useState(true);
    const [showInIframe, setShowInIframe] = React.useState(false);
    const [companyImage, setCompanyImage] = React.useState<File | null>(null);
    const { theme } = useTheme();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: null,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCompanyImage(e.target.files[0]);
        } else {
            setCompanyImage(null);
        }
    };

    const generateTemplate = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/email/template", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tone, templateType, keywords, companyImage: companyImage ? 'data:' + companyImage.type + ';base64,' + await toBase64(companyImage) : null }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTemplate(data.text);
        } catch (error) {
            console.error("Error generating template:", error);
            toast({
                title: "Error Generating Template",
                description: "There was an error generating the template. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const toBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(template)
        toast({
            title: "Template copied to clipboard",
            description: "You can now paste it anywhere",
        })
    }

    const downloadTemplate = () => {
        const blob = new Blob([template], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'email-template.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Email/HTML Template Generator</CardTitle>
                    <CardDescription>Generate AI-powered email templates for various purposes.  Now with HTML template generation and Markdown support!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Template Type</Label>
                        <Select value={templateType} onValueChange={setTemplateType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select template type" />
                            </SelectTrigger>
                            <SelectContent>
                                {templateTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        <div className="flex flex-col">
                                            <span>{type.label}</span>
                                            <span className="text-xs text-muted-foreground">{type.description}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Tone</Label>
                        <Select value={tone} onValueChange={setTone}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select tone" />
                            </SelectTrigger>
                            <SelectContent>
                                {toneOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Keywords/Topics (optional)</Label>
                        <Input
                            placeholder="Enter keywords separated by commas"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                        />
                    </div>

                    <Separator />

                    <div className="flex items-center space-x-2">
                        <Label htmlFor="use-markdown">Use Markdown</Label>
                        <Switch id="use-markdown" checked={useMarkdown} onCheckedChange={setUseMarkdown} />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Label htmlFor="show-iframe">Show in Iframe</Label>
                        <Switch id="show-iframe" checked={showInIframe} onCheckedChange={setShowInIframe} disabled={!useMarkdown || templateType !== "html-template"} />
                    </div>

                    {templateType === "html-template" && (
                        <>
                            <Separator />
                            <div className="grid gap-2">
                                <Label htmlFor="company-image">Company Image (optional)</Label>
                                <Input
                                    id="company-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {companyImage && (
                                    <img
                                        src={URL.createObjectURL(companyImage)}
                                        alt="Company Logo"
                                        className="max-h-40 w-auto"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    <div className="grid gap-2">
                        <Label>Generated Template</Label>

                        {useMarkdown ? (
                            showInIframe && templateType === "html-template" ? (
                                <iframe
                                    srcDoc={template}
                                    title="HTML Preview"
                                    style={{ width: '100%', minHeight: '300px', border: '1px solid #ccc' }}
                                />
                            ) : (
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    className={cn("min-h-[200px] prose-invert", theme === "dark" )}
                                >
                                    {template}
                                </ReactMarkdown>
                            )
                        ) : (
                            <Textarea
                                placeholder="Your template will appear here..."
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="min-h-[200px]"
                            />
                        )}
                    </div>
                </CardContent>
                <CardFooter className="justify-between">
                    <Button variant="outline" onClick={copyToClipboard} disabled={!template}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => setTemplate("")} disabled={!template}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Clear
                        </Button>
                        {templateType === "html-template" && (
                            <Button variant="secondary" onClick={downloadTemplate} disabled={!template}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        )}
                        <Button onClick={generateTemplate} disabled={isGenerating}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isGenerating ? "Generating..." : "Generate"}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}