<<<<<<< HEAD
"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

export interface Project {
  _id: string
  title: string
  description: string
  script: string | null
  thumbnail: string | null
  images: string[]
  audio: string | null
  video: string | null
  userId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export function useProject() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Create a new project
  const createProject = async (data: { title: string; description?: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const project = await response.json()
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get a project by ID
  const getProject = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }

      const project = await response.json()
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get all projects
  const getProjects = async (page = 1, limit = 10) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects?page=${page}&limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const data = await response.json()
      return data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update a project
  const updateProject = async (id: string, data: Partial<Project>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      const project = await response.json()
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a project
  const deleteProject = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      })
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Add an image to a project
  const addImageToProject = async (projectId: string, imageUrl: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to add image to project")
      }

      const project = await response.json()
      toast({
        title: "Image added",
        description: "The image has been added to your project",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add image to project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Remove an image from a project
  const removeImageFromProject = async (projectId: string, index: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove image from project")
      }

      const project = await response.json()
      toast({
        title: "Image removed",
        description: "The image has been removed from your project",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image from project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    addImageToProject,
    removeImageFromProject,
  }
}

=======
"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

export interface Project {
  _id: string
  title: string
  description: string
  script: string | null
  thumbnail: string | null
  images: string[]
  audio: string | null
  video: string | null
  userId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export function useProject() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Create a new project
  const createProject = async (data: { title: string; description?: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const project = await response.json()
      toast({
        title: "Project created",
        description: "Your new project has been created successfully",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get a project by ID
  const getProject = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }

      const project = await response.json()
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Get all projects
  const getProjects = async (page = 1, limit = 10) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects?page=${page}&limit=${limit}`)

      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }

      const data = await response.json()
      return data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update a project
  const updateProject = async (id: string, data: Partial<Project>) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      const project = await response.json()
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a project
  const deleteProject = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully",
      })
      return true
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Add an image to a project
  const addImageToProject = async (projectId: string, imageUrl: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error("Failed to add image to project")
      }

      const project = await response.json()
      toast({
        title: "Image added",
        description: "The image has been added to your project",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add image to project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Remove an image from a project
  const removeImageFromProject = async (projectId: string, index: number) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove image from project")
      }

      const project = await response.json()
      toast({
        title: "Image removed",
        description: "The image has been removed from your project",
      })
      return project
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image from project. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    createProject,
    getProject,
    getProjects,
    updateProject,
    deleteProject,
    addImageToProject,
    removeImageFromProject,
  }
}

>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
