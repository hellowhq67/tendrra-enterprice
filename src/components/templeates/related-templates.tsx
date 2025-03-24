"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import Image from "next/image"
import { Crown, Star } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, you would fetch this from an API
const getTemplateData = (id: string) => {
  const templates = {
    "social-media-dashboard": {
      id: "social-media-dashboard",
      title: "Social Media Dashboard Pro",
      description: "A comprehensive dashboard for managing all your social media accounts in one place.",
      image: "/placeholder.svg?height=400&width=600&text=Social+Dashboard",
      category: "social",
      isPremium: true,
      rating: 4.9,
      reviews: 128,
    },
    "weekly-newsletter": {
      id: "weekly-newsletter",
      title: "Weekly Newsletter Template",
      description: "A clean, modern email template perfect for weekly newsletters.",
      image: "/placeholder.svg?height=400&width=600&text=Email+Template",
      category: "email",
      isPremium: false,
      rating: 4.7,
      reviews: 94,
    },
    "instagram-story-pack": {
      id: "instagram-story-pack",
      title: "Instagram Story Templates Pack",
      description: "A collection of 20 Instagram story templates for product promotions.",
      image: "/placeholder.svg?height=400&width=600&text=Instagram+Stories",
      category: "social",
      isPremium: true,
      rating: 4.9,
      reviews: 203,
    },
    "content-calendar": {
      id: "content-calendar",
      title: "Content Calendar Template",
      description: "Plan and organize your content strategy with this comprehensive calendar.",
      image: "/placeholder.svg?height=400&width=600&text=Content+Calendar",
      category: "content",
      isPremium: false,
      rating: 4.5,
      reviews: 87,
    },
    "analytics-dashboard": {
      id: "analytics-dashboard",
      title: "Analytics Dashboard",
      description: "Track your key performance indicators with this comprehensive dashboard.",
      image: "/placeholder.svg?height=400&width=600&text=Analytics",
      category: "analytics",
      isPremium: true,
      rating: 4.7,
      reviews: 142,
    },
    "email-onboarding-sequence": {
      id: "email-onboarding-sequence",
      title: "Email Onboarding Sequence",
      description: "A 5-part email sequence to welcome and onboard new users.",
      image: "/placeholder.svg?height=400&width=600&text=Email+Sequence",
      category: "email",
      isPremium: true,
      rating: 4.8,
      reviews: 124,
    },
    "product-announcement": {
      id: "product-announcement",
      title: "Product Announcement Template",
      description: "Announce your new products or features with this professional template.",
      image: "/placeholder.svg?height=400&width=600&text=Product+Announcement",
      category: "email",
      isPremium: false,
      rating: 4.6,
      reviews: 78,
    },
    "monthly-digest": {
      id: "monthly-digest",
      title: "Monthly Digest Template",
      description: "Keep your audience informed with this comprehensive monthly digest template.",
      image: "/placeholder.svg?height=400&width=600&text=Monthly+Digest",
      category: "email",
      isPremium: true,
      rating: 4.7,
      reviews: 92,
    },
    "social-media-graphics-pack": {
      id: "social-media-graphics-pack",
      title: "Social Media Graphics Pack",
      description: "A collection of 50+ social media graphics templates for various platforms.",
      image: "/placeholder.svg?height=400&width=600&text=Social+Graphics",
      category: "social",
      isPremium: true,
      rating: 4.8,
      reviews: 176,
    },
  }

  return templates[id as keyof typeof templates] || null
}

interface RelatedTemplatesProps {
  ids: string[]
  currentId: string
}

export function RelatedTemplates({ ids, currentId }: RelatedTemplatesProps) {
  const templates = ids.map((id) => getTemplateData(id)).filter((template) => template !== null) as Array<{
    id: string
    title: string
    description: string
    image: string
    category: string
    isPremium: boolean
    rating: number
    reviews: number
  }>

  if (templates.length === 0) return null

  return (
    <section className="py-12 relative z-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">You May Also Like</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href={`/templates/${template.id}`}>
                <CardSpotlight className="h-full bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
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

