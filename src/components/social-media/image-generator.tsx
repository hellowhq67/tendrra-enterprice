"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, LinkedinIcon, TwitterIcon, InstagramIcon, Loader2Icon } from "lucide-react"

interface ImageGeneratorProps {
  onGenerateImage: (imageData: any) => void
}

export function ImageGenerator({ onGenerateImage }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [platform, setPlatform] = useState("linkedin")
  const [style, setStyle] = useState("realistic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<any[]>([])

  const handleGenerate = async () => {
    if (!prompt) return

    setIsGenerating(true)

    try {
      // In a real app, you would call your API to generate the image
      // For now, we'll simulate the generation with a placeholder
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aspectRatio = platform === "instagram" ? "1:1" : platform === "twitter" ? "16:9" : "4:3"
      const mockImageUrl = `/placeholder.svg?height=600&width=${platform === "instagram" ? "600" : platform === "twitter" ? "1067" : "800"}&text=${encodeURIComponent(`${platform} - ${style} - ${prompt.substring(0, 20)}...`)}`

      const newImage = {
        id: Date.now().toString(),
        imageUrl: mockImageUrl,
        prompt,
        platform,
        style,
        aspectRatio,
        createdAt: new Date().toISOString(),
      }

      setGeneratedImages((prev) => [newImage, ...prev])
      setPrompt("")
    } catch (error) {
      console.error("Error generating image:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-4 w-4" />
      case "twitter":
        return <TwitterIcon className="h-4 w-4" />
      case "instagram":
        return <InstagramIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="px-6 py-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generate Social Media Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">
                    <div className="flex items-center gap-2">
                      <LinkedinIcon className="h-4 w-4" />
                      LinkedIn
                    </div>
                  </SelectItem>
                  <SelectItem value="twitter">
                    <div className="flex items-center gap-2">
                      <TwitterIcon className="h-4 w-4" />
                      Twitter
                    </div>
                  </SelectItem>
                  <SelectItem value="instagram">
                    <div className="flex items-center gap-2">
                      <InstagramIcon className="h-4 w-4" />
                      Instagram
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Realistic</SelectItem>
                  <SelectItem value="cartoon">Cartoon</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">Image Description</label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={!prompt || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                Generate Image
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {generatedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-3">Generated Images</h3>
          <div className="grid grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.prompt}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-3">
                  <p className="text-xs line-clamp-2">{image.prompt}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {renderPlatformIcon(image.platform)}
                      <span>{image.platform}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{image.style}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-3 pt-0">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onGenerateImage(image)}>
                    Use This Image
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

