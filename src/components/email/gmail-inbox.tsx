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
      const emails = await getEmails(token)
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

