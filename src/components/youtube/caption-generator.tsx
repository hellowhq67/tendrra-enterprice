
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CaptionGeneratorProps {
  transcript?: string | null | undefined // Modified type
  fps?: number
  onGenerate: (captions: { text: string; startFrame: number; endFrame: number }[]) => void
}

export function CaptionGenerator({ transcript, fps = 30, onGenerate }: CaptionGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [captionText, setCaptionText] = useState(transcript || "") // Handle null/undefined
  const { toast } = useToast()

  const handleGenerate = () => {
    if (!captionText) {
      toast({
        title: "No text provided",
        description: "Please enter transcript text to generate captions",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Parse the transcript
      // This is a simple implementation that assumes each line is a caption
      // In a real app, you might want to use a more sophisticated algorithm

      const captions: { text: string; startFrame: number; endFrame: number }[] = []

      // Split by lines and filter out empty lines
      const lines = captionText.split("\n").filter((line) => line.trim() !== "")

      // Check if the transcript has timestamps like [00:15]
      const hasTimestamps = lines.some((line) => /\[\d{2}:\d{2}\]/.test(line))

      if (hasTimestamps) {
        // Parse timestamps
        lines.forEach((line, index) => {
          const match = line.match(/\[(\d{2}):(\d{2})\](.*)/)
          if (match) {
            const minutes = Number.parseInt(match[1])
            const seconds = Number.parseInt(match[2])
            const text = match[3].trim()

            const startFrame = (minutes * 60 + seconds) * fps
            const endFrame =
              index < lines.length - 1
                ? (Number.parseInt(lines[index + 1].match(/\[(\d{2}):(\d{2})\]/)?.[1] || "0") * 60 +
                  Number.parseInt(lines[index + 1].match(/\[(\d{2}):(\d{2})\]/)?.[2] || "0")) *
                fps -
              1
                : startFrame + 5 * fps // Default 5 seconds for the last caption

            captions.push({ text, startFrame, endFrame })
          }
        })
      } else {
        // Distribute captions evenly
        const totalDuration = 60 * fps // Default 60 seconds
        const captionDuration = Math.floor(totalDuration / lines.length)

        lines.forEach((line, index) => {
          const startFrame = index * captionDuration
          const endFrame = startFrame + captionDuration - 1
          captions.push({ text: line.trim(), startFrame, endFrame })
        })
      }

      onGenerate(captions)

      toast({
        title: "Captions generated",
        description: `Generated ${captions.length} captions`,
      })
    } catch (error) {
      toast({
        title: "Error generating captions",
        description: "Failed to parse transcript. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="bg-background/50 border-blue-500/20">
      <CardHeader className="border-b border-blue-500/20">
        <CardTitle className="text-blue-400">Caption Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="transcript" className="text-blue-400">
            Transcript
          </Label>
          <Textarea
            id="transcript"
            placeholder="Enter transcript text or paste timestamped transcript (e.g. [00:15] This is a caption)"
            value={captionText}
            onChange={(e) => setCaptionText(e.target.value)}
            className="min-h-[150px] bg-background/50 border-blue-500/30 focus:ring-blue-500/30"
          />
          <p className="text-xs text-muted-foreground">
            You can use timestamps in the format [MM:SS] to specify when each caption should appear.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !captionText}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Captions"}
        </Button>
      </CardFooter>
    </Card>
  )
}
