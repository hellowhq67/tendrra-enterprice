"use client"

import * as React from "react"
import { Brain, Mail, MessageSquare } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface EmailActionsProps {
  email: {
    name: string | undefined;
    subject: string | undefined;
    teaser: string | undefined;
  }
  
}
export function AiEmailActions({ email }: EmailActionsProps) {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedReply, setGeneratedReply] = React.useState("")
  const [customPrompt, setCustomPrompt] = React.useState("")
  const { toast } = useToast()

  const generateReply = async () => {
    setIsGenerating(true)
    try {
      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt: `Write a professional email reply to the following email:
        Subject: ${email.subject}
        Content: ${email.teaser}
        
        The reply should be concise, friendly, and maintain a professional tone.`,
      })
      setGeneratedReply(text)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const trainAI = async () => {
    setIsGenerating(true)
    try {
      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt:
          customPrompt ||
          `Analyze this email and provide insights:
        Subject: ${email.subject}
        Content: ${email.teaser}`,
      })
      setGeneratedReply(text)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const summarizeEmail = async () => {
    setIsGenerating(true)
    try {
      const { text } = await generateText({
        model: openai("gpt-4"),
        prompt: `Summarize this email in 2-3 bullet points:
        Subject: ${email.subject}
        Content: ${email.teaser}`,
      })
      setGeneratedReply(text)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-7">
            <MessageSquare className="mr-2 h-4 w-4" />
            Reply
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI-Generated Reply</DialogTitle>
            <DialogDescription>Generate a professional response to this email using AI.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Textarea
              value={generatedReply}
              placeholder="Generated reply will appear here..."
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="secondary" onClick={generateReply} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-7">
            <Mail className="mr-2 h-4 w-4" />
            Read
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Summary</DialogTitle>
            <DialogDescription>Get a quick summary of this email using AI.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Textarea value={generatedReply} placeholder="Summary will appear here..." className="min-h-[150px]" />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={summarizeEmail} disabled={isGenerating}>
              {isGenerating ? "Summarizing..." : "Summarize"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-7">
            <Brain className="mr-2 h-4 w-4" />
            Train
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Train AI</DialogTitle>
            <DialogDescription>Analyze this email to improve AI responses.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt">Custom Analysis Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter custom prompt for analysis..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>
            <Textarea value={generatedReply} placeholder="Analysis will appear here..." className="min-h-[150px]" />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={trainAI} disabled={isGenerating}>
              {isGenerating ? "Analyzing..." : "Analyze"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

