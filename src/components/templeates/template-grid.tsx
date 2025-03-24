"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import Image from "next/image"
import { Crown, Star } from "lucide-react"
import { useState } from "react"

const templates = [
  {
    id: 1,
    title: "Social Media Content Calendar",
    description: "Plan and organize your social media content with this comprehensive calendar template.",
    image: "/placeholder.svg?height=400&width=600&text=Content+Calendar",
    category: "social",
    isPremium: false,
    rating: 4.5,
    reviews: 87,
  },
  {
    id: 2,
    title: "Email Onboarding Sequence",
    description: "A 5-part email sequence to welcome and onboard new users to your product or service.",
    image: "/placeholder.svg?height=400&width=600&text=Email+Sequence",
    category: "email",
    isPremium: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 3,
    title: "YouTube Thumbnail Creator",
    description: "Create eye-catching thumbnails for your YouTube videos with this template.",
    image: "/placeholder.svg?height=400&width=600&text=YouTube+Thumbnail",
    category: "video",
    isPremium: false,
    rating: 4.2,
    reviews: 56,
  },
  {
    id: 4,
    title: "Instagram Story Templates",
    description: "A collection of 20 Instagram story templates for product promotions and announcements.",
    image: "/placeholder.svg?height=400&width=600&text=Instagram+Stories",
    category: "social",
    isPremium: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 5,
    title: "Analytics Dashboard",
    description: "Track your key performance indicators with this comprehensive analytics dashboard.",
    image: "/placeholder.svg?height=400&width=600&text=Analytics+Dashboard",
    category: "analytics",
    isPremium: true,
    rating: 4.7,
    reviews: 142,
  },
  {
    id: 6,
    title: "Blog Post Template",
    description: "A structured template for creating engaging and SEO-friendly blog posts.",
    image: "/placeholder.svg?height=400&width=600&text=Blog+Template",
    category: "content",
    isPremium: false,
    rating: 4.3,
    reviews: 78,
  },
  {
    id: 7,
    title: "Lead Magnet Design",
    description: "Create professional lead magnets to grow your email list with this template.",
    image: "/placeholder.svg?height=400&width=600&text=Lead+Magnet",
    category: "design",
    isPremium: true,
    rating: 4.6,
    reviews: 91,
  },
  {
    id: 8,
    title: "Social Media Graphics Pack",
    description: "A collection of 50+ social media graphics templates for various platforms.",
    image: "/placeholder.svg?height=400&width=600&text=Social+Graphics",
    category: "social",
    isPremium: true,
    rating: 4.8,
    reviews: 176,
  },
  {
    id: 9,
    title: "Video Script Template",
    description: "A structured template for writing engaging video scripts for various content types.",
    image: "/placeholder.svg?height=400&width=600&text=Video+Script",
    category: "video",
    isPremium: false,
    rating: 4.4,
    reviews: 63,
  },
]

export function TemplateGrid() {
  const [visibleTemplates, setVisibleTemplates] = useState(6)

  const loadMore = () => {
    setVisibleTemplates((prev) => Math.min(prev + 3, templates.length))
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
          Browse Templates
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.slice(0, visibleTemplates).map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CardSpotlight className="h-full bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
                <div className="relative h-full">
                  <div
                    className="absolute top-4 left-4 z-10 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    style={{ backgroundColor: template.isPremium ? "#9333ea" : "#16a34a" }}
                  >
                    {template.isPremium && <Crown className="h-4 w-4" />}
                    {template.isPremium ? "Premium" : "Free"}
                  </div>
                  <Image
                    src={template.image || "/placeholder.svg"}
                    alt={template.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{template.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{template.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(template.rating)
                                  ? "text-yellow-500 fill-yellow-500"
                                  : i < template.rating
                                    ? "text-yellow-500 fill-yellow-500 opacity-50"
                                    : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 ml-2 text-xs">({template.reviews})</span>
                      </div>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white text-sm">
                        {template.isPremium ? "Preview" : "Download"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>

        {visibleTemplates < templates.length && (
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

