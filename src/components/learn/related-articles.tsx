"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import Image from "next/image"
import { Clock, FileText, BookOpen, Video } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, you would fetch this from an API
const getArticleData = (id: string) => {
  const articles = {
    "ai-content-creation-masterclass": {
      id: "ai-content-creation-masterclass",
      title: "AI Content Creation Masterclass",
      subtitle: "Learn how to leverage AI tools to create high-quality content",
      type: "course",
      image: "/placeholder.svg?height=400&width=600&text=AI+Content+Creation",
      readTime: "8 hours",
      level: "Intermediate",
    },
    "getting-started-with-ai-content-generation": {
      id: "getting-started-with-ai-content-generation",
      title: "Getting Started with AI Content Generation",
      subtitle: "Learn the basics of using AI to generate high-quality content",
      type: "article",
      image: "/placeholder.svg?height=400&width=600&text=AI+Content+Generation",
      readTime: "8 min read",
      level: "Beginner",
    },
    "advanced-social-media-strategies": {
      id: "advanced-social-media-strategies",
      title: "Advanced Social Media Strategies with AI",
      subtitle: "Discover how to leverage AI tools to create engaging social media content",
      type: "video",
      image: "/placeholder.svg?height=400&width=600&text=Social+Media+AI",
      readTime: "15 min",
      level: "Intermediate",
    },
    "ai-powered-seo": {
      id: "ai-powered-seo",
      title: "AI-Powered SEO: Optimizing Your Content",
      subtitle: "Learn how to use AI to optimize your content for search engines",
      type: "article",
      image: "/placeholder.svg?height=400&width=600&text=AI+SEO",
      readTime: "15 min read",
      level: "Advanced",
    },
    "creating-viral-youtube-shorts": {
      id: "creating-viral-youtube-shorts",
      title: "Creating Viral YouTube Shorts with AI",
      subtitle: "Step-by-step guide to creating engaging YouTube shorts using AI tools",
      type: "tutorial",
      image: "/placeholder.svg?height=400&width=600&text=YouTube+Shorts",
      readTime: "12 min",
      level: "Beginner",
    },
    "building-ai-content-strategy": {
      id: "building-ai-content-strategy",
      title: "Building an AI Content Strategy",
      subtitle: "Develop a comprehensive content strategy leveraging AI tools",
      type: "tutorial",
      image: "/placeholder.svg?height=400&width=600&text=Content+Strategy",
      readTime: "25 min read",
      level: "Advanced",
    },
  }

  return articles[id as keyof typeof articles] || null
}

interface RelatedArticlesProps {
  ids: string[]
  currentId: string
}

export function RelatedArticles({ ids, currentId }: RelatedArticlesProps) {
  const articles = ids.map((id) => getArticleData(id)).filter((article) => article !== null) as Array<{
    id: string
    title: string
    subtitle: string
    type: string
    image: string
    readTime: string
    level: string
  }>

  if (articles.length === 0) return null

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "tutorial":
        return <BookOpen className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Resources</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/learn/${article.id}`}>
                <CardSpotlight className="h-full bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative h-full">
                    <div
                      className="absolute top-4 left-4 z-10 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      style={{
                        backgroundColor:
                          article.type === "video"
                            ? "#3b82f6"
                            : article.type === "article"
                              ? "#10b981"
                              : article.type === "course"
                                ? "#8b5cf6"
                                : "#8b5cf6",
                      }}
                    >
                      {getTypeIcon(article.type)}
                      <span className="capitalize">{article.type}</span>
                    </div>
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2">{article.title}</h3>
                      <p className="text-gray-300 mb-4 text-sm">{article.subtitle}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">{article.readTime}</span>
                          </div>
                          <div className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300">{article.level}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

