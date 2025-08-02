
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { NoteTemplate } from "@/lib/types"

interface NoteTemplatePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template: NoteTemplate | null
}

export function NoteTemplatePreviewDialog({ open, onOpenChange, template }: NoteTemplatePreviewDialogProps) {
  if (!template) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">{template.templateName}</DialogTitle>
          <DialogDescription>Note Template Preview</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Note Title</p>
            <p className="text-lg font-semibold">{template.noteTitle}</p>
          </div>
          {template.noteContent && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Note Content</p>
              <p className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-md">{template.noteContent}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
