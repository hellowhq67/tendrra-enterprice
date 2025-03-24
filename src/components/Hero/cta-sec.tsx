"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SparklesCore } from "../ui/sparkles"

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden w-screen">
      <div className="absolute inset-0 bg-black"></div>

      <div className="absolute inset-0 h-full w-full">
        <SparklesCore
          id="tsparticlesfullpage2"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-100 to-blue-400"
          >
            Ready to Transform Your Digital Strategy?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-300 mb-10"
          >
            Join thousands of businesses and creators who are saving time, increasing productivity, and creating better
            content with our AI-powered platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button className="bg-gradient-to-r from-gray-600 to-blue-500 hover:from-gray-700 hover:to-gray-600 text-white text-lg px-8 py-6 rounded-lg">
              Start Your Free Trial
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 text-lg px-8 py-6 rounded-lg"
            >
              Schedule a Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-gray-400"
          >
            No credit card required. 14-day free trial.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

