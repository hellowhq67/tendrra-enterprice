"use client"

import { Button } from "@/components/ui/button"
import { useGmail } from "@/hooks/use-gmail"

export function GmailConnect() {
  const { isLoading, connectGmail } = useGmail()

  return (
    <Button onClick={connectGmail} disabled={isLoading}>
      {isLoading ? "Connecting..." : "Connect Gmail"}
    </Button>
  )
}

