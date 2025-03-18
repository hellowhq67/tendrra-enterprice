import { type NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { text, voice, speed, projectId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN environment variable is not set." },
        { status: 500 }
      );
    }

    const model =
      "elevenlabs/tts:11f1e9f16971b061cd739e99a8acbc8a116063e461ee19a00d381963244a0025";

    const output = await replicate.run(model, {
      input: {
        text,
        model_id: voice,
        voice_settings_stability: 0.75,
        voice_settings_similarity_boost: 0.75,
        speed: speed,
      },
    });

    if (!output) {
      return NextResponse.json(
        { error: "Failed to generate audio from Replicate." },
        { status: 500 }
      );
    }

    console.log(output); // Inspect the structure of 'output'

    let audio: string;

    if (typeof output === "string") {
      // If 'output' is directly the URL
      audio = output;
    } else if (
      typeof output === "object" &&
      output !== null &&
      "audio" in output
    ) {
      // If 'output' is an object with an 'audio' property
      audio = output.audio as string; // Or output.url, check which property contains the URL
    } else if (
      typeof output === "object" &&
      output !== null &&
      "url" in output
    ) {
      // If 'output' is an object with an 'url' property
      audio = output.url as string; // Or output.url, check which property contains the URL
    } else {
      console.error("Unexpected output format from Replicate API:", output);
      return NextResponse.json(
        { error: "Unexpected output format from Replicate API" },
        { status: 500 }
      );
    }

    return NextResponse.json({ audio }); // Return the audio URL in the response

  } catch (error: any) {
    console.error("Audio generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate audio" },
      { status: 500 }
    );
  }
}


//  MINIMAX music generation api

export async function POST_MUSIC(req: NextRequest) {
  try {
    const { lyrics, bitrate, song_file, sample_rate } = await req.json();

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN environment variable is not set." },
        { status: 500 }
      );
    }

    const input = {
      lyrics: lyrics,
      bitrate: bitrate,
      song_file: song_file,
      sample_rate: sample_rate
    };

    const output = await replicate.run("minimax/music-01", { input });
    console.log(output);

    if (!output) {
      return NextResponse.json(
        { error: "Failed to generate music from Replicate." },
        { status: 500 }
      );
    }

    let audio: string;

    if (typeof output === "string") {
      // If 'output' is directly the URL
      audio = output;
    } else if (
      typeof output === "object" &&
      output !== null &&
      "audio" in output
    ) {
      // If 'output' is an object with an 'audio' property
      audio = output.audio as string; // Or output.url, check which property contains the URL
    } else if (
      typeof output === "object" &&
      output !== null &&
      "url" in output
    ) {
      // If 'output' is an object with an 'url' property
      audio = output.url as string; // Or output.url, check which property contains the URL
    } else {
      console.error("Unexpected output format from Replicate API:", output);
      return NextResponse.json(
        { error: "Unexpected output format from Replicate API" },
        { status: 500 }
      );
    }
     return NextResponse.json({ audio }); // Return the audio URL in the response
  } catch (error: any) {
    console.error("Music generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate music" },
      { status: 500 }
    );
  }
}