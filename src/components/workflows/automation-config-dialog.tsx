"use client"

import * as React from "react"
import { Bot, Clock, Save, Settings, Shield } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
<<<<<<< HEAD
import { useToast } from "../../hooks/use-toast"
=======
import { useToast } from "@/hooks/use-toast"
>>>>>>> 157dbbd44305f033179137915d3429a7d0bed63c

// Define the form schema
const formSchema = z.object({
  general: z.object({
    maxConcurrentWorkflows: z.number().min(1).max(20),
    retryAttempts: z.number().min(0).max(10),
    notifyOnError: z.boolean(),
    logLevel: z.string(),
  }),
  ai: z.object({
    defaultModel: z.string(),
    temperature: z.number().min(0).max(1),
    maxTokens: z.number().min(100).max(4000),
    safetyFilter: z.boolean(),
    contentModeration: z.boolean(),
  }),
  scheduling: z.object({
    timezone: z.string(),
    workingHours: z.object({
      enabled: z.boolean(),
      start: z.string(),
      end: z.string(),
    }),
    batchProcessing: z.object({
      enabled: z.boolean(),
      interval: z.number().min(1).max(60),
      maxBatchSize: z.number().min(1).max(100),
    }),
  }),
  security: z.object({
    maxDailyEmails: z.number().min(1),
    sensitiveDataHandling: z.string(),
    requireApproval: z.boolean(),
  }),
})

type FormValues = z.infer<typeof formSchema>

interface AutomationConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutomationConfigDialog({ open, onOpenChange }: AutomationConfigDialogProps) {
  const { toast } = useToast()

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      general: {
        maxConcurrentWorkflows: 5,
        retryAttempts: 3,
        notifyOnError: true,
        logLevel: "info",
      },
      ai: {
        defaultModel: "gpt-4",
        temperature: 0.7,
        maxTokens: 2000,
        safetyFilter: true,
        contentModeration: true,
      },
      scheduling: {
        timezone: "UTC",
        workingHours: {
          enabled: true,
          start: "09:00",
          end: "17:00",
        },
        batchProcessing: {
          enabled: true,
          interval: 5,
          maxBatchSize: 50,
        },
      },
      security: {
        maxDailyEmails: 1000,
        sensitiveDataHandling: "mask",
        requireApproval: false,
      },
    },
  })

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (data: FormValues) => {
    console.log(data)
    toast({
      title: "Settings saved",
      description: "Your automation settings have been updated.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Automation Settings</DialogTitle>
          <DialogDescription>Configure global settings for email workflow automation</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">
                  <Settings className="w-4 h-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Settings
                </TabsTrigger>
                <TabsTrigger value="scheduling">
                  <Clock className="w-4 h-4 mr-2" />
                  Scheduling
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure basic workflow automation settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="general.maxConcurrentWorkflows"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Concurrent Workflows</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Maximum number of workflows that can run simultaneously</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="general.retryAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Retry Attempts</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Number of times to retry failed workflows</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="general.logLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Log Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select log level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="debug">Debug</SelectItem>
                              <SelectItem value="info">Info</SelectItem>
                              <SelectItem value="warn">Warning</SelectItem>
                              <SelectItem value="error">Error</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="general.notifyOnError"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Error Notifications</FormLabel>
                            <FormDescription>Receive notifications when workflows fail</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Similar structure for other tabs */}
              {/* AI Settings Tab */}
              <TabsContent value="ai" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Configuration</CardTitle>
                    <CardDescription>Configure AI model settings and parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ai.defaultModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default AI Model</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select AI model" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 (Faster)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ai.temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Controls response randomness (0-1)</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ai.maxTokens"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Tokens</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>Maximum length of AI responses</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="ai.safetyFilter"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Safety Filter</FormLabel>
                            <FormDescription>Filter inappropriate content in AI responses</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ai.contentModeration"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Content Moderation</FormLabel>
                            <FormDescription>Review AI-generated content before sending</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Scheduling Tab */}
              <TabsContent value="scheduling" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduling Settings</CardTitle>
                    <CardDescription>Configure workflow timing and processing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="scheduling.timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC">UTC</SelectItem>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="scheduling.workingHours"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Working Hours</FormLabel>
                                <FormDescription>Only run workflows during specified hours</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value.enabled}
                                  onCheckedChange={(checked) => {
                                    form.setValue("scheduling.workingHours", { ...field.value, enabled: checked })
                                  }}
                                />
                              </FormControl>
                            </div>
                            {field.value.enabled && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <FormLabel>Start Time</FormLabel>
                                  <Input
                                    type="time"
                                    value={field.value.start}
                                    onChange={(e) => {
                                      form.setValue("scheduling.workingHours", {
                                        ...field.value,
                                        start: e.target.value,
                                      })
                                    }}
                                  />
                                </div>
                                <div>
                                  <FormLabel>End Time</FormLabel>
                                  <Input
                                    type="time"
                                    value={field.value.end}
                                    onChange={(e) => {
                                      form.setValue("scheduling.workingHours", { ...field.value, end: e.target.value })
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Separator />
                      <FormField
                        control={form.control}
                        name="scheduling.batchProcessing"
                        render={({ field }) => (
                          <FormItem className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Batch Processing</FormLabel>
                                <FormDescription>Process emails in batches for better performance</FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value.enabled}
                                  onCheckedChange={(checked) => {
                                    form.setValue("scheduling.batchProcessing", { ...field.value, enabled: checked })
                                  }}
                                />
                              </FormControl>
                            </div>
                            {field.value.enabled && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <FormLabel>Batch Interval (minutes)</FormLabel>
                                  <Input
                                    type="number"
                                    value={field.value.interval}
                                    onChange={(e) => {
                                      form.setValue("scheduling.batchProcessing", {
                                        ...field.value,
                                        interval: Number(e.target.value),
                                      })
                                    }}
                                  />
                                </div>
                                <div>
                                  <FormLabel>Max Batch Size</FormLabel>
                                  <Input
                                    type="number"
                                    value={field.value.maxBatchSize}
                                    onChange={(e) => {
                                      form.setValue("scheduling.batchProcessing", {
                                        ...field.value,
                                        maxBatchSize: Number(e.target.value),
                                      })
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security and compliance settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="security.maxDailyEmails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Daily Emails</FormLabel>
                          <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                          <FormDescription>Maximum number of automated emails per day</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="security.sensitiveDataHandling"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sensitive Data Handling</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select handling method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mask">Mask Data</SelectItem>
                              <SelectItem value="encrypt">Encrypt</SelectItem>
                              <SelectItem value="remove">Remove</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>How to handle sensitive data in emails</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="security.requireApproval"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Require Approval</FormLabel>
                              <FormDescription>Require manual approval for automated emails</FormDescription>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

