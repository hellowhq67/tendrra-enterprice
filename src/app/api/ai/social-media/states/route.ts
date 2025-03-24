import { NextResponse } from "next/server"
import { z } from "zod"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Define the schema for the request body
const aiStateSchema = z.object({
  state: z.enum(["post", "article", "tweet", "hashtag"]),
  prompt: z.string(),
  platform: z.enum(["linkedin", "twitter", "instagram"]).optional(),
  tone: z.enum(["professional", "casual", "humorous", "inspirational"]).optional(),
})

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json()
    const { state, prompt, platform = "linkedin", tone = "professional" } = aiStateSchema.parse(body)

    let systemPrompt = ""
    const userPrompt = prompt

    // Set the system prompt based on the AI state
    switch (state) {
      case "post":
        systemPrompt = `You are a ${platform} content expert. Create professional, engaging posts that drive engagement and demonstrate thought leadership.`
        break
      case "article":
        systemPrompt =
          "You are a professional content writer specializing in long-form articles. Create well-structured, informative content with proper headings, paragraphs, and a compelling narrative."
        break
      case "tweet":
        systemPrompt =
          "You are a Twitter/X expert. Create concise, engaging tweets that fit within character limits and drive engagement. Use appropriate hashtags sparingly."
        break
      case "hashtag":
        systemPrompt =
          "You are a hashtag optimization specialist. Suggest relevant, trending hashtags that will increase content visibility and engagement."
        break
    }

    // Generate content based on the AI state
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    // Return the generated content
    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Error in AI state API:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

