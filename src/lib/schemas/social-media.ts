import { z } from "zod"

// Platform enum
export const PlatformEnum = z.enum(["linkedin", "twitter", "instagram"])

// Account schema
export const AccountSchema = z.object({
  id: z.string(),
  platform: PlatformEnum,
  username: z.string(),
  profileUrl: z.string().url().optional(),
  connected: z.boolean(),
  lastSync: z.string().optional(),
})

export type Account = z.infer<typeof AccountSchema>

// Post status enum
export const PostStatusEnum = z.enum(["scheduled", "posted", "failed"])

// Post schema
export const PostSchema = z.object({
  id: z.string(),
  content: z.string(),
  scheduledTime: z.string(),
  platforms: z.array(PlatformEnum),
  status: PostStatusEnum,
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export type Post = z.infer<typeof PostSchema>

// Content generation schema
export const ContentGenerationSchema = z.object({
  topic: z.string(),
  platform: z.enum(["linkedin", "twitter", "instagram", "all"]),
  tone: z.enum(["professional", "casual", "enthusiastic", "informative"]).optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
  hashtags: z.boolean().optional(),
  callToAction: z.boolean().optional(),
})

export type ContentGeneration = z.infer<typeof ContentGenerationSchema>

// Content analysis schema
export const ContentAnalysisSchema = z.object({
  wordCount: z.number(),
  characterCount: z.number(),
  readability: z.string(),
  engagement: z.string(),
  suggestions: z.array(z.string()),
})

export type ContentAnalysis = z.infer<typeof ContentAnalysisSchema>

