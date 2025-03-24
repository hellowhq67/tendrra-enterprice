"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface AiStateCardProps {
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  onClick: (prompt: string) => void
}

export function AiStateCard({ icon, title, description, prompt, onClick }: AiStateCardProps) {
  return (
    <Card className="border-purple-900/50 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(149,76,233,0.15)] hover:shadow-[0_0_20px_rgba(149,76,233,0.25)] transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-full bg-black/30 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <CardTitle className="text-lg text-purple-300">{title}</CardTitle>
        </div>
        <CardDescription className="text-purple-200/60">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-300 pb-2">
        <div className="bg-black/30 border border-purple-500/20 p-2 rounded-md text-purple-300/80 italic">
          "{prompt}"
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onClick(prompt)}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
        >
          Generate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

