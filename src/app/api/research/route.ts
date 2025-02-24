import { google } from "@ai-sdk/google";
import { streamText, Message, convertToCoreMessages } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from 'axios';
import * as cheerio from 'cheerio';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY; // Store your API key in an environment variable

async function getSocialMediaLinks(websiteUrl: string): Promise<string[]> {
    try {
        const response = await axios.get(websiteUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        const socialLinks: string[] = [];

        // Common social media link patterns
        $('a[href*="facebook.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="twitter.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="instagram.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="linkedin.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="youtube.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="pinterest.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });
        $('a[href*="tiktok.com"]').each((i, el) => { socialLinks.push($(el).attr('href') || '') });

        return socialLinks.filter(link => link !== ''); // Remove empty strings
    } catch (error) {
        console.error("Error fetching social media links:", error);
        return [];
    }
}

async function searchTavilyForSocialLinks(companyName: string): Promise<string[]> {
    try {
        const searchQuery = `${companyName} social media links`;
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TAVILY_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: searchQuery,
                max_results: 5 // Limit results to a reasonable number
            })
        };

        const response = await fetch('https://api.tavily.com/search', options);
        const searchData = await response.json();

        if (searchData.results && searchData.results.length > 0) {
            const socialLinks: string[] = [];
            searchData.results.forEach((result: any) => {
                if (result.url) {
                    if (result.url.includes("facebook.com") ||
                        result.url.includes("twitter.com") ||
                        result.url.includes("instagram.com") ||
                        result.url.includes("linkedin.com") ||
                        result.url.includes("youtube.com") ||
                        result.url.includes("pinterest.com") ||
                        result.url.includes("tiktok.com")) {
                        socialLinks.push(result.url);
                    }
                }
            });
            return socialLinks;
        } else {
            return []; // No results found
        }
    } catch (error) {
        console.error("Error searching Tavily:", error);
        return [];
    }
}

