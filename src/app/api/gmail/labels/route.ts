import { NextResponse } from "next/server"
import { getOAuth2Client } from "@/lib/google/auth"
import { listEmails } from "@/lib/google/gmail"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = Number.parseInt(searchParams.get("maxResults") || "20")
    const query = searchParams.get("query") || ""
    const labelIds = searchParams.get("labelIds")?.split(",") || ["INBOX"]

    // In a real app, get tokens from database
    // For demo, we'll expect them in the Authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "No authorization token provided" }, { status: 401 })
    }

    const oauth2Client = getOAuth2Client()
    oauth2Client.setCredentials({ access_token: authHeader.split(" ")[1] })

    const emails = await listEmails(oauth2Client, {
      maxResults,
      query,
      labelIds,
    })

    return NextResponse.json({ emails })
  } catch (error) {
    console.error("List messages error:", error)
    return NextResponse.json({ error: "Failed to list messages" }, { status: 500 })
  }
}
