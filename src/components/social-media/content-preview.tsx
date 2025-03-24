"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Instagram, Linkedin, Twitter } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ContentPreviewProps {
  content: string
}

export function ContentPreview({ content }: ContentPreviewProps) {
  const [activeTab, setActiveTab] = useState("linkedin")
  const [formattedContent, setFormattedContent] = useState<Record<string, string>>({
    linkedin: "",
    twitter: "",
    instagram: "",
  })

  useEffect(() => {
    // Format content for different platforms
    const formatForLinkedIn = (text: string) => {
      // LinkedIn posts can be longer and more professional
      return text
    }

    const formatForTwitter = (text: string) => {
      // Twitter has a character limit
      let formatted = text
      if (formatted.length > 280) {
        formatted = formatted.substring(0, 277) + "..."
      }
      return formatted
    }

    const formatForInstagram = (text: string) => {
      // Instagram posts often have hashtags at the end
      return text
    }

    setFormattedContent({
      linkedin: formatForLinkedIn(content),
      twitter: formatForTwitter(content),
      instagram: formatForInstagram(content),
    })
  }, [content])

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="linkedin" className="flex items-center">
            <Linkedin className="h-4 w-4 mr-2" />
            LinkedIn
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center">
            <Twitter className="h-4 w-4 mr-2" />X
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linkedin">
          <Card>
            <CardContent className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{formattedContent.linkedin}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twitter">
          <Card>
            <CardContent className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{formattedContent.twitter}</ReactMarkdown>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {formattedContent.twitter.length} / 280 characters
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instagram">
          <Card>
            <CardContent className="p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{formattedContent.instagram}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

