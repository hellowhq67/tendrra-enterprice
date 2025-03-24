"use client"

import { useState } from "react"
import { useChat } from "ai/react"

export type AiState = "idle" | "post" | "article" | "tweet" | "hashtag"

interface UseSocialMediaAiOptions {
  onContentGenerated?: (content: string) => void
}

export function useSocialMediaAi(options?: UseSocialMediaAiOptions) {
  const [aiState, setAiState] = useState<AiState>("idle")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamProgress, setStreamProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [toolCalls, setToolCalls] = useState<string[]>([])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/ai/social-media",
    onResponse: (response) => {
      // Start streaming
      setIsStreaming(true)
      setStreamProgress(0)
      setToolCalls([])

      // Simulate progress
      const interval = setInterval(() => {
        setStreamProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 500)

      // Parse server-sent events
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      const readStream = async () => {
        while (true) {
          const { done, value } = await reader!.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6))
              if (data.type === "tool_call") {
                setToolCalls((prev) => [...prev, data.content])
              }
            }
          }
        }

        // Streaming complete
        clearInterval(interval)
        setIsStreaming(false)
        setStreamProgress(100)
      }

      readStream()

      // Check if the response contains generated content
      const contentData = response.headers.get("x-completion-data")
      if (contentData) {
        const { finalMessageContent } = JSON.parse(contentData)
        setGeneratedContent(finalMessageContent)
        if (options?.onContentGenerated) {
          options.onContentGenerated(finalMessageContent)
        }
      }
    },
  })

  const generateFromState = async (state: AiState, prompt: string) => {
    setAiState(state)

    // Create a prompt based on the AI state
    let fullPrompt = prompt

    switch (state) {
      case "post":
        fullPrompt = `Generate a professional post about ${prompt} for LinkedIn`
        break
      case "article":
        fullPrompt = `Write an article about ${prompt} with proper headings and structure`
        break
      case "tweet":
        fullPrompt = `Create 3 engaging tweets about ${prompt}`
        break
      case "hashtag":
        fullPrompt = `Suggest relevant hashtags for content about ${prompt}`
        break
    }

    // Set the input and submit
    handleInputChange({ target: { value: fullPrompt } } as any)
    setTimeout(() => handleSubmit({} as any), 100)
  }

  return {
    aiState,
    setAiState,
    isStreaming,
    streamProgress,
    generatedContent,
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    generateFromState,
    toolCalls,
  }
}

