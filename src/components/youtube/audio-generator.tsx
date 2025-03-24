"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Download, Save, RefreshCw, Play, Pause } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"

export function AudioGenerator() {
  const { project, updateProject } = React.useContext(ProjectContext)
  const [voice, setVoice] = React.useState("male1")
  const [speed, setSpeed] = React.useState(1)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedAudio, setGeneratedAudio] = React.useState<string | null>(project.audio)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
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
      const response = await fetch("/api/shorts/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: project.script,
          voice,
          speed,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate audio")
      }

      const data = await response.json()
      if (data.error) {
          throw new Error(data.error);
      }
      setGeneratedAudio(data.audio)
      toast({
        title: "Audio generated",
        description: "Your audio has been generated successfully",
      })
    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (generatedAudio) {
      updateProject({
        audio: generatedAudio,
      })
      toast({
        title: "Audio saved",
        description: "Your audio has been saved to the project",
      })
    }
  }

  const handleDownload = () => {
    if (generatedAudio) {
      const link = document.createElement("a")
      link.href = generatedAudio
      link.download = `audio-${Date.now()}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  React.useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => setIsPlaying(false)
      audio.addEventListener("ended", handleEnded)
      return () => {
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Audio Generator</CardTitle>
          <CardDescription>Generate voiceover from your script</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="voice">Voice</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger id="voice">
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male1">Male 1</SelectItem>
                <SelectItem value="male2">Male 2</SelectItem>
                <SelectItem value="female1">Female 1</SelectItem>
                <SelectItem value="female2">Female 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speed">Speed</Label>
              <span className="text-sm text-muted-foreground">{speed}x</span>
            </div>
            <Slider
              id="speed"
              min={0.5}
              max={2}
              step={0.1}
              value={[speed]}
              onValueChange={(value) => setSpeed(value[0])}
            />
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Script Preview</h3>
            <p className="text-sm text-muted-foreground line-clamp-6">
              {project.script || "No script available. Please create a script first."}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isGenerating || !project.script} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Audio"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Audio</CardTitle>
          <CardDescription>Preview and save your audio</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedAudio ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Button variant="outline" size="icon" className="h-16 w-16 rounded-full" onClick={togglePlayPause}>
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
                <audio ref={audioRef} src={generatedAudio} className="hidden" />
              </div>
              <div className="text-center text-sm text-muted-foreground">Click to play/pause the generated audio</div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
              <p className="text-muted-foreground">Generate audio to preview it here</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDownload} disabled={!generatedAudio}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleSave} disabled={!generatedAudio}>
            <Save className="mr-2 h-4 w-4" />
            Save Audio
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}