"use client"

import { motion } from "framer-motion"
import { CardSpotlight } from "../ui/card-spotlight"
import { Button } from "../ui/button"
import Image from "next/image"
import { Clock, BarChart, Users, CheckCircle } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "AI Content Creation Masterclass",
    description: "Learn how to leverage AI tools to create high-quality content for your business.",
    image: "/placeholder.svg?height=400&width=600&text=Content+Masterclass",
    duration: "8 hours",
    level: "Intermediate",
    students: 1245,
    modules: 12,
    progress: 0,
  },
  {
    id: 2,
    title: "Social Media Marketing with AI",
    description: "Master the art of using AI to create engaging social media content and campaigns.",
    image: "/placeholder.svg?height=400&width=600&text=Social+Media+AI",
    duration: "6 hours",
    level: "Beginner",
    students: 2187,
    modules: 8,
    progress: 25,
  },
  {
    id: 3,
    title: "Advanced AI Prompt Engineering",
    description: "Learn advanced techniques for crafting effective prompts for AI content generation.",
    image: "/placeholder.svg?height=400&width=600&text=Prompt+Engineering",
    duration: "10 hours",
    level: "Advanced",
    students: 876,
    modules: 15,
    progress: 60,
  },
]

export function LearnCourses() {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold"
          >
            Your Learning Journey
          </motion.h2>

          <Button className="bg-transparent border border-gray-700 hover:bg-gray-800 text-white">
            View All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CardSpotlight className="h-full bg-gray-900/50 backdrop-blur-sm p-0 overflow-hidden">
                <div className="relative h-full">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />

                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{course.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <BarChart className="h-4 w-4" />
                        <span className="text-xs">{course.level}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">{course.modules} modules</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {course.progress > 0 ? (
                        <div className="text-sm text-gray-300">
                          <span className="text-blue-400">{course.progress}%</span> complete
                        </div>
                      ) : (
                        <div className="text-sm text-gray-300">Not started</div>
                      )}
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 text-white">
                        {course.progress > 0 ? "Continue" : "Start Course"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

