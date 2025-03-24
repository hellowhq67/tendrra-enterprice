"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

export function useWorkflow() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const analyzeEmail = async (workflow: any, email: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow,
          email,
          action: "analyze",
        }),
      })

      if (!response.ok) throw new Error("Failed to analyze email")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        result += decoder.decode(value)
      }

      return result
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateResponse = async (workflow: any, email: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow,
          email,
          action: "generate",
        }),
      })

      if (!response.ok) throw new Error("Failed to generate response")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let result = ""

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break
        result += decoder.decode(value)
      }

      return result
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveWorkflow = async (workflow: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflow),
      })

      if (!response.ok) throw new Error("Failed to save workflow")

      const data = await response.json()
      toast({
        title: "Success",
        description: "Workflow saved successfully",
      })
      return data.workflow
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    analyzeEmail,
    generateResponse,
    saveWorkflow,
  }
}
