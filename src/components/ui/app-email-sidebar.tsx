<<<<<<< HEAD
// AppSidebar.tsx
"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  Mail,
  Workflow,
  Loader2,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth"; // Import Session type from next-auth
import { NavUser } from "./nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { AiEmailActions } from "@/components/ai/ai-email-actions";
import Link from "next/link";

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
  nextPageToken?: string;
  resultSizeEstimate: number;
}

// Define user type
interface User {
  name?: string ;
  email?: string | null | undefined;
  image?: string | null | undefined;
  avatar?: string | null | undefined; // Corrected property name
  id?: string;
  googleAccessToken?: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [activeItem, setActiveItem] = React.useState({
    title: "Inbox",
    url: "/dashboard",
    icon: Inbox,
    isActive: true,
  });
  const [emails, setEmails] = React.useState<GmailMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { setOpen } = useSidebar();

  const handleReAuthorize = () => {
    signIn('google')
  };

  React.useEffect(() => {
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
                console.error(
                  `Failed to fetch message details for ${message.id}: ${messageResponse.status}`
                );
                return null;
              }
              const messageData: GmailMessage = await messageResponse.json();
              return messageData;
            })
          );

          const validMessageDetails = messageDetails.filter(
            (message): message is GmailMessage => message !== null
          );

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
  }, [session, activeItem]); // Refetch when the active item or session changes

  const navMain = [
    {
      title: "Inbox",
      url: "/dashboard",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Email Dashboard",
      url: "/dashboard/email",
      icon: Mail,
      isActive: false,
    },
    {
      title: "Automation",
      url: "/dashboard/automation/workflow",
      icon: Workflow,
      isActive: false,
    },
    {
      title: "Drafts",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ];

  // Safely access session.user and provide a default value
  const user = (session?.user as User) || {
    name: null,
    email: null,
    image: null,
    avatar: null,
    id: null,
    googleAccessToken: null,
  };

  // Type assertion to match NavUser's expected type
  const navUserProps: {
    name: string;
    email: string;
    avatar: string;
  } = {
    name: user.name || "Guest", // Provide a default value
    email: user.email || "No email", // Provide a default value
    avatar: user.avatar || "/default-avatar.png", // Provide a default value
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        // Fetch new emails when an item is clicked
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <Link href={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={navUserProps} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {status === "loading" ? (
                <Loader2 className="animate "/>
              ) : error ? (
                <div>
                  Error: {error}
                  <button  onClick={handleReAuthorize}>
                 Authorize
                  </button>
                </div>
              ) : emails.length > 0 ? (
                emails.map((email) => {
                  // Extract the required properties from the GmailMessage
                  const name = email.payload.headers.find((header) => header.name === "From")?.value;
                  const subject = email.payload.headers.find((header) => header.name === "Subject")?.value;
                  const teaser = email.snippet;

                  return (
                    <div
                      key={email.id}
                      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <div className="flex w-full items-center gap-2">
                        <span>
                          {name || "Unknown Sender"}
                        </span>
                        <span className="ml-auto text-xs">
                          {new Date(parseInt(email.internalDate)).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="font-medium">
                        {subject || "No Subject"}
                      </span>
                      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                        {teaser}
                      </span>
                      <AiEmailActions email={{ name, subject, teaser }} />
                    </div>
                  );
                })
              ) : (
                <div>
                  No emails found.
                  {session && (
                    <button onClick={handleReAuthorize}>Grant Gmail Access</button>
                  )}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
=======
// AppSidebar.tsx
"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  Mail,
  Workflow,
  Loader2,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth"; // Import Session type from next-auth
import { NavUser } from "./nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { AiEmailActions } from "@/components/ai/ai-email-actions";
import Link from "next/link";

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
  nextPageToken?: string;
  resultSizeEstimate: number;
}

// Define user type
interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  avatar?: string | null | undefined; // Corrected property name
  id?: string;
  accessToken?: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const [activeItem, setActiveItem] = React.useState({
    title: "Inbox",
    url: "/dashboard",
    icon: Inbox,
    isActive: true,
  });
  const [emails, setEmails] = React.useState<GmailMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { setOpen } = useSidebar();

  const handleReAuthorize = () => {
    signIn("google", {
      callbackUrl: window.location.href, // Redirect back to the current page after authorization
    });
  };

  React.useEffect(() => {
    const fetchEmails = async () => {
      if (session?.user?.accessToken) {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10`,
            {
              headers: {
                Authorization: `Bearer ${session.user.accessToken}`,
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
                    Authorization: `Bearer ${session.user.accessToken}`,
                  },
                }
              );
              if (!messageResponse.ok) {
                console.error(
                  `Failed to fetch message details for ${message.id}: ${messageResponse.status}`
                );
                return null;
              }
              const messageData: GmailMessage = await messageResponse.json();
              return messageData;
            })
          );

          const validMessageDetails = messageDetails.filter(
            (message): message is GmailMessage => message !== null
          );

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
  }, [session, activeItem]); // Refetch when the active item or session changes

  const navMain = [
    {
      title: "Inbox",
      url: "/dashboard",
      icon: Inbox,
      isActive: true,
    },
    {
      title: "Email Dashboard",
      url: "/dashboard/email",
      icon: Mail,
      isActive: false,
    },
    {
      title: "Automation",
      url: "/dashboard/automation/workflow",
      icon: Workflow,
      isActive: false,
    },
    {
      title: "Drafts",
      url: "#",
      icon: File,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ];

  // Safely access session.user and provide a default value
  const user = (session?.user as User) || {
    name: null,
    email: null,
    image: null,
    avatar: null,
    id: null,
    accessToken: null,
  };

  // Type assertion to match NavUser's expected type
  const navUserProps: {
    name: string;
    email: string;
    avatar: string;
  } = {
    name: user.name || "Guest", // Provide a default value
    email: user.email || "No email", // Provide a default value
    avatar: user.avatar || "/default-avatar.png", // Provide a default value
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Acme Inc</span>
                    <span className="truncate text-xs">Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        // Fetch new emails when an item is clicked
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <Link href={item.url}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={navUserProps} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {status === "loading" ? (
                <Loader2 className="animate "/>
              ) : error ? (
                <div>
                  Error: {error}
                  <button onClick={handleReAuthorize}>
                    Re-authorize Gmail Access
                  </button>
                </div>
              ) : emails.length > 0 ? (
                emails.map((email) => {
                  // Extract the required properties from the GmailMessage
                  const name = email.payload.headers.find((header) => header.name === "From")?.value;
                  const subject = email.payload.headers.find((header) => header.name === "Subject")?.value;
                  const teaser = email.snippet;

                  return (
                    <div
                      key={email.id}
                      className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <div className="flex w-full items-center gap-2">
                        <span>
                          {name || "Unknown Sender"}
                        </span>
                        <span className="ml-auto text-xs">
                          {new Date(parseInt(email.internalDate)).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className="font-medium">
                        {subject || "No Subject"}
                      </span>
                      <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                        {teaser}
                      </span>
                      <AiEmailActions email={{ name, subject, teaser }} />
                    </div>
                  );
                })
              ) : (
                <div>
                  No emails found.
                  {session && (
                    <button onClick={handleReAuthorize}>Grant Gmail Access</button>
                  )}
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c
