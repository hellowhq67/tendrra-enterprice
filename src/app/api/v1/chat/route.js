import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from "next/server";

const client = new BedrockRuntimeClient({
  region:'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
      body: JSON.stringify({
        messages: [{ role: "user", content: text }],
        max_tokens: 1024,
        temperature: 0,
      }),
    });

    const response = await client.send(command);

    // Read and parse response body
    const body = await new Promise((resolve, reject) => {
      let data = "";
      response.body.on("data", (chunk) => {
        data += chunk;
      });
      response.body.on("end", () => {
        resolve(data);
      });
      response.body.on("error", (err) => {
        reject(err);
      });
    });

    const parsedBody = JSON.parse(body);
    const result = parsedBody?.content?.[0]?.text || "No response content available.";

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error in API handler:", error);
    return NextResponse.json(
      { error: error.message || "An unknown error occurred." },
      { status: 500 }
    );
  }
}
