"use client"

import * as React from "react"
import { Bot, Mail, Play, Plus, Save, Settings2, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Add these imports at the top
import { useWorkflow } from "../../hooks/use-workflow"
import { WorkflowConfigDialog } from "./workflow-config-dialog"

interface WorkflowStep {
  id: string
  type: string
  name: string
  config: Record<string, any>
  enabled: boolean
}

interface Workflow {
  id: string
  name: string
  description: string
  steps: WorkflowStep[]
  enabled: boolean
}

const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Customer Support Auto-Reply",
    description: "Automatically analyze and respond to support emails",
    enabled: true,
    steps: [
      {
        id: "step1",
        type: "trigger",
        name: "New Support Email",
        config: {
          mailbox: "support@company.com",
          conditions: ["subject contains 'help'"],
        },
        enabled: true,
      },
      {
        id: "step2",
        type: "ai",
        name: "Analyze Sentiment",
        config: {
          model: "sentiment-analysis",
        },
        enabled: true,
      },
      {
        id: "step3",
        type: "action",
        name: "Generate Response",
        config: {
          template: "support-reply",
        },
        enabled: true,
      },
    ],
  },
  {
    id: "2",
    name: "Lead Qualification",
    description: "Qualify sales leads from incoming emails",
    enabled: false,
    steps: [
      {
        id: "step1",
        type: "trigger",
        name: "New Sales Email",
        config: {
          mailbox: "sales@company.com",
        },
        enabled: true,
      },
      {
        id: "step2",
        type: "ai",
        name: "Score Lead",
        config: {
          model: "lead-scoring",
        },
        enabled: true,
      },
    ],
  },
]

// Inside the WorkflowBuilder component
export function WorkflowBuilder() {
  const { isLoading, saveWorkflow } = useWorkflow()

  // Add this to your existing handleSave function
  const handleSave = async (workflow: any) => {
    await saveWorkflow(workflow)
  }

  const [workflows, setWorkflows] = React.useState<Workflow[]>(sampleWorkflows)
  // Add these states to your WorkflowBuilder component
  const [configOpen, setConfigOpen] = React.useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<Workflow | null>(null)

  const handleEnableWorkflow = (workflowId: string, enabled: boolean) => {
    setWorkflows(workflows.map((w) => (w.id === workflowId ? { ...w, enabled } : w)))
  }

  // Add this handler
  const handleConfigureWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow)
    setConfigOpen(true)
  }

  // Add this handler
  const handleSaveWorkflow = (updatedWorkflow: Workflow) => {
    setWorkflows(workflows.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Workflows</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[540px]">
            <SheetHeader>
              <SheetTitle>Create New Workflow</SheetTitle>
              <SheetDescription>Configure your automated email workflow with AI assistance.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Workflow name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what this workflow does" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="trigger">Trigger</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-email">New Email</SelectItem>
                    <SelectItem value="email-replied">Email Replied</SelectItem>
                    <SelectItem value="email-opened">Email Opened</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ai-action">AI Action</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analyze">Analyze Content</SelectItem>
                    <SelectItem value="generate">Generate Response</SelectItem>
                    <SelectItem value="classify">Classify Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Workflow
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  {workflow.name}
                </CardTitle>
                <Switch
                  checked={workflow.enabled}
                  onCheckedChange={(checked) => handleEnableWorkflow(workflow.id, checked)}
                />
              </div>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workflow.steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {step.type === "trigger" && <Mail className="h-4 w-4" />}
                    {step.type === "ai" && <Bot className="h-4 w-4" />}
                    {step.type === "action" && <Play className="h-4 w-4" />}
                    <span>{step.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" size="sm" onClick={() => handleConfigureWorkflow(workflow)}>
                <Settings2 className="mr-2 h-4 w-4" />
                Configure
              </Button>
              <Button variant="secondary" size="sm">
                <Play className="mr-2 h-4 w-4" />
                Run Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedWorkflow && (
        <WorkflowConfigDialog
          workflow={selectedWorkflow}
          open={configOpen}
          onOpenChange={setConfigOpen}
          onSave={handleSaveWorkflow}
        />
      )}
    </div>
  )
}

