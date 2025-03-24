"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Download, Save, RefreshCw, Share2, Palette, LayoutTemplate, Type } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { FileUpload } from "./file-upload"

export function ThumbnailGenerator() {
  const { project, updateProject } = React.useContext(ProjectContext)
  const [prompt, setPrompt] = React.useState("")
  const [style, setStyle] = React.useState("realistic")
  const [aspect, setAspect] = React.useState("portrait")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [thumbnails, setThumbnails] = React.useState<string[]>([])
  const [selectedThumbnail, setSelectedThumbnail] = React.useState<string | null>(project.thumbnail)
  const [titleOverlay, setTitleOverlay] = React.useState(true)
  const [titleText, setTitleText] = React.useState(project.title || "")
  const [titleColor, setTitleColor] = React.useState("#ffffff")
  const [titleSize, setTitleSize] = React.useState(24)
  const [titlePosition, setTitlePosition] = React.useState("bottom")
  const [showShadow, setShowShadow] = React.useState(true)
  const { toast } = useToast()

  // Auto-generate prompt from project title and description
  useEffect(() => {
    if (project.title && !prompt) {
      setPrompt(
        `Thumbnail for YouTube Short titled "${project.title}"${project.description ? ` about ${project.description}` : ""}`,
      )
    }

    if (project.title && !titleText) {
      setTitleText(project.title)
    }
  }, [project.title, project.description, prompt, titleText])

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for your thumbnail",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/shorts/thumbnail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, style }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate thumbnail");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error); // Propagate API error
      }

      setThumbnails(data.images);
      if (data.images.length > 0) {
        setSelectedThumbnail(data.images[0]);
      }

      toast({
        title: "Thumbnails generated",
        description: "Your thumbnails have been generated successfully",
      });
    } catch (error: any) {
      console.error("Thumbnail generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate thumbnails. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (selectedThumbnail) {
      updateProject({
        thumbnail: selectedThumbnail,
      })
      toast({
        title: "Thumbnail saved",
        description: "Your thumbnail has been saved to the project",
      })
    }
  }

  const handleDownload = () => {
    if (selectedThumbnail) {
      const link = document.createElement("a")
      link.href = selectedThumbnail
      link.download = `thumbnail-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Thumbnail downloaded",
        description: "Your thumbnail has been downloaded",
      })
    }
  }

  const handleShare = () => {
    if (selectedThumbnail) {
      // In a real app, this would open a share dialog or copy a shareable link
      navigator.clipboard.writeText(selectedThumbnail)
      toast({
        title: "Thumbnail link copied",
        description: "Shareable link copied to clipboard",
      })
    }
  }

  const handleFileUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setThumbnails((prev) => [...urls, ...prev])
      setSelectedThumbnail(urls[0])
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-background/50 border-pink-500/20">
        <CardHeader className="border-b border-pink-500/20">
          <CardTitle className="text-pink-400">Thumbnail Generator</CardTitle>
          <CardDescription>Generate a thumbnail for your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-pink-500/20">
              <TabsTrigger
                value="generate"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
              >
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="customize"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
              >
                Customize
              </TabsTrigger>
              <TabsTrigger
                value="upload"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-pink-500"
              >
                Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-pink-400">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your thumbnail"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] bg-background/50 border-pink-500/30 focus:ring-pink-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style" className="text-pink-400 flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Style
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style" className="bg-background/50 border-pink-500/30 focus:ring-pink-500/30">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Thumbnails"}
              </Button>
            </TabsContent>

            <TabsContent value="customize" className="p-6 space-y-4">
              <div className="flex items-center justify-between space-y-0">
                <Label htmlFor="title-overlay" className="text-pink-400 flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Title Overlay
                </Label>
                <Switch
                  id="title-overlay"
                  checked={titleOverlay}
                  onCheckedChange={setTitleOverlay}
                  className="data-[state=checked]:bg-pink-500"
                />
              </div>

              {titleOverlay && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="title-text" className="text-pink-400">
                      Title Text
                    </Label>
                    <Input
                      id="title-text"
                      placeholder="Enter title text"
                      value={titleText}
                      onChange={(e) => setTitleText(e.target.value)}
                      className="bg-background/50 border-pink-500/30 focus:ring-pink-500/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title-color" className="text-pink-400">
                        Text Color
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          id="title-color"
                          value={titleColor}
                          onChange={(e) => setTitleColor(e.target.value)}
                          className="w-10 h-10 p-1 bg-background/50 border-pink-500/30"
                        />
                        <Input
                          type="text"
                          value={titleColor}
                          onChange={(e) => setTitleColor(e.target.value)}
                          className="flex-1 bg-background/50 border-pink-500/30 focus:ring-pink-500/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title-position" className="text-pink-400">
                        Position
                      </Label>
                      <Select value={titlePosition} onValueChange={setTitlePosition}>
                        <SelectTrigger
                          id="title-position"
                          className="bg-background/50 border-pink-500/30 focus:ring-pink-500/30"
                        >
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="title-size" className="text-pink-400">
                        Font Size
                      </Label>
                      <span className="text-sm text-muted-foreground">{titleSize}px</span>
                    </div>
                    <Slider
                      id="title-size"
                      min={12}
                      max={48}
                      step={1}
                      value={[titleSize]}
                      onValueChange={(value) => setTitleSize(value[0])}
                      className="[&>[data-state=checked]]:bg-pink-500"
                    />
                  </div>

                  <div className="flex items-center justify-between space-y-0">
                    <Label htmlFor="show-shadow" className="text-pink-400">
                      Text Shadow
                    </Label>
                    <Switch
                      id="show-shadow"
                      checked={showShadow}
                      onCheckedChange={setShowShadow}
                      className="data-[state=checked]:bg-pink-500"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="p-6">
              <FileUpload
                onUpload={handleFileUpload}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
                maxFiles={4}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="bg-background/50 border-pink-500/20">
        <CardHeader className="border-b border-pink-500/20">
          <CardTitle className="text-pink-400">Generated Thumbnails</CardTitle>
          <CardDescription>Select your favorite thumbnail</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {isGenerating ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <RefreshCw className="h-8 w-8 animate-spin text-pink-400" />
            </div>
          ) : thumbnails.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-[9/16] overflow-hidden rounded-lg border border-pink-500/20 relative">
                <img
                  src={selectedThumbnail || thumbnails[0]}
                  alt="Selected thumbnail"
                  className="w-full h-full object-cover"
                />

                {titleOverlay && selectedThumbnail && (
                  <div
                    className={`absolute left-0 right-0 px-4 py-2 text-center ${
                      titlePosition === "top"
                        ? "top-4"
                        : titlePosition === "middle"
                          ? "top-1/2 -translate-y-1/2"
                          : "bottom-4"
                    }`}
                    style={{
                      color: titleColor,
                      fontSize: `${titleSize}px`,
                      textShadow: showShadow ? "0 2px 4px rgba(0,0,0,0.8)" : "none",
                      fontWeight: "bold",
                    }}
                  >
                    {titleText}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {thumbnails.map((thumbnail, index) => (
                  <div
                    key={index}
                    className={`aspect-[9/16] overflow-hidden rounded-lg border cursor-pointer ${
                      selectedThumbnail === thumbnail ? "ring-2 ring-pink-500 border-pink-500" : "border-pink-500/20"
                    }`}
                    onClick={() => setSelectedThumbnail(thumbnail)}
                  >
                    <img
                      src={thumbnail || "/placeholder.svg"}
                      alt={`Thumbnail option ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[300px] border border-pink-500/20 rounded-lg">
              <p className="text-muted-foreground">Generate thumbnails to see them here</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t border-pink-500/20 pt-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              disabled={!selectedThumbnail}
              className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={!selectedThumbnail}
              className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button
            onClick={handleSave}
            disabled={!selectedThumbnail}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Thumbnail
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}