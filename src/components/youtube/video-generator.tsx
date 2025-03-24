"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Save, Film } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RemotionPlayer } from "./remotion-play"
import { CaptionGenerator } from "./caption-generator"

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
  const [captions, setCaptions] = React.useState<{ text: string; startFrame: number; endFrame: number }[]>([])
  const [fps, setFps] = React.useState(30)
  const [duration, setDuration] = React.useState(60)
  const [transitionDuration, setTransitionDuration] = React.useState(30)

  const handleGenerate = async () => {
    if (!project.script  || project.images.length === 0) {
      toast({
        title: "Missing components",
        description: "Please create a script, audio, and add images first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, we would render the Remotion composition
      // and return the URL to the rendered video
      // For now, we'll just return a placeholder video URL
      const videoUrl = "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"

      setGeneratedVideo(videoUrl)
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

  const handleCaptionsGenerated = (newCaptions: { text: string; startFrame: number; endFrame: number }[]) => {
    setCaptions(newCaptions)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Video Generator</CardTitle>
            <CardDescription>Generate your YouTube Short</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="captions">Captions</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4 pt-4">
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
                      <span className="text-sm">
                        {project.images.length > 0 ? `✅ (${project.images.length})` : "❌"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="captions" className="pt-4">
                <CaptionGenerator
                  transcript={project.transcript || undefined}
                  fps={fps}
                  onGenerate={handleCaptionsGenerated}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !project.script || project.images.length === 0}
              className="w-full"
            >
              <Film className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Video"}
            </Button>
          </CardFooter>
        </Card>

        {generatedVideo && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Video</CardTitle>
              <CardDescription>Your final YouTube Short</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                <video
                  ref={videoRef}
                  src={generatedVideo}
                  className="w-full h-full object-cover"
                  onClick={togglePlayPause}
                />
              </div>
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
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Remotion Preview</CardTitle>
          <CardDescription>Real-time video preview</CardDescription>
        </CardHeader>
        <CardContent>
          <RemotionPlayer
            images={project.images}
            audio={project.audio || undefined}
            title={project.title}
            captions={captions}
            duration={duration}
            fps={fps}
            transitionDuration={transitionDuration}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setDuration(Math.max(30, duration - 10))}>
            Shorter (-10s)
          </Button>
          <Button variant="outline" onClick={() => setDuration(duration + 10)}>
            Longer (+10s)
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

