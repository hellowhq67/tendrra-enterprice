<<<<<<< HEAD
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { tone, templateType, keywords, companyImage } = await req.json();

    let prompt = `Generate a ${tone} email template for ${templateType} purposes.
            Include the following keywords/topics if provided: ${keywords}.
            The template should be professional and include placeholders for customization.
            Format the response with clear sections for subject line and body.`;

    if (templateType === "html-template") {
        prompt = `Generate a complete HTML email template with inline CSS styling, optimized for mobile responsiveness, in a ${tone} tone.
            The template should be for ${keywords || 'a general purpose email'}. Ensure cross-client compatibility. 
            Include placeholders where appropriate.  Only respond with the raw HTML code with valid HTML tags.  Do not include explanation.`;

        if (companyImage) {
            prompt += ` Include the following base64 encoded company logo in the header of the email: ${companyImage}`; 
        }
    }

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: prompt,
        });

        return NextResponse.json({ text });

    } catch (error) {
        console.error("Error generating text:", error);
        return NextResponse.json({ error: "Failed to generate template" }, { status: 500 });
    }
=======
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { tone, templateType, keywords, companyImage } = await req.json();

    let prompt = `Generate a ${tone} email template for ${templateType} purposes.
            Include the following keywords/topics if provided: ${keywords}.
            The template should be professional and include placeholders for customization.
            Format the response with clear sections for subject line and body.`;

    if (templateType === "html-template") {
        prompt = `Generate a complete HTML email template with inline CSS styling, optimized for mobile responsiveness, in a ${tone} tone.
            The template should be for ${keywords || 'a general purpose email'}. Ensure cross-client compatibility. 
            Include placeholders where appropriate.  Only respond with the raw HTML code with valid HTML tags.  Do not include explanation.`;

        if (companyImage) {
            prompt += ` Include the following base64 encoded company logo in the header of the email: ${companyImage}`; 
        }
    }

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt: prompt,
        });

        return NextResponse.json({ text });

    } catch (error) {
        console.error("Error generating text:", error);
        return NextResponse.json({ error: "Failed to generate template" }, { status: 500 });
    }
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
}