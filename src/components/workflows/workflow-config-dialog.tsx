"use client"

import * as React from "react"
import { Bot, Mail, Plus, Save, Trash, Workflow } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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

interface WorkflowConfigDialogProps {
  workflow: Workflow
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (workflow: Workflow) => void
}

export function WorkflowConfigDialog({
  workflow: initialWorkflow,
  open,
  onOpenChange,
  onSave,
}: WorkflowConfigDialogProps) {
  const [workflow, setWorkflow] = React.useState<Workflow>(initialWorkflow)
  const { toast } = useToast()

  const handleAddStep = () => {
    const newStep: WorkflowStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: "trigger",
      name: "New Step",
      config: {},
      enabled: true,
    }
    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    })
  }

  const handleRemoveStep = (stepId: string) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.filter((step) => step.id !== stepId),
    })
  }

  const handleStepChange = (stepId: string, field: string, value: any) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              [field]: value,
              config: field === "type" ? getDefaultConfigForType(value as string) : step.config,
            }
          : step,
      ),
    })
  }

  const handleStepConfigChange = (stepId: string, field: string, value: any) => {
    setWorkflow({
      ...workflow,
      steps: workflow.steps.map((step) =>
        step.id === stepId ? { ...step, config: { ...step.config, [field]: value } } : step,
      ),
    })
  }

  const getDefaultConfigForType = (type: string) => {
    switch (type) {
      case "trigger":
        return {
          event: "new_email",
          conditions: [],
        }
      case "ai":
        return {
          action: "analyze",
          model: "gpt-4",
          temperature: 0.7,
        }
      case "action":
        return {
          type: "send_email",
          template: "",
        }
      default:
        return {}
    }
  }

  const renderStepConfig = (step: WorkflowStep) => {
    switch (step.type) {
      case "trigger":
        return (
          <div className="space-y-4">
            <FormField
              name={`${step.id}-event`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Event</FormLabel>
                  <Select
                    value={step.config.event}
                    onValueChange={(value) => handleStepConfigChange(step.id, "event", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new_email">New Email</SelectItem>
                      <SelectItem value="email_opened">Email Opened</SelectItem>
                      <SelectItem value="email_clicked">Link Clicked</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name={`${step.id}-conditions`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conditions</FormLabel>
                  <Input
                    placeholder="e.g., subject contains 'urgent'"
                    value={step.config.conditions.join(", ")}
                    onChange={(e) => handleStepConfigChange(step.id, "conditions", e.target.value.split(", "))}
                  />
                  <FormDescription>Separate multiple conditions with commas</FormDescription>
                </FormItem>
              )}
            />
          </div>
        )

      case "ai":
        return (
          <div className="space-y-4">
            <FormField
              name={`${step.id}-action`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Action</FormLabel>
                  <Select
                    value={step.config.action}
                    onValueChange={(value) => handleStepConfigChange(step.id, "action", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyze">Analyze Content</SelectItem>
                      <SelectItem value="generate">Generate Response</SelectItem>
                      <SelectItem value="classify">Classify Email</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name={`${step.id}-model`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <Select
                    value={step.config.model}
                    onValueChange={(value) => handleStepConfigChange(step.id, "model", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 (Faster)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              name={`${step.id}-temperature`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={step.config.temperature}
                    onChange={(e) => handleStepConfigChange(step.id, "temperature", Number.parseFloat(e.target.value))}
                  />
                  <FormDescription>Controls randomness (0 = deterministic, 1 = creative)</FormDescription>
                </FormItem>
              )}
            />
          </div>
        )

      case "action":
        return (
          <div className="space-y-4">
            <FormField
              name={`${step.id}-type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Type</FormLabel>
                  <Select
                    value={step.config.type}
                    onValueChange={(value) => handleStepConfigChange(step.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_email">Send Email</SelectItem>
                      <SelectItem value="update_label">Update Label</SelectItem>
                      <SelectItem value="notify">Send Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {step.config.type === "send_email" && (
              <FormField
                name={`${step.id}-template`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Template</FormLabel>
                    <Textarea
                      placeholder="Enter email template..."
                      value={step.config.template}
                      onChange={(e) => handleStepConfigChange(step.id, "template", e.target.value)}
                    />
                    <FormDescription>Use {"{variables}"} for dynamic content</FormDescription>
                  </FormItem>
                )}
              />
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Workflow: {workflow.name}</DialogTitle>
          <DialogDescription>Configure the steps and actions for this workflow</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workflow Name</FormLabel>
                  <Input value={workflow.name} onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })} />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-2">
            <FormField
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={workflow.description}
                    onChange={(e) => setWorkflow({ ...workflow, description: e.target.value })}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Workflow Steps</h3>
              <Button onClick={handleAddStep} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Step
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {workflow.steps.map((step, index) => (
                <AccordionItem key={step.id} value={step.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      {step.type === "trigger" && <Mail className="h-4 w-4 text-muted-foreground" />}
                      {step.type === "ai" && <Bot className="h-4 w-4 text-muted-foreground" />}
                      {step.type === "action" && <Workflow className="h-4 w-4 text-muted-foreground" />}
                      <span>
                        Step {index + 1}: {step.name}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 px-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <FormField
                            name={`${step.id}-name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Step Name</FormLabel>
                                <Input
                                  value={step.name}
                                  onChange={(e) => handleStepChange(step.id, "name", e.target.value)}
                                />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            name={`${step.id}-type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Step Type</FormLabel>
                                <Select
                                  value={step.type}
                                  onValueChange={(value) => handleStepChange(step.id, "type", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select step type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="trigger">Trigger</SelectItem>
                                    <SelectItem value="ai">AI Action</SelectItem>
                                    <SelectItem value="action">Action</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveStep(step.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <FormField
                          name={`${step.id}-enabled`}
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Enable Step</FormLabel>
                                <FormDescription>Temporarily disable this step without removing it</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={step.enabled}
                                  onCheckedChange={(checked) => handleStepChange(step.id, "enabled", checked)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {renderStepConfig(step)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(workflow)
              onOpenChange(false)
              toast({
                title: "Workflow updated",
                description: "Your changes have been saved successfully.",
              })
            }}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

