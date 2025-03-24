import { generateText, streamText } from "ai"

import {google} from "@ai-sdk/google"
import { NextResponse } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { workflow, email, action } = await req.json()

  let prompt = ""
  switch (action) {
    case "analyze":
      prompt = `Analyze the following email and provide insights based on the workflow "${workflow.name}":
        Subject: ${email.subject}
        Content: ${email.content}
        
        Provide analysis in the following format:
        - Sentiment: (positive/negative/neutral)
        - Priority: (high/medium/low)
        - Category: (support/sales/general)
        - Key Points: (bullet points)
        - Suggested Action: (what should be done)`
      break
    case "generate":
      prompt = `Generate a response for the following email based on the workflow "${workflow.name}":
        Subject: ${email.subject}
        Content: ${email.content}
        Tone: ${workflow.tone || "professional"}
        
        The response should be:
        1. Professional and courteous
        2. Address the specific points in the email
        3. Include a clear next action or request
        4. End with an appropriate signature`
      break
    default:
      throw new Error("Invalid action")
  }

  const {text} = await generateText({
    model:google("gemini-2.0-flash-exp"),
    system: "You are an AI assistant helping with email workflow automation.",
    messages: [{ role: "user", content: prompt }],
  })

  return NextResponse.json({text})
}
