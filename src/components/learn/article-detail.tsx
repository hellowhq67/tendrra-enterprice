"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { Clock, BarChart, Calendar, Bookmark, Share2, ThumbsUp, Play, FileText, BookOpen, Video } from "lucide-react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ArticleProps {
  article: {
    id: string
    title: string
    subtitle: string
    type: string
    image: string
    author: {
      name: string
      role: string
      avatar: string
    }
    publishDate: string
    readTime: string
    level: string
    content: string
    topics: string[]
    modules?: {
      title: string
      duration: string
      completed: boolean
    }[]
  }
}

export function ArticleDetail({ article }: ArticleProps) {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-5 w-5" />
      case "article":
        return <FileText className="h-5 w-5" />
      case "tutorial":
        return <BookOpen className="h-5 w-5" />
      case "course":
        return <BookOpen className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <section className="pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/learn" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Learning Resources
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 bg-opacity-90 text-white"
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
            </span>

            {article.topics.map((topic, index) => (
              <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">
                {topic}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{article.title}</h1>
          <p className="text-xl text-gray-300 mb-6">{article.subtitle}</p>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <Image
                src={article.author.avatar || "/placeholder.svg"}
                alt={article.author.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h4 className="font-semibold text-white">{article.author.name}</h4>
                <p className="text-sm text-gray-400">{article.author.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(article.publishDate)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{article.readTime}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <BarChart className="h-4 w-4" />
                <span className="text-sm">{article.level}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden mb-8">
              {article.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
                  <Button className="rounded-full w-16 h-16 flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" fill="white" />
                  </Button>
                </div>
              )}
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                width={1000}
                height={600}
                className="w-full aspect-video object-cover"
              />
            </div>

            <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm prose prose-invert max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </CardSpotlight>

            <div className="mt-8 flex justify-between">
              <div className="flex gap-4">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <ThumbsUp className="mr-2 h-5 w-5" /> Helpful
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <Share2 className="mr-2 h-5 w-5" /> Share
                </Button>
              </div>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Bookmark className="mr-2 h-5 w-5" /> Save
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            {article.modules && article.modules.length > 0 && (
              <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm mb-6">
                <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                <div className="space-y-4">
                  {article.modules.map((module, index) => (
                    <div key={index} className="border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            module.completed ? "bg-green-500" : "bg-gray-700"
                          }`}
                        >
                          {module.completed ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span className="text-white text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${module.completed ? "text-gray-400" : "text-white"}`}>
                            {module.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                    {article.modules.some((m) => m.completed) ? "Continue Course" : "Start Course"}
                  </Button>
                </div>
              </CardSpotlight>
            )}

            <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">About the Author</h3>
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={article.author.avatar || "/placeholder.svg"}
                  alt={article.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-white">{article.author.name}</h4>
                  <p className="text-sm text-gray-400">{article.author.role}</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {article.author.name} is an expert in {article.topics.join(", ")} with over 10 years of experience in
                the field. They have helped hundreds of businesses and individuals improve their skills and achieve
                their goals.
              </p>
              <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white">
                View Profile
              </Button>
            </CardSpotlight>
          </div>
        </div>
      </div>
    </section>
  )
}

