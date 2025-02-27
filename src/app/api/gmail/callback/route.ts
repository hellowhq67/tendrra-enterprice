import { NextResponse } from "next/server"
import { getOAuth2Client, getTokens } from "@/lib/google/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 })
    }

    const oauth2Client = getOAuth2Client()
    const tokens = await getTokens(oauth2Client, code)
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gmail Authentication</title>
        </head>
        <body>
          <script>
            window.opener.postMessage({ type: 'GMAIL_AUTH_SUCCESS', token: '${tokens.access_token}' }, '*');
            window.localStorage.setItem('gmail_token', '${tokens.access_token}');
            window.close();
          </script>
          <p>Authentication successful! You can close this window.</p>
        </body>
      </html>
    `

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: "Failed to get tokens" }, { status: 500 })
  }
}
