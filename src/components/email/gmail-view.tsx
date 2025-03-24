<<<<<<< HEAD
import React from 'react'

export default function Gmailview() {
  return (
    <div>
      
    </div>
  )
}
=======
"use client"

import * as React from "react"
import { RefreshCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useGmail } from "@/hooks/use-gmail"
import { GmailConnect } from "./gmail-connect"
import { Skeleton } from "@/components/ui/skeleton"

interface Email {
  id: string
  subject: string
  from: string
  date: string
  snippet: string
}

export function GmailView() {
  const [token, setToken] = React.useState<string | null>(null)
  const [emails, setEmails] = React.useState<Email[]>([])
  const { isLoading, getEmails } = useGmail()

  // Check for token in localStorage on mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem("gmail_token")
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  // Fetch emails when token is available
  React.useEffect(() => {
    const fetchEmails = async () => {
      if (token) {
        const fetchedEmails = await getEmails(token)
        setEmails(fetchedEmails)
      }
    }

    fetchEmails()
  }, [token, getEmails])

  const handleRefresh = async () => {
    if (token) {
      const fetchedEmails = await getEmails(token)
      setEmails(fetchedEmails)
    }
  }

  if (!token) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Connect Gmail</CardTitle>
          <CardDescription>Connect your Gmail account to view your emails</CardDescription>
        </CardHeader>
        <CardContent>
          <GmailConnect />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gmail Inbox</CardTitle>
          <CardDescription>Your latest emails from Gmail</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {emails.map((email) => (
                <Card key={email.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
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
