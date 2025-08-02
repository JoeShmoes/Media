
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
import type { OutreachTemplate } from "@/lib/types"

interface OutreachTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: OutreachTemplate | null
}

export function OutreachTemplatePreviewDialog({ open, onOpenChange, template }: OutreachTemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{template.templateName}</DialogTitle>
          <DialogDescription>
            <Badge variant="outline">{template.outreachType}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {template.outreachSubject && (
            <div>
                <p className="text-sm font-medium text-muted-foreground">Subject</p>
                <p className="text-lg font-semibold">{template.outreachSubject}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Body</p>
            <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{template.outreachBody}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
