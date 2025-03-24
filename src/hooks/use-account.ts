"use client"

import { useState } from "react"
import { useToast } from "./use-toast"

export function useAccount() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const connectAccount = async (accountData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      })

      if (!response.ok) throw new Error("Failed to connect account")

      const data = await response.json()
      toast({
        title: "Success",
        description: "Account connected successfully",
      })
      return data.account
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getAccounts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/accounts")
      if (!response.ok) throw new Error("Failed to fetch accounts")

      const data = await response.json()
      return data.accounts
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch accounts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    connectAccount,
    getAccounts,
  }
}
