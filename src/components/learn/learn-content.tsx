"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import Image from "next/image"
import { Clock, Video, FileText, BookOpen, Play } from "lucide-react"
import { useState } from "react"

const content = [
  {
    id: 1,
    title: "Getting Started with AI Content Generation",
    description: "Learn the basics of using AI to generate high-quality content for your business.",
    image: "/placeholder.svg?height=400&width=600&text=AI+Content+Generation",
    type: "article",
    duration: "8 min read",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Advanced Social Media Strategies with AI",
    description: "Discover how to leverage AI tools to create engaging social media content.",
    image: "/placeholder.svg?height=400&width=600&text=Social+Media+AI",
    type: "video",
    duration: "15 min",
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Email Marketing Automation with AI",
    description: "Learn how to automate your email marketing campaigns using AI tools.",
    image: "/placeholder.svg?height=400&width=600&text=Email+Automation",
    type: "tutorial",
    duration: "20 min read",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Creating Viral YouTube Shorts with AI",
    description: "Step-by-step guide to creating engaging YouTube shorts using AI tools.",
    image: "/placeholder.svg?height=400&width=600&text=YouTube+Shorts",
    type: "video",
    duration: "12 min",
    level: "Beginner",
  },
  {
    id: 5,
    title: "AI-Powered SEO: Optimizing Your Content",
    description: "Learn how to use AI to optimize your content for search engines.",
    image: "/placeholder.svg?height=400&width=600&text=AI+SEO",
    type: "article",
    duration: "15 min read",
    level: "Advanced",
  },
  {
    id: 6,
    title: "Building an AI Content Strategy",
    description: "Develop a comprehensive content strategy leveraging AI tools and techniques.",
    image: "/placeholder.svg?height=400&width=600&text=Content+Strategy",
    type: "tutorial",
    duration: "25 min read",
    level: "Advanced",
  },
]

export function LearnContent() {
  const [visibleContent, setVisibleContent] = useState(6)

  const loadMore = () => {
    setVisibleContent((prev) => Math.min(prev + 3, content.length))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-10 text-center"
        >
          Latest Learning Resources
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.slice(0, visibleContent).map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CardSpotlight className="h-full bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
                <div className="relative h-full">
                  <div
                    className="absolute top-4 left-4 z-10 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    style={{
                      backgroundColor:
                        item.type === "video" ? "#3b82f6" : item.type === "article" ? "#10b981" : "#8b5cf6",
                    }}
                  >
                    {getTypeIcon(item.type)}
                    <span className="capitalize">{item.type}</span>
                  </div>

                  <div className="relative">
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60">
                        <Button className="rounded-full w-12 h-12 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" fill="white" />
                        </Button>
                      </div>
                    )}
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">{item.duration}</span>
                        </div>
                        <div className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">{item.level}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white text-sm">
                        {item.type === "video" ? "Watch" : "Read"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>

        {visibleContent < content.length && (
          <div className="mt-12 text-center">
            <Button onClick={loadMore} className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3">
              Load More
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

