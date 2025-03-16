import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { title, topic, description, tone, length = "30" } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = `# ${title || "YouTube Short"}

This is a ${tone} script about ${topic}.

${description ? `Description: ${description}` : ""}

## Introduction
- Hook the viewer with an interesting fact about ${topic}
- Introduce yourself and what you'll be covering

## Main Content
- Point 1: Key information about ${topic}
- Point 2: Interesting facts or statistics
- Point 3: Why this matters to the viewer

## Conclusion
- Summarize the key points
- Call to action: Like, subscribe, and comment

This script is designed to be approximately ${length} seconds long.`;

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: prompt,
    });

    // Basic Keyword Extraction (Improve this with more sophisticated NLP if needed)
    const keywords = [
      topic.toLowerCase(),
      ...topic.toLowerCase().split(" "),
      tone,
      `${tone} ${topic}`,
      "youtube shorts",
      "short form content",
    ].filter((value, index, self) => self.indexOf(value) === index && value.length > 3);

    const seoScore = Math.floor(Math.random() * 36) + 60

      const contentAnalysis = {
        engagement: Math.floor(Math.random() * 31) + 70,
        clarity: Math.floor(Math.random() * 31) + 70,
        originality: Math.floor(Math.random() * 31) + 70,
        suitability: Math.floor(Math.random() * 31) + 70,
      }


    return NextResponse.json({ text, keywords, seoScore, contentAnalysis });

  } catch (error) {
    console.error("Error generating text:", error);
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 });
  }
}