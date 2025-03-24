"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { LinkedinIcon, TwitterIcon, InstagramIcon, PlusIcon, CheckIcon, XIcon } from "lucide-react"

interface SocialMediaAccountsProps {
  onConnect: (platform: string) => void;
  accounts: { id: string; platform: string; username: string; connected: boolean }[]; // Pass accounts from parent
  fetchAccounts: () => Promise<void>; // Function to refresh accounts
}

export function SocialMediaAccounts({ onConnect, accounts, fetchAccounts }: SocialMediaAccountsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchAccounts(); // Fetch accounts on component mount
  }, [fetchAccounts]);

  const handleConnectClick = async (platform: string) => {
    if (platform === "linkedin") {
      // LinkedIn OAuth flow
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID; //Store Client Id in .env
      const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || ""); // Replace with your redirect URI
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=r_liteprofile,r_emailaddress,w_member_social`;
      window.location.href = authUrl; // Redirect to LinkedIn auth page

      // After the user authenticates, LinkedIn will redirect them back to your `redirectUri`
      // with an authorization code in the query parameters.

      // This authorization code needs to be sent to your server to exchange for an access token.
      // See below, how to handle the redirect in the `useEffect` hook and then trigger `onConnect` with the `code`
    } else {
      onConnect(platform); // For other platforms, use the original `onConnect` function
    }
  };

  // Handle LinkedIn OAuth redirect (parse code from URL)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); //Gets code from the linkedin redirects
    if (code) {
      // Pass code to parent component to be handled
      onConnect('linkedin'); // Signal that LinkedIn is connected, and let the parent handle state updates
      // Clear the code from the URL without causing a full page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [onConnect]);

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return <LinkedinIcon className="h-5 w-5 text-blue-600" />;
      case "twitter":
        return <TwitterIcon className="h-5 w-5 text-sky-500" />;
      case "instagram":
        return <InstagramIcon className="h-5 w-5 text-pink-600" />;
      default:
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn";
      case "twitter":
        return "Twitter";
      case "instagram":
        return "Instagram";
      default:
        return platform;
    }
  };

  return (
    <div className="px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Connected Accounts</h2>
        <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

    

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Social Media Account</DialogTitle>
            <DialogDescription>Choose a platform to connect your social media account.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => {
                setIsDialogOpen(false)
                handleConnectClick("linkedin")
              }}
            >
              <LinkedinIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div className="text-left">
                <div className="font-medium">LinkedIn</div>
                <div className="text-xs text-muted-foreground">Connect your professional network</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => {
                setIsDialogOpen(false)
                handleConnectClick("twitter")
              }}
            >
              <TwitterIcon className="h-5 w-5 text-sky-500 mr-3" />
              <div className="text-left">
                <div className="font-medium">Twitter</div>
                <div className="text-xs text-muted-foreground">Connect your Twitter account</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => {
                setIsDialogOpen(false)
                handleConnectClick("instagram")
              }}
            >
              <InstagramIcon className="h-5 w-5 text-pink-600 mr-3" />
              <div className="text-left">
                <div className="font-medium">Instagram</div>
                <div className="text-xs text-muted-foreground">Connect your Instagram account</div>
              </div>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}