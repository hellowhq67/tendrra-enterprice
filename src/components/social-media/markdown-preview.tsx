"use client"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LinkedinIcon, TwitterIcon, InstagramIcon } from "lucide-react"

interface MarkdownPreviewProps {
  content: string
  platform?: string
}

export function MarkdownPreview({ content, platform = "all" }: MarkdownPreviewProps) {
  const [activeTab, setActiveTab] = useState(platform === "all" ? "linkedin" : platform)

  // Set active tab when platform prop changes
  useEffect(() => {
    if (platform !== "all") {
      setActiveTab(platform)
    }
  }, [platform])

  const renderPlatformPreview = (platformName: string) => {
    switch (platformName) {
      case "linkedin":
        return (
          <div className="bg-white rounded-md p-4 border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div>
                <div className="font-semibold">Your Name</div>
                <div className="text-sm text-gray-500">Your Title • 1h</div>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between text-gray-500 text-sm">
              <div>Like</div>
              <div>Comment</div>
              <div>Share</div>
            </div>
          </div>
        )

      case "twitter":
        return (
          <div className="bg-white rounded-md p-4 border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-semibold">Your Name</span>
                  <span className="text-gray-500 ml-1">@yourhandle • 1h</span>
                </div>
                <div className="prose prose-sm max-w-none mt-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content.length > 280 ? content.substring(0, 277) + "..." : content}
                  </ReactMarkdown>
                </div>
                <div className="mt-3 flex justify-between text-gray-500 text-sm">
                  <div>Reply</div>
                  <div>Retweet</div>
                  <div>Like</div>
                  <div>Share</div>
                </div>
              </div>
            </div>
          </div>
        )

      case "instagram":
        return (
          <div className="bg-white rounded-md border max-w-md mx-auto">
            <div className="p-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="font-semibold">yourhandle</div>
            </div>
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400">Image Preview</div>
            </div>
            <div className="p-3">
              <div className="flex gap-3 mb-2 text-gray-700">
                <div>❤️</div>
                <div>💬</div>
                <div>📤</div>
              </div>
              <div className="text-sm">
                <span className="font-semibold">yourhandle</span>{" "}
                <span>{content.length > 150 ? content.substring(0, 147) + "..." : content}</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">View all comments</div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div>
      {platform === "all" ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="linkedin" className="flex items-center gap-1">
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-1">
              <TwitterIcon className="h-4 w-4" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center gap-1">
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </TabsTrigger>
          </TabsList>

          <TabsContent value="linkedin">{renderPlatformPreview("linkedin")}</TabsContent>

          <TabsContent value="twitter">{renderPlatformPreview("twitter")}</TabsContent>

          <TabsContent value="instagram">{renderPlatformPreview("instagram")}</TabsContent>
        </Tabs>
      ) : (
        renderPlatformPreview(platform)
      )}
    </div>
  )
}

