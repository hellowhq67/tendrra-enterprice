// app/page.tsx
"use client"

import { Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { WorkflowBuilder } from "@/components/workflows/workflow-builder"
import { ConnectedAccounts } from "@/components/account/connected-accounts"
import { AutoReplyConfig } from "@/components/workflows/auto-reply-config"
import { TemplateGenerator } from "@/components/workflows/template-generator"
import { AutomationConfigDialog } from "@/components/workflows/automation-config-dialog"
import React from "react"
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

export default function Page() {
  const [configOpen, setConfigOpen] = React.useState(false)
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
                  <BreadcrumbPage className="text-[#9ca3af]">Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Email Automation</h2>
        <Button variant="outline" onClick={() => setConfigOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Configure Automation
        </Button>
      </div>
      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="auto-reply">Auto-Reply</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
          
        </TabsList>
        <TabsContent value="workflows" className="space-y-4">
          <WorkflowBuilder />
        </TabsContent>
        <TabsContent value="auto-reply" className="space-y-4">
          <AutoReplyConfig />
        </TabsContent>
        <TabsContent value="templates" className="space-y-4">
          <TemplateGenerator />
        </TabsContent>
        <TabsContent value="accounts" className="space-y-4">
          <ConnectedAccounts />
        </TabsContent>
         
      </Tabs>

      <AutomationConfigDialog open={configOpen} onOpenChange={setConfigOpen} />
    </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
