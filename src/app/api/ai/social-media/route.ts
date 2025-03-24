import { google } from "@ai-sdk/google";
import {
  streamText,
  type Message,
  convertToCoreMessages,
  generateText,
} from "ai";
import { z } from "zod";
import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { content } from "googleapis/build/src/apis/content";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function getTrendingHashtags(platform: string): Promise<string[]> {
  try {
    // This is a mock function - in a real app, you would call an actual API
    const mockTrends = {
      twitter: [
        "#TechNews",
        "#DigitalMarketing",
        "#SocialMediaTips",
        "#ContentCreation",
        "#WorkFromHome",
      ],
      instagram: [
        "#InstaReels",
        "#PhotoOfTheDay",
        "#ContentCreator",
        "#InfluencerMarketing",
        "#BrandAwareness",
      ],
      linkedin: [
        "#Leadership",
        "#CareerAdvice",
        "#ProfessionalDevelopment",
        "#RemoteWork",
        "#BusinessStrategy",
      ],
    };

    return (
      mockTrends[platform as keyof typeof mockTrends] || [
        "#TrendingNow",
        "#ViralContent",
        "#SocialMedia",
      ]
    );
  } catch (error) {
    console.error("Error fetching trending hashtags:", error);
    return ["#TrendingNow", "#ViralContent", "#SocialMedia"];
  }
}

