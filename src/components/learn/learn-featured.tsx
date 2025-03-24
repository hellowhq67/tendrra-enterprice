"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import Image from "next/image"
import { Play, Clock, BarChart } from "lucide-react"

export function LearnFeatured() {
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
          Featured Learning Resources
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSpotlight className="col-span-1 lg:col-span-2 bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
            <div className="relative h-full">
              <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/60">
                <Button className="rounded-full w-16 h-16 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </Button>
              </div>
              <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured Course
              </div>
              <Image
                src="/placeholder.svg?height=600&width=1000&text=AI+Content+Creation+Masterclass"
                alt="AI Content Creation Masterclass"
                width={1000}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">AI Content Creation Masterclass</h3>
                <p className="text-gray-300 mb-4">
                  Learn how to leverage AI tools to create high-quality content for your business. This comprehensive
                  course covers everything from text generation to image creation.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">8 hours</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span className="text-sm">Intermediate</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                    Start Learning
                  </Button>
                </div>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
            <div className="relative h-full">
              <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                New Article
              </div>
              <Image
                src="/placeholder.svg?height=600&width=600&text=AI+Trends+2025"
                alt="AI Trends 2025"
                width={600}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">The Future of AI: Trends to Watch in 2025</h3>
                <p className="text-gray-300 mb-4">
                  Explore the emerging trends in artificial intelligence that will shape the industry in the coming
                  years. From generative models to multimodal AI.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">10 min read</span>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                    Read Article
                  </Button>
                </div>
              </div>
            </div>
          </CardSpotlight>
        </div>
      </div>
    </section>
  )
}

