"use client"

import * as React from "react"

export interface Project {
  title: string
  description: string
  script: string | null
  transcript: string | null
  seoKeywords: string[]
  seoScore: number
  contentAnalysis: {
    engagement: number
    clarity: number
    originality: number
    suitability: number
  } | null
  thumbnail: string | null
  images: string[]
  audio: string | null
  video: string | null
  captions: { text: string; startFrame: number; endFrame: number }[] // Added Captions type
  progress: {
    script: number
    transcript: number
    thumbnail: number
    images: number
    audio: number
    video: number
    seo: number
    captions: number // Add caption progress type
  }
}

interface ProjectContextType {
  project: Project
  updateProject: (updates: Partial<Project>) => void
  addImage: (image: string) => void
  removeImage: (index: number) => void
  calculateProgress: () => number
}

export const ProjectContext = React.createContext<ProjectContextType>({
  project: {
    title: "",
    description: "",
    script: null,
    transcript: null,
    seoKeywords: [],
    seoScore: 0,
    contentAnalysis: null,
    thumbnail: null,
    images: [],
    audio: null,
    video: null,
    captions: [], // added default value
    progress: {
      script: 0,
      transcript: 0,
      thumbnail: 0,
      images: 0,
      audio: 0,
      video: 0,
      seo: 0,
      captions: 0, //Add captions progress default value
    },
  },
  updateProject: () => { },
  addImage: () => { },
  removeImage: () => { },
  calculateProgress: () => 0,
})

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = React.useState<Project>({
    title: "",
    description: "",
    script: null,
    transcript: null,
    seoKeywords: [],
    seoScore: 0,
    contentAnalysis: null,
    thumbnail: null,
    images: [],
    audio: null,
    video: null,
    captions: [],  // added default value
    progress: {
      script: 0,
      transcript: 0,
      thumbnail: 0,
      images: 0,
      audio: 0,
      video: 0,
      seo: 0,
      captions: 0, //Add captions progress default value
    },
  })

  const updateProject = (updates: Partial<Project>) => {
    setProject((prev) => {
      const newProject = { ...prev, ...updates }

      // Update progress whenever project is updated
      const progress = {
        script: newProject.script ? 100 : 0,
        transcript: newProject.transcript ? 100 : 0,
        thumbnail: newProject.thumbnail ? 100 : 0,
        images: newProject.images.length > 0 ? Math.min(100, newProject.images.length * 20) : 0,
        audio: newProject.audio ? 100 : 0,
        video: newProject.video ? 100 : 0,
        seo: newProject.seoScore > 0 ? newProject.seoScore : 0,
        captions: newProject.captions.length > 0 ? 100 : 0, //Add captions progress value
      }

      return { ...newProject, progress }
    })
  }

  const addImage = (image: string) => {
    setProject((prev) => {
      const newImages = [...prev.images, image]
      const newProgress = {
        ...prev.progress,
        images: Math.min(100, newImages.length * 20),
        captions: prev.progress.captions,
      }

      return {
        ...prev,
        images: newImages,
        progress: newProgress,
      }
    })
  }

  const removeImage = (index: number) => {
    setProject((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      const newProgress = {
        ...prev.progress,
        images: Math.min(100, newImages.length * 20),
        captions: prev.progress.captions,
      }

      return {
        ...prev,
        images: newImages,
        progress: newProgress,
      }
    })
  }

  const calculateProgress = () => {
    const { progress } = project
    const weights = {
      script: 0.2,
      transcript: 0.1,
      thumbnail: 0.15,
      images: 0.15,
      audio: 0.15,
      video: 0.15,
      seo: 0.05,
      captions: 0.05, // Add captions weight
    }

    return Object.entries(progress).reduce((total, [key, value]) => {
      return total + value * (weights as any)[key] // type assertion
    }, 0)
  }

  return (
    <ProjectContext.Provider value={{ project, updateProject, addImage, removeImage, calculateProgress }}>
      {children}
    </ProjectContext.Provider>
  )
}