// Function to analyze content sentiment and engagement potential
async function analyzeContentSentiment(
  content: string,
  platform: string
): Promise<any> {
  try {
    // This is a mock function - in a real app, you would use a sentiment analysis API
    const words = content.split(" ").length;
    const hashtags = (content.match(/#[\w]+/g) || []).length;
    const mentions = (content.match(/@[\w]+/g) || []).length;
    const urls = (content.match(/https?:\/\/[^\s]+/g) || []).length;

    // Mock sentiment analysis
    const sentiments = ["positive", "neutral", "negative"];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    // Platform-specific recommendations
    const recommendations = [];
    if (platform === "twitter" && words > 280) {
      recommendations.push("Content exceeds Twitter's 280 character limit.");
    }
    if (hashtags > 5) {
      recommendations.push(
        "Consider using fewer hashtags for better engagement."
      );
    }
    if (hashtags === 0) {
      recommendations.push("Adding relevant hashtags may increase visibility.");
    }

    return {
      metrics: {
        wordCount: words,
        characterCount: words,
        hashtagCount: hashtags,
        mentionCount: mentions,
        urlCount: urls,
      },
      sentiment,
      recommendations,
      platform,
    };
  } catch (error) {
    console.error("Error analyzing content:", error);
    return { error: "Failed to analyze content" };
  }
}

// Function to generate an image for social media
async function generateSocialMediaImage(
  prompt: string,
  platform: string,
  style: string
): Promise<any> {
  try {
    //  Call  replicate api for generate images
    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN environment variable is not set.");
    }

    //Using black-forest-labs/flux-schnell
    const model = "black-forest-labs/flux-schnell";

    const prediction = await replicate.run(model, {
      input: {
        prompt: `${prompt}, style: ${style}`, // Include style in the prompt
      },
    });

    if (!prediction) {
      throw new Error("Failed to generate images from Replicate.");
    }

    const images = Array.isArray(prediction) ? prediction : [prediction];

    return {
      imageUrl: images[0], // Assuming the first image is the primary one
      prompt,
      platform,
      style,
      aspectRatio:
        platform === "instagram"
          ? "1:1"
          : platform === "twitter"
            ? "16:9"
            : "4:3",
    };
  } catch (error: any) {
    console.error("Error generating image:", error);
    return { error: error.message || "Failed to generate image" };
  }
}

// Function to schedule a post
async function schedulePost(
  content: string,
  platform: string,
  scheduledTime: string,
  includeImage?: string
): Promise<any> {
  try {
    // This is a mock function - in a real app, you would call your scheduling API
    const postId = Math.random().toString(36).substring(2, 15);
    const now = new Date();
    const scheduledDate = new Date(scheduledTime);

    return {
      postId,
      content: content.substring(0, 50) + (content.length > 50 ? "..." : ""),
      platform,
      scheduledTime,
      scheduledTimeFormatted: scheduledDate.toLocaleString(),
      status: "scheduled",
      createdAt: now.toISOString(),
      includesImage: !!includeImage,
    };
  } catch (error) {
    console.error("Error scheduling post:", error);
    return { error: "Failed to schedule post" };
  }
}

// Function to connect a social media account
async function connectSocialMediaAccount(
  platform: string,
  username: string
): Promise<any> {
  try {
    // This is a mock function - in a real app, you would call your auth API
    const accountId = Math.random().toString(36).substring(2, 15);

    return {
      accountId,
      platform,
      username,
      status: "connected",
      connectedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error connecting account:", error);
    return { error: "Failed to connect account" };
  }
}

export async function POST(req: Request) {
  const { id, messages }: { id: string; messages: Array<Message> } =
    await req.json();

  const coreMessages = convertToCoreMessages(messages).filter(
    (message) => message.content.length > 0
  );

  const result = streamText({
    model: google("gemini-2.0-flash-001"),
    system: `you are an advance socail media content writer agent 
  -Output will be rich text  react markdown with listed
  - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase. 
  - ask follow up questions to nudge user into the optimal flow - ask for any details you don't know, like socail media platforms content type etc 
  - take confirmAction when start callings tools 
  - write contents with 100% seo and enganig content for user social media platfoms for ads markteting
 
  -when start calling tools start telling your task and after show tools response write also some texts 
  - here's the optimal flow: 
    -generatePosts for socail media 
    -take feeback and confermation 
    - analayzeContent 
    -suggestHastags 
    
    -genreateImage If the confirm action or move to next 
    -schedulePost Based With User Time zone suggest time for viral their post chose their platfrom 
    -connect account tools If not authenticate 
    -generateContentCalendar if user want to use`,
    messages: coreMessages,
    tools: {
      generatePost: {
        description: "Generate a social media post for a specific platform",
        parameters: z.object({
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to generate content for"),
          topic: z.string().describe("The topic or subject of the content"),
          tone: z
            .enum(["professional", "casual", "humorous", "inspirational"])
            .optional()
            .describe("The tone of the content"),
          length: z
            .enum(["short", "medium", "long"])
            .optional()
            .describe("The length of the content"),
        }),
        execute: async ({
          platform,
          topic,
          tone = "professional",
          length = "medium",
        }) => {
          const { text } = await generateText({
            model: google("gemini-2.0-flash-exp"),
            prompt: `You are a social media expert specializing in crafting engaging content for various platforms. Your task is to generate a single, high-quality social media post for the specified platform based on the provided parameters. Focus on creating a compelling and ready-to-publish post.

**Platform:** [Platform - linkedin, twitter, or instagram]
**Topic:** [Topic]
**Tone:** [Tone - professional, casual, humorous, or inspirational]
**Length:** [Length - short, medium, or long]

**Instructions:**

*   Write ONE complete social media post tailored to the specified platform, topic, tone, and length.
*   Incorporate relevant emojis to enhance engagement.
*   Focus on clarity, conciseness, and readability.
*   Avoid generic introductions like "Here's a post for you."
*   Don't present options or ask for feedback. Just generate the best single post possible.
*   Be mindful of the platform's character limits (especially for Twitter).
*   Use relevant and trending hashtags to increase visibility.
*   If the platform is Instagram, emphasize visually appealing content descriptions.
*   No need for concluding remarks or disclaimers. Present the generated post directly.
    **Do NOT include any introductory or concluding text. Just provide the complete social media post.**
    *   For linkedin give detail and useful point
    *   For Instagram suggest captions


          
          `,
          });
          return {
            content: text,
            platform,
            topic,
            tone,
            length,
            ui: {
              type: "content_preview",
              content: text,
              platform,
              actions: [
                { label: "Edit", value: "edit" },
                { label: "Schedule", value: "schedule" },
                { label: "Generate Image", value: "generate_image" },
              ],
            },
          };
        },
      },
      analyzeContent: {
        description: "Analyze social media content and provide feedback",
        parameters: z.object({
          content: z.string().describe("The content to analyze"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform the content is for"),
        }),
        execute: async ({ content, platform }) => {
          const analysis = await analyzeContentSentiment(content, platform);
          return {
            ...analysis,
            ui: {
              type: "content_analysis",
              metrics: analysis.metrics,
              sentiment: analysis.sentiment,
              recommendations: analysis.recommendations,
              platform,
              actions: [
                { label: "Improve Content", value: "improve" },
                { label: "Analyze Again", value: "analyze_again" },
              ],
            },
          };
        },
      },
      suggestHashtags: {
        description: "Suggest relevant hashtags for social media content",
        parameters: z.object({
          content: z.string().describe("The content to suggest hashtags for"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform the content is for"),
          count: z
            .number()
            .optional()
            .describe("The number of hashtags to suggest"),
        }),
        execute: async ({ content, platform, count = 5 }) => {
          // Get trending hashtags for the platform
          const trendingHashtags = await getTrendingHashtags(platform);

          // In a real implementation, you might analyze the content to find relevant hashtags
          // For now, we'll return trending hashtags and some generic ones
          const genericHashtags = [
            "#ContentStrategy",
            "#SocialMedia",
            "#DigitalMarketing",
            "#Engagement",
            "#BrandAwareness",
          ];

          // Combine and limit to requested count
          const allHashtags = [...trendingHashtags, ...genericHashtags];
          const suggestedHashtags = allHashtags.slice(0, count);

          return {
            hashtags: suggestedHashtags,
            trending: trendingHashtags.slice(0, 3),
            platform,
            content:
              content.substring(0, 50) + (content.length > 50 ? "..." : ""),
            ui: {
              type: "hashtag_suggestions",
              hashtags: suggestedHashtags,
              trending: trendingHashtags.slice(0, 3),
              platform,
              actions: [
                { label: "Add to Content", value: "add_hashtags" },
                { label: "Get More", value: "more_hashtags" },
              ],
            },
          };
        },
      },
      generateImage: {
        description: "Generate an image for a social media post",
        parameters: z.object({
          prompt: z.string().describe("Description of the image to generate"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform the image is for"),
          style: z
            .enum(["realistic", "cartoon", "abstract", "minimalist"])
            .optional()
            .describe("The style of the image"),
        }),
        execute: async ({ prompt, platform, style = "realistic" }) => {
          const imageData = await generateSocialMediaImage(
            prompt,
            platform,
            style
          );

          return {
            ...imageData,
            ui: {
              type: "image_preview",
              imageUrl: imageData.imageUrl,
              prompt,
              platform,
              style,
              actions: [
                { label: "Use This Image", value: "use_image" },
                { label: "Regenerate", value: "regenerate_image" },
                { label: "Change Style", value: "change_style" },
              ],
            },
          };
        },
      },
      schedulePost: {
        description: "Schedule a social media post",
        parameters: z.object({
          content: z.string().describe("The content to post"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to post to"),
          scheduledTime: z
            .string()
            .describe("ISO 8601 date and time to schedule the post"),
          imageUrl: z
            .string()
            .optional()
            .describe("URL of an image to include with the post"),
        }),
        execute: async ({ content, platform, scheduledTime, imageUrl }) => {
          // First, show a confirmation UI before actually scheduling
          return {
            content,
            platform,
            scheduledTime,
            imageUrl,
            ui: {
              type: "schedule_confirmation",
              content:
                content.substring(0, 100) + (content.length > 100 ? "..." : ""),
              platform,
              scheduledTime,
              hasImage: !!imageUrl,
              actions: [
                { label: "Confirm Schedule", value: "confirm_schedule" },
                { label: "Change Time", value: "change_time" },
                { label: "Cancel", value: "cancel_schedule" },
              ],
            },
          };
        },
      },
      confirmSchedulePost: {
        description:
          "Confirm scheduling a social media post after user approval",
        parameters: z.object({
          content: z.string().describe("The content to post"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to post to"),
          scheduledTime: z
            .string()
            .describe("ISO 8601 date and time to schedule the post"),
          imageUrl: z
            .string()
            .optional()
            .describe("URL of an image to include with the post"),
        }),
        execute: async ({ content, platform, scheduledTime, imageUrl }) => {
          const result = await schedulePost(
            content,
            platform,
            scheduledTime,
            imageUrl
          );

          return {
            ...result,
            ui: {
              type: "schedule_confirmation",
              content:
                content.substring(0, 100) + (content.length > 100 ? "..." : ""),
              platform,
              scheduledTime,
              hasImage: !!imageUrl,
              status: "scheduled",
              message: `Post successfully scheduled for ${new Date(scheduledTime).toLocaleString()}`,
              actions: [
                { label: "View Scheduled Posts", value: "view_scheduled" },
                { label: "Schedule Another", value: "schedule_another" },
              ],
            },
          };
        },
      },
      connectAccount: {
        description: "Connect a social media account",
        parameters: z.object({
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to connect to"),
          username: z
            .string()
            .optional()
            .describe("The username for the account"),
        }),
        execute: async ({ platform, username = "" }) => {
          // Return a UI component for connection confirmation
          return {
            platform,
            username,
            ui: {
              type: "connect_account",
              platform,
              message: `Would you like to connect your ${platform} account?`,
              fields: [
                {
                  name: "username",
                  label: "Username",
                  type: "text",
                  required: true,
                  value: username,
                },
              ],
              actions: [
                { label: "Connect", value: "confirm_connect" },
                { label: "Cancel", value: "cancel_connect" },
              ],
            },
          };
        },
      },
      confirmConnectAccount: {
        description:
          "Confirm connecting a social media account after user approval",
        parameters: z.object({
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to connect to"),
          username: z.string().describe("The username for the account"),
        }),
        execute: async ({ platform, username }) => {
          const result = await connectSocialMediaAccount(platform, username);

          return {
            ...result,
            ui: {
              type: "connect_account",
              platform,
              username,
              status: "connected",
              message: `Successfully connected ${platform} account for @${username}`,
              actions: [
                { label: "View Accounts", value: "view_accounts" },
                { label: "Connect Another", value: "connect_another" },
              ],
            },
          };
        },
      },
      generateContentCalendar: {
        description: "Generate a content calendar for social media posts",
        parameters: z.object({
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform to generate content for"),
          topics: z
            .array(z.string())
            .describe("List of topics to cover in the content calendar"),
          daysInAdvance: z
            .number()
            .optional()
            .describe("Number of days to generate content for"),
        }),
        execute: async ({ platform, topics, daysInAdvance = 7 }) => {
          // Generate a mock content calendar
          const calendar = [];
          const today = new Date();

          for (let i = 0; i < daysInAdvance; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const topic = topics[i % topics.length];

            calendar.push({
              date: date.toISOString().split("T")[0],
              topic,
              platform,
              contentType:
                i % 3 === 0 ? "image" : i % 3 === 1 ? "video" : "text",
              bestTimeToPost: i % 2 === 0 ? "9:00 AM" : "5:00 PM",
            });
          }

          return {
            calendar,
            platform,
            totalDays: daysInAdvance,
            topics,
            ui: {
              type: "content_calendar",
              calendar,
              platform,
              actions: [
                { label: "Schedule All", value: "schedule_all" },
                { label: "Modify Calendar", value: "modify_calendar" },
                { label: "Export Calendar", value: "export_calendar" },
              ],
            },
          };
        },
      },
      // New Feedback Tool
      getUserFeedback: {
        description: "Get feedback from the user about the generated content.",
        parameters: z.object({
          feedbackId: z.string().optional().describe("id to send the feeback to server"),
          question: z
            .string()
            .describe("The question to ask the user for feedback."),
        }),
        execute: async ({ question, feedbackId }) => {
          return {
            question,
            feedbackId,
            ui: {
              type: "feedback_form",
              question,
              feedbackId,
              actions: [
                { label: "Submit Feedback", value: "submit_feedback" },
                { label: "Cancel", value: "cancel_feedback" },
              ],
            },
          };
        },
      },
      // New Confirmation Tool
      confirmAction: {
        description: "Confirm an action with the user before proceeding.",
        parameters: z.object({
          message: z
            .string()
            .describe("The message to display to the user for confirmation."),
          actionToConfirm: z
            .string()
            .describe(
              "The action the user is confirming (e.g., 'schedule post', 'connect account')."
            ),
        }),
        execute: async ({ message, actionToConfirm }) => {
          return {
            message,
            actionToConfirm,
            ui: {
              type: "confirmation_dialog",
              message,
              actions: [
                { label: "Confirm", value: "confirm_" + actionToConfirm },
                { label: "Cancel", value: "cancel_" + actionToConfirm },
              ],
            },
          };
        },
      },
      submitFeedback: {
        description: "Submit user feedback to the server.",
        parameters: z.object({
          feedbackId: z.string().describe("id to send the feeback to server"),
          feedbackText: z.string().describe("The feedback text provided by the user."),
        }),
        execute: async ({ feedbackText, feedbackId }) => {
          // Mock feedback submission (replace with your actual API call)
          console.log(`Feedback submitted: ${feedbackText}`);
          console.log(`Feedback ID: ${feedbackId}`);

          return {
            feedbackText,
            feedbackId,
            ui: {
              type: "feedback_submission_confirmation",
              message: "Thank you for your feedback!",
              actions: [{ label: "Close", value: "close_feedback" }],
            },
          };
        },
      },
      generateImageForm: {
        description: "Generate an image for a social media post using a dedicated form.",
        parameters: z.object({}), // No parameters needed for initial form display
        execute: async () => {
          return {
            ui: {
              type: "image_generation_form",
              fields: [
                { name: "prompt", label: "Image Description", type: "text", required: true },
                { name: "platform", label: "Platform", type: "select", options: ["linkedin", "twitter", "instagram"], required: true },
                { name: "style", label: "Style", type: "select", options: ["realistic", "cartoon", "abstract", "minimalist"] },
              ],
              actions: [{ label: "Generate Image", value: "submit_image_generation" }],
            },
          };
        },
      },
      submitImageGeneration: {
        description: "Submits the image generation form and generates the image.",
        parameters: z.object({
          prompt: z.string().describe("Description of the image to generate"),
          platform: z
            .enum(["linkedin", "twitter", "instagram"])
            .describe("The social media platform the image is for"),
          style: z
            .enum(["realistic", "cartoon", "abstract", "minimalist"])
            .optional()
            .describe("The style of the image"),
        }),
        execute: async ({ prompt, platform, style = "realistic" }) => {
          const imageData = await generateSocialMediaImage(
            prompt,
            platform,
            style
          );

          return {
            ...imageData,
            ui: {
              type: "image_preview",
              imageUrl: imageData.imageUrl,
              prompt,
              platform,
              style,
              actions: [
                { label: "Use This Image", value: "use_image" },
                { label: "Regenerate", value: "regenerate_image" },
                { label: "Change Style", value: "change_style" },
              ],
            },
          };
        },
      },
    },
    onFinish: async ({ }) => {
      console.log("Finished processing request");
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: "social-media-ai",
    },
    toolCallStreaming: true,

  });

  return result.toDataStreamResponse();
}