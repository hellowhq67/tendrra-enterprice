"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,

  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: { type: string; label: string }) => void
}

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [taskType, setTaskType] = React.useState("default")
  const [taskLabel, setTaskLabel] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddTask({ type: taskType, label: taskLabel })
    setTaskType("default")
    setTaskLabel("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-type" className="text-right">
                Task Type
              </Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="output">Output</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-label" className="text-right">
                Task Label
              </Label>
              <Input
                id="task-label"
                value={taskLabel}
                onChange={(e) => setTaskLabel(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div>
            <Button type="submit">Add Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

