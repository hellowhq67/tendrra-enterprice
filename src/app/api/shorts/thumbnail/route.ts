
import Replicate from "replicate";
import { NextRequest, NextResponse } from 'next/server';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "REPLICATE_API_TOKEN environment variable is not set." }, { status: 500 });
    }

    const model = "black-forest-labs/flux-schnell";

    const prediction = await replicate.run(model, {
      input: {
        prompt: `${prompt}, style: ${style}`,
      },
    });

    if (!prediction) {
      return NextResponse.json({ error: "Failed to generate image from Replicate." }, { status: 500 });
    }
    const images = Array.isArray(prediction) ? prediction : [prediction];

    return NextResponse.json({ images });

  } catch (error: any) {
    console.error("Replicate API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });

  }}