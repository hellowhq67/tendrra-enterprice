"use client"

import { useState } from "react"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import Image from "next/image"

// Mock data - in a real app, you would fetch this from an API
const getMockReviews = (templateId: string) => {
  return [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=100&width=100&text=SJ",
        role: "Marketing Director",
      },
      rating: 5,
      date: "2 weeks ago",
      title: "Exactly what I needed",
      content:
        "This template exceeded my expectations. It was easy to customize and saved me hours of work. The design is modern and professional, and the documentation is comprehensive. Highly recommended!",
      helpful: 24,
      replies: 2,
    },
    {
      id: 2,
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=100&width=100&text=MC",
        role: "Freelance Designer",
      },
      rating: 4,
      date: "1 month ago",
      title: "Great design, minor issues",
      content:
        "The design is excellent and very professional. I had a few minor issues with customization, but the support team was responsive and helped me resolve them quickly. Overall, I'm very satisfied with this template.",
      helpful: 18,
      replies: 1,
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        avatar: "/placeholder.svg?height=100&width=100&text=ED",
        role: "Small Business Owner",
      },
      rating: 5,
      date: "2 months ago",
      title: "Perfect for my business",
      content:
        "I've been looking for a template like this for a long time. It's perfect for my small business and has all the features I need. The customization options are extensive, and the template is very well-organized. Thank you!",
      helpful: 32,
      replies: 0,
    },
  ]
}

interface TemplateReviewsProps {
  templateId: string
}

export function TemplateReviews({ templateId }: TemplateReviewsProps) {
  const reviews = getMockReviews(templateId)
  const [visibleReviews, setVisibleReviews] = useState(2)

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => Math.min(prev + 3, reviews.length))
  }

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Customer Reviews</h2>

        <div className="grid grid-cols-1 gap-6 mb-8">
          {reviews.slice(0, visibleReviews).map((review) => (
            <CardSpotlight key={review.id} className="bg-gray-900/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={review.user.avatar || "/placeholder.svg"}
                      alt={review.user.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-white">{review.user.name}</h4>
                      <p className="text-sm text-gray-400">{review.user.role}</p>
                    </div>
                  </div>
                </div>

                <div className="md:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="text-gray-300 ml-2">{review.date}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{review.title}</h3>
                  <p className="text-gray-300 mb-4">{review.content}</p>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span>Reply ({review.replies})</span>
                    </button>
                  </div>
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>

        {visibleReviews < reviews.length && (
          <div className="text-center">
            <Button
              onClick={loadMoreReviews}
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-white"
            >
              Load More Reviews
            </Button>
          </div>
        )}

        <div className="mt-12">
          <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <button key={i} className="text-gray-600 hover:text-yellow-500">
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Review Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Summarize your experience"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2">Review</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px]"
                placeholder="Share your experience with this template"
              ></textarea>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
              Submit Review
            </Button>
          </CardSpotlight>
        </div>
      </div>
    </section>
  )
}

