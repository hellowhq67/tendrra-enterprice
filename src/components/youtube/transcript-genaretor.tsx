
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Copy, Save, RefreshCw, FileText, Clock } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function TranscriptGenerator() {
  const { project, updateProject } = React.useContext(ProjectContext)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedTranscript, setGeneratedTranscript] = React.useState(project.transcript || "")
  const [language, setLanguage] = React.useState("english")
  const [format, setFormat] = React.useState("standard")
  const [includeTimestamps, setIncludeTimestamps] = React.useState(true)
  const [detailLevel, setDetailLevel] = React.useState(2)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!project.script) {
      toast({
        title: "Script required",
        description: "Please create a script first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate transcript based on script
      const script = project.script
      let transcript = ""

      if (format === "standard") {
        const lines = script.split("\n").filter((line) => line.trim() !== "")

        if (includeTimestamps) {
          let currentTime = 0
          transcript = lines
            .map((line) => {
              // Remove markdown formatting
              const cleanLine = line.replace(/[#*_]/g, "").trim()
              if (!cleanLine) return ""

              // Calculate a random duration based on line length
              const duration = Math.max(2, cleanLine.length * 0.05)
              const timestamp = formatTime(currentTime)
              currentTime += duration

              return `[${timestamp}] ${cleanLine}`
            })
            .filter(Boolean)
            .join("\n\n")
        } else {
          transcript = lines
            .map((line) => line.replace(/[#*_]/g, "").trim())
            .filter(Boolean)
            .join("\n\n")
        }
      } else if (format === "srt") {
        const lines = script.split("\n").filter((line) => line.trim() !== "")
        let currentTime = 0

        transcript = lines
          .map((line, index) => {
            // Remove markdown formatting
            const cleanLine = line.replace(/[#*_]/g, "").trim()
            if (!cleanLine) return ""

            // Calculate a random duration based on line length
            const duration = Math.max(2, cleanLine.length * 0.05)
            const startTime = formatSrtTime(currentTime)
            currentTime += duration
            const endTime = formatSrtTime(currentTime)

            return `${index + 1}\n${startTime} --> ${endTime}\n${cleanLine}`
          })
          .filter(Boolean)
          .join("\n\n")
      }

      setGeneratedTranscript(transcript)
      toast({
        title: "Transcript generated",
        description: "Your transcript has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate transcript. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    updateProject({
      transcript: generatedTranscript,
    })
    toast({
      title: "Transcript saved",
      description: "Your transcript has been saved to the project",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTranscript)
    toast({
      title: "Copied to clipboard",
      description: "Transcript copied to clipboard",
    })
  }

  // Helper function to format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Helper function to format time as HH:MM:SS,mmm for SRT format
  const formatSrtTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const milliseconds = Math.floor((seconds % 1) * 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")},${milliseconds.toString().padStart(3, "0")}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-background/50 border-purple-500/20">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="text-purple-400">Transcript Generator</CardTitle>
          <CardDescription>Generate a transcript from your script</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Tabs defaultValue="options" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="options">Options</TabsTrigger>
              <TabsTrigger value="preview">Script Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="options" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="language"
                    className="bg-background/50 border-purple-500/30 focus:ring-purple-500/30"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger id="format" className="bg-background/50 border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="srt">SRT Subtitles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-y-0 pt-2">
                <Label htmlFor="include-timestamps" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Include Timestamps
                </Label>
                <Switch
                  id="include-timestamps"
                  checked={includeTimestamps}
                  onCheckedChange={setIncludeTimestamps}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <Label htmlFor="detail-level" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-400" />
                    Detail Level
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {detailLevel === 1 ? "Basic" : detailLevel === 2 ? "Standard" : "Detailed"}
                  </span>
                </div>
                <Slider
                  id="detail-level"
                  min={1}
                  max={3}
                  step={1}
                  value={[detailLevel]}
                  onValueChange={(value) => setDetailLevel(value[0])}
                  className="[&>[data-state=checked]]:bg-purple-500"
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="pt-4">
              <div className="rounded-lg border border-purple-500/20 p-4 bg-background/50">
                <h3 className="mb-2 font-medium text-purple-400">Script Preview</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line max-h-[200px] overflow-y-auto">
                  {project.script || "No script available. Please create a script first."}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t border-purple-500/20 pt-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !project.script}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Transcript"}
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/50 border-purple-500/20">
        <CardHeader className="border-b border-purple-500/20">
          <CardTitle className="text-purple-400">Generated Transcript</CardTitle>
          <CardDescription>Edit and refine your transcript</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isGenerating ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <RefreshCw className="h-8 w-8 animate-spin text-purple-400" />
            </div>
          ) : (
            <Textarea
              className="min-h-[300px] bg-background/50 border-purple-500/30 focus:ring-purple-500/30"
              placeholder="Your generated transcript will appear here..."
              value={generatedTranscript}
              onChange={(e) => setGeneratedTranscript(e.target.value)}
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-purple-500/20 pt-4">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!generatedTranscript}
            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!generatedTranscript}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Transcript
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
