import Dashboard from "@/components/Dashboard/app-dashboard"
import { AppSidebar } from "@/components/Dashboard/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bot, Inbox, Mail, MessageSquare } from "lucide-react"

import { AiEmailActions } from "@/components/ai/ai-email-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - you can move this to a separate file
const emails = [
  {
    name: "William Smith",
    email: "williamsmith@example.com",
    subject: "Meeting Tomorrow",
    date: "09:34 AM",
    teaser:
      "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
    category: "inbox",
  },
  {
    name: "Alice Smith",
    email: "alicesmith@example.com",
    subject: "Re: Project Update",
    date: "Yesterday",
    teaser: "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
    category: "inbox",
  },
  {
    name: "Bob Johnson",
    email: "bobjohnson@example.com",
    subject: "Weekend Plans",
    date: "2 days ago",
    teaser:
      "Hey everyone! I'm thinking of organizing a team outing this weekend.\nWould you be interested in a hiking trip or a beach day?",
    category: "social",
  },
]

const stats = [
  {
    title: "Total Emails",
    value: "234",
    description: "Emails in your inbox",
    icon: Mail,
  },
  {
    title: "AI Responses",
    value: "45",
    description: "Generated this week",
    icon: Bot,
  },
  {
    title: "Quick Replies",
    value: "12",
    description: "Sent today",
    icon: MessageSquare,
  },
  {
    title: "Unread",
    value: "23",
    description: "Pending emails",
    icon: Inbox,
  },
]
export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar className="border-r border-sidebar-border" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-sidebar-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-white" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink className="text-white" href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-white" />
               
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#9ca3af]">email</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Email Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Emails</CardTitle>
                <CardDescription>Your latest emails and AI interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emails.map((email) => (
                  <div key={email.email} className="flex flex-col space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{email.name}</p>
                        <p className="text-sm text-muted-foreground">{email.email}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{email.date}</span>
                    </div>
                    <p className="font-medium">{email.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{email.teaser}</p>
                    <AiEmailActions email={email} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>AI Analytics</CardTitle>
                <CardDescription>Your AI assistant usage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium">Response Time</p>
                      <p className="text-xs text-muted-foreground">Average AI response generation</p>
                    </div>
                    <p className="text-2xl font-bold">1.2s</p>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium">Accuracy Rate</p>
                      <p className="text-xs text-muted-foreground">Based on user feedback</p>
                    </div>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium">Training Sessions</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">AI Credits Used</p>
                      <p className="text-xs text-muted-foreground">Monthly quota</p>
                    </div>
                    <p className="text-2xl font-bold">67%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
      </SidebarInset>
    </SidebarProvider>
  )
}


