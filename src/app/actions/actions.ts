"use server";

import { convertToCoreMessages, Message, streamText } from "ai";
import { z } from "zod";

import { auth } from "../../../auth";
import { google } from '@ai-sdk/google';



export async function handleChatSubmission(id: string, messages: Array<Message>) {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0,
  );

  const result = await streamText({
    model:google('gemini-1.5-flash') ,
    system: `\n
        - You are a research assistant designed to help users with deep research, web searches, and document summarization.
        - Keep your responses concise and focused on the task.
        - Always verify information from reliable sources when performing web searches.
        - When summarizing files, extract key points and present them in a structured format.
        - When writing reports, ensure they are well-organized and include references to sources.
        - Ask follow-up questions to clarify user requirements.
      `,
    messages: coreMessages,
    tools: {
      webSearch: {
        description: "Perform a web search to gather information on a topic.",
        parameters: z.object({
          query: z.string().describe("Search query for the web search"),
        }),
        execute: async ({ query }) => {
          // Simulate a web search (replace with actual API call to a search engine)
          const searchResults = [
            { title: "Research Paper on AI", url: "https://example.com/ai-paper" },
            { title: "Latest Trends in Machine Learning", url: "https://example.com/ml-trends" },
          ];
          return searchResults;
        },
      },
      summarizeFile: {
        description: "Summarize the content of an uploaded file.",
        parameters: z.object({
          fileContent: z.string().describe("Content of the file to summarize"),
        }),
        execute: async ({ fileContent }) => {
          // Simulate summarization (replace with actual summarization logic)
          const summary = `Key points from the file:
          1. ${fileContent.split("\n")[0]}
          2. ${fileContent.split("\n")[1]}
          3. ${fileContent.split("\n")[2]}`;
          return summary;
        },
      },
      writeReport: {
        description: "Write a detailed report on a given topic.",
        parameters: z.object({
          topic: z.string().describe("Topic of the report"),
          sources: z.array(z.string()).describe("List of sources to include in the report"),
        }),
        execute: async ({ topic, sources }) => {
          // Simulate report writing (replace with actual report generation logic)
          const report = `Report on ${topic}:
          Introduction: ${topic} is an important area of research.
          Sources:
          - ${sources[0]}
          - ${sources[1]}
          
          `;
          return report;
        },
      },
    },
    onFinish: async (data) => {
      if (session.user && session.user.id) {
        try {
         console.log(data)
        } catch (error) {
          console.error("Failed to save chat");
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}