import * as React from "react"
import { Brain, FileText, Image, Mic, Video, FileCode, Globe, BotIcon as Robot, BookOpen, Search, CheckSquare, Database, Workflow } from 'lucide-react'


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { v4 } from "uuid"
const id = v4()
const data = {
  navMain: [
    {
        title: "Research Agent",
        icon: BookOpen,
        items: [
          { title: "New Chat", icon: FileText, url: `/research/${id}` },
       
        ],
      },
    {
      title: "Research & Data Processing",
      icon: BookOpen,
      items: [
        { title: "Auto-Summarization", icon: FileText, url: "#" },
        { title: "Semantic Search", icon: Search, url: "#" },
        { title: "Fact-Checking", icon: CheckSquare, url: "#" },
        { title: "Data Extraction", icon: Database, url: "#" },
        { title: "Research Workflows", icon: Workflow, url: "#" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Brain className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">AI Research Assistant</span>
                  <span className="">Playground</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
     
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((section, index) => (
              <Collapsible
                key={section.title}
                defaultOpen={true}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <section.icon className="mr-2 h-4 w-4" />
                      {section.title}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {section.items?.length && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={item.url}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
