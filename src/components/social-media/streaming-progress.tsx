"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Sparkles, PenToolIcon as Tool } from "lucide-react"

interface StreamingProgressProps {
  isStreaming: boolean
  progress?: number
  onComplete?: () => void
  toolCalls: string[]
}

export function StreamingProgress({ isStreaming, progress = 0, onComplete, toolCalls }: StreamingProgressProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (isStreaming) {
      // If progress is provided, use it
      if (progress > 0) {
        setValue(progress)
      } else {
        // Otherwise, simulate progress
        const interval = setInterval(() => {
          setValue((prev) => {
            if (prev >= 95) {
              clearInterval(interval)
              return 95
            }
            return prev + 5
          })
        }, 300)

        return () => clearInterval(interval)
      }
    } else if (value > 0) {
      // When streaming stops, complete the progress
      setValue(100)
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 500)
    }
  }, [isStreaming, progress, onComplete, value])

  if (!isStreaming && value === 0) return null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-cyan-300 text-xs">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Generating content...</span>
          </div>
          <span className="text-xs text-cyan-300">{Math.round(value)}%</span>
        </div>
        <Progress
          value={value}
          className="h-1 bg-black/50"
          indicatorClassName="bg-gradient-to-r from-purple-500 to-cyan-500"
        />
      </div>
      {toolCalls.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-cyan-300">Tool Calls:</h4>
          <ul className="space-y-1">
            {toolCalls.map((call, index) => (
              <li key={index} className="flex items-center space-x-2 text-xs text-cyan-100">
                <Tool className="h-3 w-3" />
                <span>{call}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

