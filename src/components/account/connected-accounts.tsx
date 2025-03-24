"use client"

import { Check, Mail, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useAccount } from "@/hooks/use-account"

const accounts = [
  {
    id: "gmail",
    name: "Gmail",
    icon: "/gmail-icon.svg",
    connected: true,
    email: "user@gmail.com",
  },
  {
    id: "outlook",
    name: "Outlook",
    icon: "/outlook-icon.svg",
    connected: false,
  },
  {
    id: "yahoo",
    name: "Yahoo Mail",
    icon: "/yahoo-icon.svg",
    connected: false,
  },
]

const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates to Slack channels",
    icon: "/slack-icon.svg",
    connected: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Save email summaries and notes to Notion",
    icon: "/notion-icon.svg",
    connected: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with thousands of apps through Zapier",
    icon: "/zapier-icon.svg",
    connected: false,
  },
]

export function ConnectedAccounts() {
  const { isLoading, connectAccount, getAccounts } = useAccount()

  const handleConnect = async (accountType: string) => {
    await connectAccount({
      type: accountType,
      email: "user@example.com", // In real app, get from OAuth
      name: "Work Email",
      accessToken: "dummy-token", // In real app, get from OAuth
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Email Accounts</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.name}</CardTitle>
                      {account.connected && <CardDescription>{account.email}</CardDescription>}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {account.connected ? (
                  <Button variant="outline" className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => handleConnect(account.name)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Connect {account.name}</DialogTitle>
                        <DialogDescription>
                          Connect your {account.name} account to enable email automation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center py-6">
                        <Button size="lg">
                          <Mail className="mr-2 h-4 w-4" />
                          Connect with {account.name}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{integration.name}</CardTitle>
                      <CardDescription className="text-sm">{integration.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {integration.connected ? (
                  <Button variant="outline" className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </Button>
                ) : (
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

