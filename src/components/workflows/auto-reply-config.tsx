"use client"

import * as React from "react"
import { Bot, Plus, Save, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface Rule {
  id: string
  condition: string
  value: string
}

export function AutoReplyConfig() {
  const [rules, setRules] = React.useState<Rule[]>([])
  const [template, setTemplate] = React.useState("")
  const { toast } = useToast()

  const addRule = () => {
    const newRule: Rule = {
      id: Math.random().toString(36).substr(2, 9),
      condition: "",
      value: "",
    }
    setRules([...rules, newRule])
  }

  const removeRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule)))
  }

  const handleSave = () => {
    toast({
      title: "Configuration saved",
      description: "Your auto-reply settings have been updated",
    })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Auto-Reply Configuration</CardTitle>
          <CardDescription>Set up rules and templates for automatic email responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Auto-Reply</Label>
              <Switch />
            </div>

            <div className="grid gap-2">
              <Label>Business Hours</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Start Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>
                <div>
                  <Label className="text-xs">End Time</Label>
                  <Input type="time" defaultValue="17:00" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rules</Label>
                <Button onClick={addRule} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-start gap-2 rounded-lg border p-4">
                    <Select value={rule.condition} onValueChange={(value) => updateRule(rule.id, "condition", value)}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subject_contains">Subject Contains</SelectItem>
                        <SelectItem value="from_domain">From Domain</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Enter value"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, "value", e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Default Response Template</Label>
              <Textarea
                placeholder="Enter your default auto-reply template..."
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {"{name}"}, {"{company}"}, {"{date}"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline">
            <Bot className="mr-2 h-4 w-4" />
            Test Auto-Reply
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

