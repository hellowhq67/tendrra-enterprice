"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Crown, Star, Download, Eye, Share2, Bookmark, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface TemplateProps {
  template: {
    id: string
    title: string
    description: string
    longDescription: string
    image: string
    category: string
    isPremium: boolean
    price: string
    rating: number
    reviews: number
    features: string[]
    screenshots: string[]
  }
}

export function TemplateDetail({ template }: TemplateProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % template.screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + template.screenshots.length) % template.screenshots.length)
  }

  return (
    <section className="pt-24 pb-12 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/templates" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Templates
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative rounded-xl overflow-hidden mb-6 bg-gray-900/50 border border-gray-800">
              <div
                className="absolute top-4 left-4 z-10 bg-opacity-90 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                style={{ backgroundColor: template.isPremium ? "#9333ea" : "#16a34a" }}
              >
                {template.isPremium && <Crown className="h-4 w-4" />}
                {template.isPremium ? "Premium" : "Free"}
              </div>

              <div className="relative aspect-video">
                <Image
                  src={template.screenshots[currentImageIndex] || "/placeholder.svg"}
                  alt={template.title}
                  fill
                  className="object-cover"
                />

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {template.screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {template.screenshots.map((screenshot, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? "border-purple-500" : "border-transparent"}`}
                >
                  <Image
                    src={screenshot || "/placeholder.svg"}
                    alt={`Screenshot ${index + 1}`}
                    width={150}
                    height={100}
                    className="w-full h-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6">
              <span className="text-sm text-purple-400 uppercase tracking-wider">{template.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{template.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(template.rating)
                          ? "text-yellow-500 fill-yellow-500"
                          : i < template.rating
                            ? "text-yellow-500 fill-yellow-500 opacity-50"
                            : "text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-300">{template.rating}</span>
                </div>
                <div className="text-gray-400">{template.reviews} reviews</div>
              </div>

              <div className="mb-8">
                <p className="text-gray-300 mb-4">{template.description}</p>
                <div className="whitespace-pre-line text-gray-400">{template.longDescription}</div>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {template.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex-shrink-0 mt-0.5 mr-2"></div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className={`flex-1 py-6 ${
                    template.isPremium
                      ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                      : "bg-gradient-to-r from-green-600 to-teal-500 hover:from-green-700 hover:to-teal-600"
                  }`}
                >
                  {template.isPremium ? (
                    <>Get Premium - {template.price}</>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" /> Download Free
                    </>
                  )}
                </Button>

                {template.isPremium && (
                  <Button variant="outline" className="flex-1 py-6 border-gray-700 hover:bg-gray-800">
                    <Eye className="mr-2 h-5 w-5" /> Preview
                  </Button>
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <Share2 className="mr-2 h-5 w-5" /> Share
                </Button>
                <Button variant="ghost" className="text-gray-400 hover:text-white">
                  <Bookmark className="mr-2 h-5 w-5" /> Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

