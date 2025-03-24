"use client"

import { useState, useCallback } from "react"
import type { Account, Post } from "@/lib/schemas/social-media"
import { useToast } from "./use-toast"

export function useSocialMedia() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const { toast } = useToast()

  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true)
    try {
      const response = await fetch("/api/social-media/accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")

      const data = await response.json()
      setAccounts(data.data)
      return data.data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch social media accounts",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoadingAccounts(false)
    }
  }, [toast])

  const connectAccount = useCallback(
    async (platform: string, username: string, token: string) => {
      try {
        const response = await fetch("/api/social-media/accounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ platform, username, token }),
        })

        if (!response.ok) throw new Error("Failed to connect account")

        const data = await response.json()

        // Update accounts list
        setAccounts((prev) => {
          const existingIndex = prev.findIndex((account) => account.platform === platform)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = data.data
            return updated
          }
          return [...prev, data.data]
        })

        toast({
          title: "Account connected",
          description: `Your ${platform} account has been connected successfully`,
        })

        return data.data
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Failed to connect your account. Please try again.",
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const disconnectAccount = useCallback(
    async (id: string) => {
      try {
        const response = await fetch("/api/social-media/accounts", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) throw new Error("Failed to disconnect account")

        // Update accounts list
        setAccounts((prev) =>
          prev.map((account) => (account.id === id ? { ...account, connected: false, lastSync: undefined } : account)),
        )

        toast({
          title: "Account disconnected",
          description: "Your account has been disconnected",
        })

        return true
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect account",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true)
    try {
      const response = await fetch("/api/social-media/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")

      const data = await response.json()
      setPosts(data.data)
      return data.data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch scheduled posts",
        variant: "destructive",
      })
      return []
    } finally {
      setIsLoadingPosts(false)
    }
  }, [toast])

  const schedulePost = useCallback(
    async (content: string, scheduledTime: string, platforms: string[]) => {
      try {
        const response = await fetch("/api/social-media/schedule", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, scheduledTime, platforms }),
        })

        if (!response.ok) throw new Error("Failed to schedule post")

        const data = await response.json()

        // Update posts list
        setPosts((prev) => [...prev, data.data])

        toast({
          title: "Post scheduled",
          description: "Your post has been scheduled successfully",
        })

        return data.data
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to schedule post. Please try again.",
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const deletePost = useCallback(
    async (id: string) => {
      try {
        const response = await fetch("/api/social-media/posts", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        })

        if (!response.ok) throw new Error("Failed to delete post")

        // Update posts list
        setPosts((prev) => prev.filter((post) => post.id !== id))

        toast({
          title: "Post deleted",
          description: "Your scheduled post has been deleted",
        })

        return true
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  return {
    accounts,
    posts,
    isLoadingAccounts,
    isLoadingPosts,
    fetchAccounts,
    connectAccount,
    disconnectAccount,
    fetchPosts,
    schedulePost,
    deletePost,
  }
}

