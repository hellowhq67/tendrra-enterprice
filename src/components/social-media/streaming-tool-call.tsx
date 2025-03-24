"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react"

interface StreamingToolCallProps {
  toolName: string
  status: "running" | "complete" | "error"
  progress?: number
  result?: string
}

export function StreamingToolCall({ toolName, status, progress = 0, result }: StreamingToolCallProps) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (status === "running") {
      if (progress > 0) {
        setValue(progress)
      } else {
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
    } else if (status === "complete") {
      setValue(100)
    } else if (status === "error") {
      setValue(0)
    }
  }, [status, progress])

  return (
    <Card className="border border-purple-900/20 bg-black/50 overflow-hidden">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {status === "running" && <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />}
            {status === "complete" && <CheckCircle className="h-4 w-4 text-green-400" />}
            {status === "error" && <AlertCircle className="h-4 w-4 text-red-400" />}
            <span className="text-sm font-medium text-white">{toolName}</span>
          </div>
          {status === "running" && <span className="text-xs text-cyan-400">{Math.round(value)}%</span>}
        </div>

        {status === "running" && (
          <Progress
            value={value}
            className="h-1 bg-black/50"
            indicatorClassName="bg-gradient-to-r from-purple-500 to-cyan-500"
          />
        )}

        {result && (
          <div className="mt-2 text-xs text-gray-300 bg-black/30 p-2 rounded border border-purple-900/10">{result}</div>
        )}
      </CardContent>
    </Card>
  )
}

