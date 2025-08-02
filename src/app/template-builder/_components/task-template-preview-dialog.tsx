
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { TaskTemplate } from "@/lib/types"

interface TaskTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: TaskTemplate | null
}

export function TaskTemplatePreviewDialog({ open, onOpenChange, template }: TaskTemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{template.templateName}</DialogTitle>
          <DialogDescription>Task Template Preview</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Task Name</p>
            <p className="text-lg font-semibold">{template.taskName}</p>
          </div>
          {template.taskDescription && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Task Description</p>
              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{template.taskDescription}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
