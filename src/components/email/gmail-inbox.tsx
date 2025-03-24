<<<<<<< HEAD
'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react"

// Define TypeScript interfaces for the Gmail API responses
interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessagePayloadPart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: GmailHeader[];
  body: {
    size: number;
    data: string;
  };
  parts?: GmailMessagePayloadPart[];
}

interface GmailMessagePayload {
  partId: string;
  mimeType: string;
  headers: GmailHeader[];
  body: {
    size: number;
    data: string;
  };
  parts?: GmailMessagePayloadPart[];
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: GmailMessagePayload;
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}

interface GmailListResponse {
  messages: { id: string; threadId: string }[];
  accessToken:string;
  nextPageToken?: string;
  resultSizeEstimate: number;
}

export default function GmailInbox() {
  const { data: session } = useSession()
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      if (session?.user?.googleAccessToken) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10`,
            {
              headers: {
                Authorization: `Bearer ${session.user.googleAccessToken}`,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              setError("Unauthorized. Please re-authenticate.");
            } else if (response.status === 403) {
              setError("Forbidden. You don't have permission to access this resource.");
            } else {
              setError(`Failed to fetch emails. Status: ${response.status}`);
            }
            return;
          }

          const data: GmailListResponse = await response.json();

          const messageDetails = await Promise.all(
            data.messages.map(async (message) => {
              const messageResponse = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
                {
                  headers: {
                    Authorization: `Bearer ${session.user.googleAccessToken}`,
                  },
                }
              );
              if (!messageResponse.ok) {
                  console.error(`Failed to fetch message details for ${message.id}: ${messageResponse.status}`);
                  return null;
              }
              const messageData: GmailMessage = await messageResponse.json();
              return messageData;
            })
          );

          const validMessageDetails = messageDetails.filter((message): message is GmailMessage => message !== null); // Use type predicate for filtering

          setEmails(validMessageDetails);

        } catch (err) {
          console.error("Error fetching emails:", err);
          setError("An unexpected error occurred.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEmails();
  }, [session]);

  if (loading) {
    return <div>Loading emails...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Gmail Inbox</h1>
      {emails.length > 0 ? (
        <ul>
          {emails.map((email) => (
            <li key={email.id}>
              <strong>Subject:</strong> {email.payload.headers.find(header => header.name === 'Subject')?.value || 'No Subject'}
              <br />
              <strong>From:</strong> {email.payload.headers.find(header => header.name === 'From')?.value || 'Unknown Sender'}
              <br />
               <p>{email.snippet}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>No emails found.</div>
      )}
    </div>
  );
}
=======
"use client"

import { useEffect, useState } from "react"
import { useGmail } from "@/hooks/use-gmail"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Email {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
}

export function GmailInbox({ token }: { token: string }) {
  const { isLoading, getEmails } = useGmail()
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    const fetchEmails = async () => {
      const emails = await getEmails('4/0AQSTgQHQdPCeD2a5FhKzFtjs2nC62gMlN-4VShXBoZpka5teXd-rcV4-FRN6LlZcECdKjg')
      setEmails(emails)
    }

    if (token) {
      fetchEmails()
    }
  }, [token, getEmails])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gmail Inbox</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {isLoading ? (
            <div>Loading emails...</div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <Card key={email.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-sm text-muted-foreground">{new Date(email.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{email.from}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{email.snippet}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
