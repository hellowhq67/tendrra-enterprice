"use client"

import { useState } from "react"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import { ThumbsUp, MessageSquare } from "lucide-react"
import Image from "next/image"

// Mock data - in a real app, you would fetch this from an API
const getMockComments = (articleId: string) => {
  return [
    {
      id: 1,
      user: {
        name: "Emily Parker",
        avatar: "/placeholder.svg?height=100&width=100&text=EP",
      },
      date: "3 days ago",
      content:
        "This was incredibly helpful! I've been trying to understand how to use AI for content creation, and this article explained everything clearly. I especially appreciated the section on prompt engineering.",
      helpful: 12,
      replies: [
        {
          id: 101,
          user: {
            name: "Michael Chen",
            avatar: "/placeholder.svg?height=100&width=100&text=MC",
          },
          date: "2 days ago",
          content:
            "I agree! The prompt examples were particularly useful. I've already started implementing some of these techniques in my work.",
          helpful: 5,
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "David Thompson",
        avatar: "/placeholder.svg?height=100&width=100&text=DT",
      },
      date: "1 week ago",
      content:
        "Great overview of the topic. I would love to see a follow-up article that goes deeper into advanced techniques for specific industries. For example, how can these approaches be tailored for e-commerce or SaaS businesses?",
      helpful: 8,
      replies: [],
    },
    {
      id: 3,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100&text=SJ",
      },
      date: "2 weeks ago",
      content:
        "I found this article at just the right time. I've been struggling with content creation for my small business, and these AI tools seem like they could be a game-changer. Has anyone here had success using these techniques for a local business?",
      helpful: 15,
      replies: [
        {
          id: 102,
          user: {
            name: "Alex Rivera",
            avatar: "/placeholder.svg?height=100&width=100&text=AR",
          },
          date: "12 days ago",
          content:
            "I run a local bakery and have been using AI to create our weekly newsletter and social media content. It's saved me hours each week, and our engagement has actually increased. Happy to share more specifics if you're interested.",
          helpful: 7,
        },
      ],
    },
  ]
}

interface ArticleCommentsProps {
  articleId: string
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const comments = getMockComments(articleId)
  const [visibleComments, setVisibleComments] = useState(2)
  const [expandedReplies, setExpandedReplies] = useState<number[]>([])

  const loadMoreComments = () => {
    setVisibleComments((prev) => Math.min(prev + 3, comments.length))
  }

  const toggleReplies = (commentId: number) => {
    setExpandedReplies((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Comments ({comments.length})</h2>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {comments.slice(0, visibleComments).map((comment) => (
            <CardSpotlight key={comment.id} className="bg-gray-900/50 backdrop-blur-sm">
              <div className="flex gap-4">
                <Image
                  src={comment.user.avatar || "/placeholder.svg"}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{comment.user.name}</h4>
                      <p className="text-xs text-gray-400">{comment.date}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{comment.content}</p>

                  <div className="flex items-center gap-4 mb-4">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({comment.helpful})</span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                      onClick={() => toggleReplies(comment.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {comment.replies.length > 0
                          ? expandedReplies.includes(comment.id)
                            ? "Hide Replies"
                            : `View Replies (${comment.replies.length})`
                          : "Reply"}
                      </span>
                    </button>
                  </div>

                  {expandedReplies.includes(comment.id) && comment.replies.length > 0 && (
                    <div className="pl-6 border-l border-gray-800 space-y-4 mt-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <Image
                            src={reply.user.avatar || "/placeholder.svg"}
                            alt={reply.user.name}
                            width={32}
                            height={32}
                            className="rounded-full h-8 w-8"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-white text-sm">{reply.user.name}</h5>
                              <span className="text-xs text-gray-400">{reply.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{reply.content}</p>
                            <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs">
                              <ThumbsUp className="h-3 w-3" />
                              <span>Helpful ({reply.helpful})</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className="mt-4">
                        <textarea
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                          placeholder="Write a reply..."
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white text-xs"
                          >
                            Post Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>

        {visibleComments < comments.length && (
          <div className="text-center">
            <Button
              onClick={loadMoreComments}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-white"
            >
              Load More Comments
            </Button>
          </div>
        )}

        <div className="mt-12">
          <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
            <textarea
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              placeholder="Share your thoughts or ask a question..."
            ></textarea>
            <div className="mt-4 flex justify-end">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                Post Comment
              </Button>
            </div>
          </CardSpotlight>
        </div>
      </div>
    </section>
  )
}

