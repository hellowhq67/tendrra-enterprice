"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Save, RefreshCw, Play, Pause, Film } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export function VideoGenerator() {
  const { project, updateProject } = React.useContext(ProjectContext)
  const [transition, setTransition] = React.useState("fade")
  const [includeMusic, setIncludeMusic] = React.useState(true)
  const [musicStyle, setMusicStyle] = React.useState("upbeat")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedVideo, setGeneratedVideo] = React.useState<string | null>(project.video)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!project.script || !project.audio || project.images.length === 0) {
      toast({
        title: "Missing components",
        description: "Please create a script, audio, and add images first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/replicate/generate-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: project.audio,
          image_urls: project.images,
          transition,
          include_music: includeMusic,
          music_style: musicStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      const data = await response.json()
      setGeneratedVideo(data.video)
      toast({
        title: "Video generated",
        description: "Your video has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (generatedVideo) {
      updateProject({
        video: generatedVideo,
      })
      toast({
        title: "Video saved",
        description: "Your video has been saved to the project",
      })
    }
  }

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement("a")
      link.href = generatedVideo
      link.download = `youtube-short-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  React.useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleEnded = () => setIsPlaying(false)
      video.addEventListener("ended", handleEnded)
      return () => {
        video.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Video Generator</CardTitle>
          <CardDescription>Generate your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transition">Transition Style</Label>
            <Select value={transition} onValueChange={setTransition}>
              <SelectTrigger id="transition">
                <SelectValue placeholder="Select transition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="wipe">Wipe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-y-0 pt-2">
            <Label htmlFor="include-music">Include Background Music</Label>
            <Switch id="include-music" checked={includeMusic} onCheckedChange={setIncludeMusic} />
          </div>

          {includeMusic && (
            <div className="space-y-2">
              <Label htmlFor="music-style">Music Style</Label>
              <Select value={musicStyle} onValueChange={setMusicStyle}>
                <SelectTrigger id="music-style">
                  <SelectValue placeholder="Select music style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upbeat">Upbeat</SelectItem>
                  <SelectItem value="relaxed">Relaxed</SelectItem>
                  <SelectItem value="dramatic">Dramatic</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Project Components</h3>
            <div className="rounded-lg border p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Script</span>
                <span className="text-sm">{project.script ? "✅" : "❌"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Audio</span>
                <span className="text-sm">{project.audio ? "✅" : "❌"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Images</span>
                <span className="text-sm">{project.images.length > 0 ? `✅ (${project.images.length})` : "❌"}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !project.script || !project.audio || project.images.length === 0}
            className="w-full"
          >
            <Film className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Video"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Video</CardTitle>
          <CardDescription>Preview and save your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : generatedVideo ? (
            <div className="space-y-4">
              <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                <video
                  ref={videoRef}
                  src={generatedVideo}
                  className="w-full h-full object-cover"
                  onClick={togglePlayPause}
                />
              </div>
              <div className="flex justify-center">
                <Button variant="outline" onClick={togglePlayPause}>
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Play
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px] border rounded-lg">
              <p className="text-muted-foreground">Generate video to preview it here</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleDownload} disabled={!generatedVideo}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button onClick={handleSave} disabled={!generatedVideo}>
            <Save className="mr-2 h-4 w-4" />
            Save Video
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

