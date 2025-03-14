import { NextResponse } from "next/server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini Pro (Replace with your actual API Key)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const AGENT_TASK =
    "You are a helpful assistant. Respond appropriately to user requests. If the request includes intent to find business details or locations, you will return a 'lead_gen' type, otherwise, return a 'conversational' type";

async function makeSerperRequest(query) {
    const data = JSON.stringify({
        q: query,
    });

    const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://google.serper.dev/maps",
        headers: {
            "X-API-KEY": process.env.SERPER_API_KEY, // Use environment variable here
            "Content-Type": "application/json",
        },
        data: data,
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error("Error in Serper API request:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Serper API Response Status:", error.response.status);
            console.error("Serper API Response Data:", error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Serper API Request Error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Serper API Error Message:", error.message);
        }
        throw new Error("Failed to fetch data from Serper API");
    }
}

async function generateGeminiResponse(prompt) {
    try {
        const combinedPrompt = `${AGENT_TASK}\n\nUser Prompt: ${prompt}`;
        const result = await model.generateContent(combinedPrompt);
        const response = await result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error in Gemini API request:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Gemini API Response Status:", error.response.status);
            console.error("Gemini API Response Data:", error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("Gemini API Request Error:", error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Gemini API Error Message:", error.message);
        }
        throw new Error("Failed to generate a response with Gemini API");
    }
}

function processSerperData(serperData) {
    if (!serperData || !serperData.places || !Array.isArray(serperData.places)) {
        return [];
    }

    return serperData.places.map((place) => {
        const { title, address, website, phoneNumber } = place;

        // Attempt email extraction (very basic, may not catch all)
        let email = null;
        if (website) {
            const emailMatch = website.match(
                /mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
            );
            if (emailMatch && emailMatch[1]) {
                email = emailMatch[1];
            }
        }

        return {
            title: title || "N/A",
            address: address || "N/A",
            website: website || "N/A",
            phoneNumber: phoneNumber || "N/A",
            email: email || "N/A",
        };
    });
}

// Update the lead detection regex to be more lenient
const leadGenRegex = /\b(find|search|look|show|locate|get|list|business|company|store|shop|restaurant)\b/i;

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Simplify the logic to prioritize lead generation
        if (leadGenRegex.test(prompt)) {
            const serperData = await makeSerperRequest(prompt);
            const processedData = processSerperData(serperData);
            return NextResponse.json({ 
                type: "lead_gen", 
                data: processedData,
                response: `Found ${processedData.length} business leads.`
            });
        } else {
            const geminiResponse = await generateGeminiResponse(prompt);
            return NextResponse.json({
                type: "conversational",
                response: geminiResponse
            });
        }
    } catch (error) {
        console.error("Error in POST request:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred" },
            { status: 500 }
        );
    }
}