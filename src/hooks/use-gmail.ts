"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

export function useGmail() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const connectGmail = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/gmail/auth")
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to Gmail",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getEmails = async (
    token: string,
    options: {
      maxResults?: number
      query?: string
      labelIds?: string[]
    } = {},
  ) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        maxResults: options.maxResults?.toString() || "20",
        query: options.query || "",
        labelIds: options.labelIds?.join(",") || "INBOX",
      })

      const response = await fetch(`/api/gmail/messages?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch emails")

      const data = await response.json()
      return data.emails
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getLabels = async (token: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/gmail/labels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch labels")

      const data = await response.json()
      return data.labels
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch labels",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    connectGmail,
    getEmails,
    getLabels,
  }
}
