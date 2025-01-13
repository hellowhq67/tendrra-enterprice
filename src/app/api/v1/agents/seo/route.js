import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const geminiApiKey = process.env.GOOGLE_AI_API_KEY;

// check for api key
if (!geminiApiKey) {
  throw new Error(
    "GOOGLE_API_KEY is not set in environment variables. Please create .env.local file or set the env variable in other way."
  );
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// using the gemini-1.5-flash model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function extractJson(text) {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(jsonRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // try to directly extract if there is no code block

  try {
    JSON.parse(text);
    return text;
  } catch (e) {
    console.log("no json codeblock and direct text failed: ", e);
    return null;
  }
}

export async function POST(request) {
  try {
    const { websiteUrl } = await request.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: "Website URL is required" },
        { status: 400 }
      );
    }
    const prompt = `Analyze the provided website URL: ${websiteUrl}. Please provide a comprehensive SEO analysis with the following information:
    
    1. *Backlink Suggestions:* Suggest at least 5 relevant websites where we could potentially gain backlinks. For each backlink suggestion, include the website URL and a brief description of why it's relevant. Present this as a JSON array under the key "backlinkSuggestions". 

    2. *On-Page SEO Keywords:* Recommend 5-10 high-impact keywords relevant to the website's content. For each keyword, provide the keyword itself and an estimated monthly search volume. Present this as a JSON array under the key "onPageKeywords".
    
    3.  *Total Impression:* Estimate the website's total potential monthly impressions based on the identified keywords and the website's industry. Present this as a numeric value under the key "totalImpressions".
    
    4.  *Meta Keyword Suggestions:* Suggest a set of relevant meta keywords for the website. Present this as a JSON array under the key "metaKeywords".
    
    5. *Content SEO Title Keywords:* Recommend 5 SEO-friendly title suggestions based on the website's topic. Present this as a JSON array under the key "titleSuggestions".
    
    Return all the data as a structured JSON object with the keys "backlinkSuggestions", "onPageKeywords", "totalImpressions", "metaKeywords", and "titleSuggestions".
  `;

    const generationConfig = {
      maxOutputTokens: 2048, // Increased max output
    };

    const parts = [{ text: prompt }];

    const result = await model.generateContent({
      contents: [{ parts }],
      generationConfig,
    });

    const response = await result.response;
    const text = response.text();

    // Extract JSON from the response
    const jsonString = extractJson(text);

    if (!jsonString) {
      return NextResponse.json(
        {
          error: "Failed to extract JSON response from Gemini.",
          fullResponse: text,
        },
        { status: 500 }
      );
    }

    // Try to parse the response as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return NextResponse.json(
        {
          error: "Failed to parse JSON response from Gemini.",
          fullResponse: text,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error generating SEO content:", error);
    return NextResponse.json(
      { error: "Failed to generate SEO content" },
      { status: 500 }
    );
  }
}
