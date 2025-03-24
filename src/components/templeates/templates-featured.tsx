"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import Image from "next/image"
import { Crown, Star } from "lucide-react"

export function TemplatesFeatured() {
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
          Featured Templates
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSpotlight className="col-span-1 lg:col-span-2 bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
            <div className="relative h-full">
              <div className="absolute top-4 left-4 z-10 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Crown className="h-4 w-4" />
                Premium
              </div>
              <Image
                src="/placeholder.svg?height=600&width=1000&text=Social+Media+Dashboard"
                alt="Social Media Dashboard"
                width={1000}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Social Media Dashboard Pro</h3>
                <p className="text-gray-300 mb-4">
                  A comprehensive dashboard for managing all your social media accounts in one place. Track engagement,
                  schedule posts, and analyze performance.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-400 ml-2">(128)</span>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </CardSpotlight>

          <CardSpotlight className="bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
            <div className="relative h-full">
              <div className="absolute top-4 left-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Free
              </div>
              <Image
                src="/placeholder.svg?height=600&width=600&text=Email+Template"
                alt="Email Template"
                width={600}
                height={600}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Weekly Newsletter Template</h3>
                <p className="text-gray-300 mb-4">
                  A clean, modern email template perfect for weekly newsletters. Easy to customize and optimize for high
                  open rates.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-400 ml-2">(94)</span>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white">
                    Download
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

