import { NextResponse } from "next/server"
import { getOAuth2Client, getAuthUrl } from "@/lib/google/auth"

export async function GET() {
  try {
    const oauth2Client = getOAuth2Client()
    const url = getAuthUrl(oauth2Client)
    return NextResponse.json({ url })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 })
  }
}

