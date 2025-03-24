import type { OAuth2Client } from "google-auth-library"
import { getGmailClient } from "./auth"

export interface EmailMessage {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  payload?: {
    headers: {
      name: string
      value: string
    }[]
    body?: {
      data?: string
    }
    parts?: {
      body: {
        data?: string
      }
    }[]
  }
  internalDate?: string
}

export interface ParsedEmail {
  id: string
  threadId: string
  subject: string
  from: string
  to: string
  date: string
  snippet: string
  body: string
}

export async function listEmails(
  oauth2Client: OAuth2Client,
  options: {
    maxResults?: number
    query?: string
    labelIds?: string[]
  } = {},
): Promise<ParsedEmail[]> {
  const gmail = getGmailClient(oauth2Client)
  const { maxResults = 20, query = "", labelIds = ["INBOX"] } = options

  try {
    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      q: query,
      labelIds,
    })

    const messages = response.data.messages || []
    const emails: ParsedEmail[] = []

    for (const message of messages) {
      const email = await getEmail(oauth2Client, message.id!)
      if (email) {
        emails.push(email)
      }
    }

    return emails
  } catch (error) {
    console.error("Error listing emails:", error)
    throw error
  }
}

export async function getEmail(oauth2Client: OAuth2Client, messageId: string): Promise<ParsedEmail | null> {
  const gmail = getGmailClient(oauth2Client)

  try {
    const response = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    })

    const message = response.data

    const headers = message.payload?.headers || []
    const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject"
    const from = headers.find((h) => h.name === "From")?.value || ""
    const to = headers.find((h) => h.name === "To")?.value || ""
    const date = headers.find((h) => h.name === "Date")?.value || ""

    // Extract body from payload
    let body = ""
    if (message.payload?.body?.data) {
      body = Buffer.from(message.payload.body.data, "base64").toString()
    } else if (message.payload?.parts) {
      const textPart = message.payload.parts.find((part) => part.mimeType === "text/plain")
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, "base64").toString()
      }
    }

    return {
      id: message.id!,
      threadId: message.threadId!,
      subject,
      from,
      to,
      date,
      snippet: message.snippet || "",
      body,
    }
  } catch (error) {
    console.error("Error getting email:", error)
    return null
  }
}

export async function getLabels(oauth2Client: OAuth2Client) {
  const gmail = getGmailClient(oauth2Client)

  try {
    const response = await gmail.users.labels.list({
      userId: "me",
    })

    return response.data.labels || []
  } catch (error) {
    console.error("Error getting labels:", error)
    throw error
  }
}

export async function sendEmail(
  oauth2Client: OAuth2Client,
  options: {
    to: string
    subject: string
    body: string
  },
) {
  const gmail = getGmailClient(oauth2Client)
  const { to, subject, body } = options

  const message = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    `To: ${to}\n`,
    `Subject: ${subject}\n\n`,
    body,
  ].join("")

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  try {
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    })

    return response.data
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}
