"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const categories = [
  { id: "all", name: "All Templates" },
  { id: "social", name: "Social Media" },
  { id: "email", name: "Email Marketing" },
  { id: "content", name: "Content Creation" },
  { id: "analytics", name: "Analytics" },
  { id: "video", name: "Video" },
  { id: "design", name: "Design" },
]

export function TemplateCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <section className="py-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300",
                activeCategory === category.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50",
              )}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              Free
            </button>
          </div>
          <div className="flex items-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300">
              <span className="h-3 w-3 rounded-full bg-purple-500"></span>
              Premium
            </button>
          </div>
          <div className="flex items-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300">
              <span>Sort by:</span>
              <span className="text-white">Newest</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