export async function POST(req: Request) {
    const { id, messages }: { id: string; messages: Array<Message> } =
        await req.json();
    const coreMessages = convertToCoreMessages(messages).filter(
        (message) => message.content.length > 0
    );

    const result = streamText({
        model: google("gemini-1.5-flash"),
        system: `You are a highly skilled and resourceful research assistant, specializing in synthesizing complex information into easily digestible summaries. Your primary goal is to provide concise, accurate, and insightful answers to user queries.  You excel at deep thinking and meticulous research, leveraging a structured and iterative approach to deliver exceptional results.  You are an expert in using Markdown for clear and beautiful presentation.  You prioritize using Tools when needed to get the best results.

    **Research Process:**

    1. **Query Understanding and Refinement:**  Carefully analyze the user's query to understand the core need and desired outcome. Ask clarifying questions if necessary to ensure accurate interpretation.  If the initial query is broad, propose a refined, more focused research question for user approval.

    2. **Report Plan Generation & Human Feedback:**
       * Create a detailed outline of the research report, including key sections, subtopics, and potential data sources.  Consider different perspectives and angles related to the query.
       * Present the report plan to the user, clearly explaining the proposed structure and content.  Solicit feedback and revisions before proceeding.  Acknowledge and incorporate user suggestions to improve the plan.

    3. **Section Completion with Human Feedback:**
       * Systematically research and draft each section of the report, adhering to the approved outline.
       * Prioritize reputable and reliable sources.  Cite sources appropriately.
       * Present each completed section to the user for review and feedback.  Actively seek suggestions for improvement in clarity, accuracy, and completeness.
       * Incorporate user feedback into the section drafts before moving on.

    4. **Final Section Writing:** After incorporating feedback on the main sections, craft a compelling conclusion that summarizes the key findings and insights derived from the research.  Consider including recommendations or future directions for further exploration.

    5. **Final Report Compilation & Markdown Formatting:**
       * Assemble all completed sections into a cohesive and well-structured final report.
       * Utilize Markdown formatting to enhance readability and visual appeal.  This includes:
         * **Headings and Subheadings:**  Clearly delineate sections and subtopics for easy navigation.
         * **Bullet Points and Numbered Lists:**  Present information in a concise and organized manner.
         * **Bold and Italic Text:**  Emphasize key terms and concepts.
         * **Code Blocks:**  Format code snippets for clarity.
         * **Tables:**  Organize data for easy comparison and analysis.
         * **Links:**  Provide references to source materials and external resources.
         * **Images (if applicable):**  Incorporate relevant visuals to support the text.
         * **Clear and concise language:**  Avoid jargon and overly complex sentence structures.

    **Tool Use:**

    - You are encouraged to use the available tools (tavilysearchTool, tavilyExtractTool, and getCompetitorSocialLinks) to gather relevant information.
    - Always consider which tool is most appropriate for the task.
    - Before using a tool, double-check the required parameters and ensure they are accurately specified.
    - When presenting tool responses, format them clearly and concisely, highlighting the key findings.
    - Explain the tool responses to the user in a way that is easy to understand.
    - Prioritize using Tools to look for up to date accurate information instead of reling on your own internal knowledge.

    **Example Interaction:**

    User: "Explain the current state of AI research in the medical field."

    Assistant: "Okay, I can research the current state of AI research in the medical field. To ensure I provide the most useful report, would you prefer a broad overview or a more focused analysis on a specific area, such as AI-powered diagnostics or drug discovery?" (Clarifying Question)
      `,
        messages: coreMessages,
        tools: {
            tavilysearchTool: {
                description: "Search the web using Tavily API", // Add a helpful description
                parameters: z.object({
                    query: z.string().describe("The search query to use"),
                    topic: z.string().optional().describe("The general topic of the query"),
                    search_depth: z.enum(["basic", "advanced"]).optional().describe("The depth of the search"),
                    max_results: z.number().int().optional().describe("The maximum number of results to return"),
                    time_range: z.string().optional().describe("The time range to search within"),
                    days: z.number().int().optional().describe("The number of days to search within"),
                    include_answer: z.boolean().optional().describe("Whether to include an answer"),
                    include_raw_content: z.boolean().optional().describe("Whether to include raw content"),
                    include_images: z.boolean().optional().describe("Whether to include images"),
                    include_image_descriptions: z.boolean().optional().describe("Whether to include image descriptions"),
                    include_domains: z.array(z.string()).optional().describe("A list of domains to include in the search"),
                    exclude_domains: z.array(z.string()).optional().describe("A list of domains to exclude from the search"),
                }),
                execute: async ({ query, topic, search_depth, max_results, time_range, days, include_answer, include_raw_content, include_images, include_image_descriptions, include_domains, exclude_domains }) => {
                    const options = {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${TAVILY_API_KEY}`, // Use the API key from the environment variable
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            query: query,
                            topic: topic,
                            search_depth: search_depth,
                            max_results: max_results,
                            time_range: time_range,
                            days: days,
                            include_answer: include_answer,
                            include_raw_content: include_raw_content,
                            include_images: include_images,
                            include_image_descriptions: include_image_descriptions,
                            include_domains: include_domains,
                            exclude_domains: exclude_domains
                        })
                    };

                    try {
                        const response = await fetch('https://api.tavily.com/search', options);
                        const searchData = await response.json();

                        // Structure the response in a more readable format
                        const structuredResponse = `
              **Tavily Search Results:**

              **Query:** ${query}
              ${searchData.answer ? `\n**Answer:** ${searchData.answer}` : ""}
              ${searchData.results && searchData.results.length > 0 ? `\n**Results:**\n${searchData.results.map((result: any, index: number) => `\n  ${index + 1}. **${result.title}**\n     URL: ${result.url}\n     Content: ${result.content}`).join('')}` : ""}

              **Response Time:** ${searchData.response_time} seconds
            `;

                        return structuredResponse;

                    } catch (err) {
                        console.error(err);
                        return { error: "Failed to fetch data from Tavily API" }; // Handle errors gracefully
                    }
                },
            },
            tavilyExtractTool: {
                description: "Extract web page content from one or more specified URLs using Tavily Extract.",
                parameters: z.object({
                    urls: z.string().describe("A single URL or comma-separated list of URLs to extract content from."),
                    include_images: z.boolean().optional().describe("Whether to include images in the extracted content."),
                    extract_depth: z.enum(["basic", "advanced"]).optional().describe("The depth of extraction."),
                }),
                execute: async ({ urls, include_images, extract_depth }) => {
                    const options = {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${TAVILY_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            urls: urls,
                            include_images: include_images,
                            extract_depth: extract_depth
                        })
                    };

                    try {
                        const response = await fetch('https://api.tavily.com/extract', options);
                        const extractData = await response.json();

                        // Structure the response
                        const structuredResponse = `
            **Tavily Extract Results:**

            ${extractData.results && extractData.results.length > 0 ? `\n**Results:**\n${extractData.results.map((result: any, index: number) => `\n  ${index + 1}. **URL: ${result.url}**\n     Raw Content: ${result.raw_content ? result.raw_content.substring(0, 500) + '...' : 'No content extracted'}`).join('')}` : "\n No results found."}

            ${extractData.failed_results && extractData.failed_results.length > 0 ? `\n**Failed Results:**\n${extractData.failed_results.map((result: any, index: number) => `\n  ${index + 1}. URL: ${result} - Failed to extract`).join('')}` : ""}

            **Response Time:** ${extractData.response_time} seconds
            `;

                        return structuredResponse;
                    } catch (err) {
                        console.error(err);
                        return { error: "Failed to fetch data from Tavily Extract API" };
                    }
                },
            },
            getCompetitorSocialLinks: {
                description: "Fetch social media links from a competitor's website.  If direct scraping fails, uses Tavily to search for links.",
                parameters: z.object({
                    websiteUrl: z.string().describe("The URL of the competitor's website."),
                    companyName: z.string().optional().describe("The name of the company (if different from the website URL) - helps Tavily search"),
                }),
                execute: async ({ websiteUrl, companyName }) => {
                    try {
                        let socialLinks = await getSocialMediaLinks(websiteUrl);

                        if (socialLinks.length === 0) {
                            // If direct scraping fails, use Tavily search
                            const nameToSearch = companyName || websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0]; // Extract company name from URL if not provided
                            socialLinks = await searchTavilyForSocialLinks(nameToSearch);

                            if (socialLinks.length === 0) {
                                return `No social media links found on ${websiteUrl} (direct scraping failed). Tavily search also yielded no results. You may need to manually search for their social media presence.`;
                            } else {
                                const formattedLinks = socialLinks.map(link => `- ${link}`).join('\n');
                                return `**Social Media Links found via Tavily search for ${nameToSearch}:**\n${formattedLinks}\n(Direct scraping of ${websiteUrl} failed)`;
                            }
                        } else {
                            const formattedLinks = socialLinks.map(link => `- ${link}`).join('\n');
                            return `**Social Media Links found on ${websiteUrl}:**\n${formattedLinks}`;
                        }
                    } catch (error) {
                        console.error("Error fetching social media links:", error);
                        return { error: `Failed to fetch social media links from ${websiteUrl}` };
                    }
                },
            },
        },


        onFinish: async ({}) => {
            return console.log(coreMessages);
        },
        experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
        },
    });

    return result.toDataStreamResponse({});
}