import { google } from "googleapis"
import type { OAuth2Client } from "google-auth-library"

// Initialize OAuth2 client
export function getOAuth2Client(): OAuth2Client {
  return new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_ID,
    process.env.AUTH_GOOGLE_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  )
}

// Generate authentication URL
export function getAuthUrl(oauth2Client: OAuth2Client): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
    ],
    prompt: "consent",
  })
}

// Get access token from code
export async function getTokens(oauth2Client: OAuth2Client, code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

// Initialize Gmail client
export function getGmailClient(oauth2Client: OAuth2Client) {
  return google.gmail({ version: "v1", auth: oauth2Client })
}
