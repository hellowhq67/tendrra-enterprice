"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGmail } from "@/hooks/use-gmail"

export function GmailConnect() {
  const { isLoading, connectGmail } = useGmail()


  const handleConnect = async () => {
    const response = await fetch("/api/gmail/auth")
    const { url } = await response.json()

    // Open popup window for authentication
    window.open(url, "Gmail Authentication", "width=600,height=700,left=200,top=100")
  }

  return (
    <Button onClick={ connectGmail} disabled={isLoading}>
      <Mail className="mr-2 h-4 w-4" />
      {isLoading ? "Connecting..." : "Connect Gmail"}
    </Button>
  )
}
