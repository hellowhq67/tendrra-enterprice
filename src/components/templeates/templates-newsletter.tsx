"use client"
import { Button } from "../ui/button"
import { CardSpotlight } from "../ui/card-spotlight"
import { Mail } from "lucide-react"

export function TemplatesNewsletter() {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <CardSpotlight className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/4 flex justify-center">
              <Mail className="h-24 w-24 text-purple-400" />
            </div>
            <div className="md:w-3/4">
              <h3 className="text-2xl font-bold text-white mb-3">Get New Templates in Your Inbox</h3>
              <p className="text-gray-300 mb-6">
                Subscribe to our newsletter and be the first to know when we release new templates. We'll also send you
                exclusive tips and resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-6 py-3 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </CardSpotlight>
      </div>
    </section>
  )
}

