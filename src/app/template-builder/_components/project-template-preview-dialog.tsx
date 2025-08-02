
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { ProjectTemplate } from "@/lib/types"

interface ProjectTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: ProjectTemplate | null
}

export function ProjectTemplatePreviewDialog({ open, onOpenChange, template }: ProjectTemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{template.templateName}</DialogTitle>
          <DialogDescription>Project Template Preview</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Project Title</p>
            <p className="text-lg font-semibold">{template.projectTitle}</p>
          </div>
           <div>
            <p className="text-sm font-medium text-muted-foreground">Service</p>
            <p><Badge variant="secondary">{template.projectService}</Badge></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
