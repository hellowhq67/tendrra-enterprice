<<<<<<< HEAD
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Download, RefreshCw, Plus, Trash2 } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ImageGenerator() {
  const { project, addImage, removeImage } = React.useContext(ProjectContext)
  const [prompt, setPrompt] = React.useState("")
  const [style, setStyle] = React.useState("realistic")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([])
  const { toast } = useToast()

  // Extract keywords from script to help with image generation
  React.useEffect(() => {
    if (project.script && !prompt) {
      // Simple extraction of potential keywords from script
      const script = project.script
      const words = script.split(/\s+/)
      const keywords = words
        .filter((word) => word.length > 4) // Only longer words
        .filter((word) => !["about", "these", "those", "their", "there"].includes(word.toLowerCase())) // Filter common words
        .slice(0, 5) // Take first 5 keywords
        .join(", ")

      if (keywords) {
        setPrompt(`Generate images for a YouTube Short about: ${keywords}`)
      }
    }
  }, [project.script, prompt])

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for your images",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/shorts/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          aspect: "portrait", // Always portrait for Shorts
          negative_prompt: "low quality, blurry, text, watermark",
          num_outputs: 4,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate images")
      }

      const data = await response.json()
      if (data.error) {
          throw new Error(data.error); // Re-throw API error for handling
      }
      setGeneratedImages(data.images)
      toast({
        title: "Images generated",
        description: "Your images have been generated successfully",
      })
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToProject = (image: string) => {
    addImage(image)
    toast({
      title: "Image added",
      description: "Image has been added to your project",
    })
  }

  const handleDownload = (image: string) => {
    const link = document.createElement("a")
    link.href = image
    link.download = `image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Image Generator</CardTitle>
          <CardDescription>Generate images for your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the images you want to generate"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Images"}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
            <CardDescription>Add images to your project</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(image)}>
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" className="w-full" onClick={() => handleAddToProject(image)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
                <p className="text-muted-foreground">Generate images to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
            <CardDescription>Images added to your project</CardDescription>
          </CardHeader>
          <CardContent>
            {project.images.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => removeImage(index)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
                <p className="text-muted-foreground">No images added to your project yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
=======
"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wand2, Download, RefreshCw, Plus, Trash2 } from "lucide-react"
import { ProjectContext } from "./project-contenxt"
import { useToast } from "@/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ImageGenerator() {
  const { project, addImage, removeImage } = React.useContext(ProjectContext)
  const [prompt, setPrompt] = React.useState("")
  const [style, setStyle] = React.useState("realistic")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generatedImages, setGeneratedImages] = React.useState<string[]>([])
  const { toast } = useToast()

  // Extract keywords from script to help with image generation
  React.useEffect(() => {
    if (project.script && !prompt) {
      // Simple extraction of potential keywords from script
      const script = project.script
      const words = script.split(/\s+/)
      const keywords = words
        .filter((word) => word.length > 4) // Only longer words
        .filter((word) => !["about", "these", "those", "their", "there"].includes(word.toLowerCase())) // Filter common words
        .slice(0, 5) // Take first 5 keywords
        .join(", ")

      if (keywords) {
        setPrompt(`Generate images for a YouTube Short about: ${keywords}`)
      }
    }
  }, [project.script, prompt])

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt for your images",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/shorts/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          style,
          aspect: "portrait", // Always portrait for Shorts
          negative_prompt: "low quality, blurry, text, watermark",
          num_outputs: 4,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate images")
      }

      const data = await response.json()
      if (data.error) {
          throw new Error(data.error); // Re-throw API error for handling
      }
      setGeneratedImages(data.images)
      toast({
        title: "Images generated",
        description: "Your images have been generated successfully",
      })
    } catch (error: any) {
      console.error("Image generation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToProject = (image: string) => {
    addImage(image)
    toast({
      title: "Image added",
      description: "Image has been added to your project",
    })
  }

  const handleDownload = (image: string) => {
    const link = document.createElement("a")
    link.href = image
    link.download = `image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Image Generator</CardTitle>
          <CardDescription>Generate images for your YouTube Short</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the images you want to generate"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
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
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Images"}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
            <CardDescription>Add images to your project</CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(image)}>
                        <Download className="mr-2 h-3 w-3" />
                        Download
                      </Button>
                      <Button size="sm" className="w-full" onClick={() => handleAddToProject(image)}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
                <p className="text-muted-foreground">Generate images to see them here</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
            <CardDescription>Images added to your project</CardDescription>
          </CardHeader>
          <CardContent>
            {project.images.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-[9/16] overflow-hidden rounded-lg border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => removeImage(index)}>
                        <Trash2 className="mr-2 h-3 w-3" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center min-h-[200px] border rounded-lg">
                <p className="text-muted-foreground">No images added to your project yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
}