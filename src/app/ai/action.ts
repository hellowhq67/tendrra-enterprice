import { generateObject } from "ai"
import { z } from "zod"

import { geminiFlashModel } from "./index"

// Generate social media post content
export async function generateSocialMediaPost({
  platform,
  topic,
  tone,
  length,
}: {
  platform: string
  topic: string
  tone: string
  length: string
}) {
  const { object: post } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate a ${length} ${platform} post about ${topic} with a ${tone} tone.`,
    schema: z.object({
      content: z.string().describe("The generated post content"),
      hashtags: z.array(z.string()).describe("Relevant hashtags for the post"),
      bestTimeToPost: z.string().describe("Suggested time to post for maximum engagement"),
      engagementTips: z.string().describe("Tips to increase engagement for this post"),
    }),
  })

  return post
}

// Generate hashtag suggestions
export async function generateHashtagSuggestions({
  content,
  platform,
  count,
}: {
  content: string
  platform: string
  count: number
}) {
  const { object: hashtagData } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate ${count} relevant hashtags for a ${platform} post about: ${content}`,
    schema: z.object({
      hashtags: z.array(z.string()).describe("Suggested hashtags for the content"),
      trending: z.array(z.string()).describe("Currently trending hashtags that might be relevant"),
      niche: z.array(z.string()).describe("Niche or industry-specific hashtags"),
    }),
  })

  return hashtagData
}

// Analyze content for engagement potential
export async function analyzeContentEngagement({
  content,
  platform,
}: {
  content: string
  platform: string
}) {
  const { object: analysis } = await generateObject({
    model: geminiFlashModel,
    prompt: `Analyze this ${platform} post for engagement potential: ${content}`,
    schema: z.object({
      metrics: z.object({
        wordCount: z.number().describe("Number of words in the content"),
        characterCount: z.number().describe("Number of characters in the content"),
        hashtagCount: z.number().describe("Number of hashtags in the content"),
        mentionCount: z.number().describe("Number of mentions in the content"),
        urlCount: z.number().describe("Number of URLs in the content"),
      }),
      sentiment: z.enum(["positive", "neutral", "negative"]).describe("Overall sentiment of the content"),
      recommendations: z.array(z.string()).describe("Recommendations to improve engagement"),
      score: z.number().min(1).max(10).describe("Engagement potential score out of 10"),
    }),
  })

  return analysis
}

// Generate image prompt for social media
export async function generateImagePrompt({
  description,
  platform,
  style,
}: {
  description: string
  platform: string
  style: string
}) {
  const { object: imagePrompt } = await generateObject({
    model: geminiFlashModel,
    prompt: `Create a detailed image generation prompt for a ${style} style image for ${platform} based on: ${description}`,
    schema: z.object({
      prompt: z.string().describe("Detailed prompt for image generation"),
      aspectRatio: z.string().describe("Recommended aspect ratio for this platform"),
      style: z.string().describe("Visual style description"),
      elements: z.array(z.string()).describe("Key visual elements to include"),
      colors: z.array(z.string()).describe("Suggested color palette"),
    }),
  })

  return imagePrompt
}

// Generate content calendar
export async function generateContentCalendar({
  platform,
  topics,
  daysInAdvance,
}: {
  platform: string
  topics: string[]
  daysInAdvance: number
}) {
  const { object: calendar } = await generateObject({
    model: geminiFlashModel,
    prompt: `Generate a ${daysInAdvance}-day content calendar for ${platform} covering these topics: ${topics.join(", ")}`,
    output: "array",
    schema: z.object({
      date: z.string().describe("Date in YYYY-MM-DD format"),
      topic: z.string().describe("Topic for this post"),
      contentType: z.enum(["image", "video", "text", "carousel", "story"]).describe("Type of content"),
      bestTimeToPost: z.string().describe("Optimal time to post"),
      description: z.string().describe("Brief description of the post content"),
    }),
  })

  return { calendar }
}

// Create a schedule post object
export async function createScheduledPost({
  content,
  platform,
  scheduledTime,
  imageUrl,
}: {
  content: string
  platform: string
  scheduledTime: string
  imageUrl?: string
}) {
  // In a real app, this would connect to your database
  // For now, we'll just return a mock object
  const postId = Math.random().toString(36).substring(2, 15)

  return {
    postId,
    content,
    platform,
    scheduledTime,
    scheduledTimeFormatted: new Date(scheduledTime).toLocaleString(),
    status: "scheduled",
    createdAt: new Date().toISOString(),
    includesImage: !!imageUrl,
    imageUrl,
  }
}

// Connect social media account
export async function connectSocialMediaAccount({
  platform,
  username,
}: {
  platform: string
  username: string
}) {
  // In a real app, this would initiate OAuth flow
  // For now, we'll just return a mock object
  const accountId = Math.random().toString(36).substring(2, 15)

  return {
    accountId,
    platform,
    username,
    status: "connected",
    connectedAt: new Date().toISOString(),
    profileUrl: `https://${platform}.com/${username}`,
    followerCount: Math.floor(Math.random() * 10000),
  }
}

