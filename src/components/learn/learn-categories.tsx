"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BookOpen, Video, FileText, Lightbulb, GraduationCap } from "lucide-react"

const categories = [
  { id: "all", name: "All Content", icon: <BookOpen className="h-5 w-5" /> },
  { id: "tutorials", name: "Tutorials", icon: <Lightbulb className="h-5 w-5" /> },
  { id: "courses", name: "Courses", icon: <GraduationCap className="h-5 w-5" /> },
  { id: "videos", name: "Videos", icon: <Video className="h-5 w-5" /> },
  { id: "articles", name: "Articles", icon: <FileText className="h-5 w-5" /> },
]

export function LearnCategories() {
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
                "px-4 py-2 rounded-full text-sm md:text-base transition-all duration-300 flex items-center gap-2",
                activeCategory === category.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-500 text-white"
                  : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50",
              )}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <div className="flex items-center">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all duration-300">
              <span>Level:</span>
              <span className="text-white">All Levels</span>
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

